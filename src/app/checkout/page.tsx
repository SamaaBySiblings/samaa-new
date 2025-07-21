"use client";

import { useState, ChangeEvent } from "react";
import { useCartStore } from "@/store/cart";
import { useCurrencyStore } from "@/store/currency";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { loadRazorpayScript } from "@/lib/loadRazorpay";
import { convertPrice, getCurrencySymbol } from "@/lib/currency";

interface FormData {
  name: string;
  email: string;
  phone: string;
  street: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const currency = useCurrencyStore((state) => state.currency);
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    street: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
  });

  const totalINR = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const format = (priceINR: number) => {
    const converted = convertPrice(priceINR, currency);
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${converted.toFixed(2)}`;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    const allFilled = Object.values(form).every((v) => v.trim() !== "");
    if (!allFilled) {
      toast.error("Please fill all the fields.");
      return;
    }

    setLoading(true);
    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      toast.error("Failed to load Razorpay SDK.");
      setLoading(false);
      return;
    }

    try {
      const createOrder = await fetch(`/api/razorpay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalINR,
          formData: form,
          cartItems: cartItems,
        }),
      });

      const data = await createOrder.json();
      if (!data.success) throw new Error("Failed to create Razorpay order");

      const razorpayOrder = data.order;

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "SAMAA by Siblings",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: (response: RazorpayResponse) => {
          const encodedPayload = btoa(
            JSON.stringify({
              cartItems,
              formData: form,
              total: totalINR,
            })
          );

          router.push(
            `/processing?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}&signature=${response.razorpay_signature}&raw=${encodedPayload}`
          );
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#000000",
        },
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment init failed", error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 font-[D-DIN] px-6 md:px-20 bg-[var(--brand-light)] min-h-screen text-[var(--brand-dark)]">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-[var(--font-logo)] mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Billing Form */}
        <div className="bg-white p-6 shadow rounded space-y-6">
          <h2 className="text-lg font-semibold">Billing Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name", "email", "phone"].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                value={form[field as keyof FormData]}
                onChange={handleChange}
                className="w-full border px-4 py-2 text-sm"
              />
            ))}
          </div>

          <h2 className="text-lg font-semibold mt-6">Shipping Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["street", "pincode", "city", "state", "country"].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                value={form[field as keyof FormData]}
                onChange={handleChange}
                className="w-full border px-4 py-2 text-sm"
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={handlePayment}
              disabled={loading}
              className={`bg-black text-white px-4 py-2 text-sm rounded transition duration-200 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
              }`}
            >
              {loading ? (
                <>
                  <span className="animate-spin border border-white border-t-transparent rounded-full h-4 w-4 inline-block mr-2" />
                  Processing...
                </>
              ) : (
                "Pay"
              )}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 shadow rounded space-y-4">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.slug} className="flex justify-between text-sm">
              <div>
                {item.name} × {item.quantity}
              </div>
              <div>{format(item.price * item.quantity)}</div>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between font-semibold text-md">
            <span>Total:</span>
            <span>{format(totalINR)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
