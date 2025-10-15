"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useCartStore } from "@/store/cart";
import { useCurrencyStore } from "@/store/currency";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { loadRazorpayScript } from "@/lib/loadRazorpay";
import { convertPrice, getCurrencySymbol } from "@/lib/currency";

declare global {
  interface Window {
    Razorpay: any;
  }
}

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.samaabysiblings.com/backend/api/v1";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
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
    country: "India",
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
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!form.name.trim() || form.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email address";
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(form.phone)) {
      newErrors.phone = "Invalid Indian phone number";
    }

    if (!form.street.trim() || form.street.length < 5) {
      newErrors.street = "Address must be at least 5 characters";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!form.state.trim()) {
      newErrors.state = "State is required";
    }

    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(form.pincode)) {
      newErrors.pincode = "Invalid pincode (6 digits)";
    }

    if (!form.country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to format cart items for API
  const formatCartItemsForAPI = () => {
    return cartItems.map(item => ({
      // Use id if available, otherwise use slug
      id: item.id || item.slug,
      slug: item.slug,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      sku: item.sku || item.slug || `SKU-${item.name.replace(/\s+/g, '-')}`,
    }));
  };

  const handlePayment = async (e?: FormEvent) => {
    e?.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay SDK
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      const formattedCartItems = formatCartItemsForAPI();

      console.log("Sending order data:", {
        amount: totalINR,
        formData: form,
        cartItems: formattedCartItems,
      });

      // Create order
      const createOrderRes = await fetch(`${API_BASE}/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalINR,
          formData: form,
          cartItems: formattedCartItems,
        }),
      });

      const orderData = await createOrderRes.json();
      
      console.log("Order response:", orderData);

      if (!createOrderRes.ok || !orderData.success) {
        throw new Error(orderData.error || orderData.message || "Failed to create order");
      }

      if (!orderData.data?.order) {
        throw new Error("Invalid response from server");
      }

      const razorpayOrder = orderData.data.order;

      // Initialize Razorpay
      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "SAMAA by Siblings",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: (response: RazorpayResponse) => {
          // Encode payment data
          const encodedPayload = btoa(
            JSON.stringify({
              cartItems: formattedCartItems,
              formData: form,
              total: totalINR,
            })
          );

          // Redirect to processing page
          router.push(
            `/processing?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}&signature=${response.razorpay_signature}&raw=${encodedPayload}`
          );
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error("Payment cancelled");
          },
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
      console.error("Payment initialization failed:", error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 font-[D-DIN] px-6 md:px-20 bg-[var(--brand-light)] min-h-screen text-[var(--brand-dark)]">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-[var(--font-logo)] mb-8">Checkout</h1>

      <form onSubmit={handlePayment}>
        <div className="grid md:grid-cols-2 gap-10">
          {/* Billing Form */}
          <div className="bg-white p-6 shadow rounded space-y-6">
            <h2 className="text-lg font-semibold">Billing Details</h2>
            
            <div className="space-y-4">
              <div>
                <input
                  name="name"
                  placeholder="Full Name *"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full border px-4 py-2 text-sm ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address *"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full border px-4 py-2 text-sm ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  name="phone"
                  placeholder="Phone Number (10 digits) *"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={10}
                  className={`w-full border px-4 py-2 text-sm ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <h2 className="text-lg font-semibold mt-6">Shipping Address</h2>
            
            <div className="space-y-4">
              <div>
                <input
                  name="street"
                  placeholder="Flat / Door / Building Name *"
                  value={form.street}
                  onChange={handleChange}
                  className={`w-full border px-4 py-2 text-sm ${
                    errors.street ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.street && (
                  <p className="text-red-500 text-xs mt-1">{errors.street}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    name="city"
                    placeholder="City *"
                    value={form.city}
                    onChange={handleChange}
                    className={`w-full border px-4 py-2 text-sm ${
                      errors.city ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <input
                    name="state"
                    placeholder="State *"
                    value={form.state}
                    onChange={handleChange}
                    className={`w-full border px-4 py-2 text-sm ${
                      errors.state ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.state && (
                    <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    name="pincode"
                    placeholder="Pincode *"
                    value={form.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    className={`w-full border px-4 py-2 text-sm ${
                      errors.pincode ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                  )}
                </div>

                <div>
                  <input
                    name="country"
                    placeholder="Country *"
                    value={form.country}
                    onChange={handleChange}
                    className={`w-full border px-4 py-2 text-sm ${
                      errors.country ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                disabled={loading || cartItems.length === 0}
                className={`bg-black text-white px-6 py-4 text-sm transition duration-200 ${
                  loading || cartItems.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-800"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full h-4 w-4 inline-block mr-2" />
                    Processing...
                  </span>
                ) : (
                  `Pay ${format(totalINR)}`
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                By proceeding, you agree to our terms & conditions
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 shadow rounded space-y-4 h-fit sticky top-32">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                Your cart is empty
              </p>
            ) : (
              <>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.slug} className="flex justify-between text-sm pb-2 border-b">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        {format(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{format(totalINR)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{format(totalINR)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}