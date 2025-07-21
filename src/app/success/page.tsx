"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface OrderItem {
  slug: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  payment_id: string;
  status: string;
  createdAt: string;
  estimatedDelivery: string;
  invoiceUrl: string; // Make sure this matches your saved data exactly
  trackingId?: string | null;
}

export default function SuccessPage() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("samaa_last_order");
    if (saved) {
      const parsedOrder = JSON.parse(saved);
      console.log("Loaded order from localStorage:", parsedOrder);
      setOrder(parsedOrder);
    } else {
      router.replace("/");
    }
  }, [router]);

  // Download handler for invoice PDF
  const handleDownloadInvoice = async () => {
    if (!order) {
      alert("Order not loaded yet");
      return;
    }

    if (!order.invoiceUrl) {
      alert("Invoice URL not found");
      console.error("Invoice URL is missing in order object:", order);
      return;
    }

    try {
      const response = await fetch(order.invoiceUrl);
      if (!response.ok) throw new Error("Failed to fetch invoice PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `SAMAA_Invoice_${order.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download invoice. Please try again.");
    }
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f5eb]">
        <p className="text-gray-500 text-sm">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 md:px-20 bg-[#f5f5eb] min-h-screen text-black">
      <div className="max-w-2xl mx-auto text-center">
        {/* ✅ Success Icon + Heading */}
        <div className="flex flex-col items-center justify-center mb-4">
          <img
            src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922254/checkmark_tjph2l.svg"
            alt="Success"
            className="w-16 h-16 mb-2"
          />
          <h1 className="text-3xl font-semibold">Payment Successful!</h1>
        </div>

        <p className="text-gray-600 text-sm mb-8">
          Thank you, <strong>{order.name}</strong>. Your order has been placed.
        </p>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-md shadow space-y-5 text-left">
          {/* Order Meta */}
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Payment ID:</strong> {order.payment_id}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-xs font-semibold inline-block ${
                  order.status === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </p>
            <p>
              <strong>Placed On:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Estimated Delivery:</strong> {order.estimatedDelivery}
            </p>
            <p>
              <strong>Invoice:</strong>{" "}
              <button
                onClick={handleDownloadInvoice}
                className="text-blue-600 underline cursor-pointer bg-transparent border-0 p-0"
              >
                Download PDF
              </button>
            </p>
            {order.trackingId && (
              <p>
                <strong>Track Order:</strong>{" "}
                <a
                  href={`/track-order?awb=${order.trackingId}`}
                  className="text-blue-600 underline"
                >
                  View Tracking
                </a>
              </p>
            )}
          </div>

          {/* Shipping Details */}
          <div className="border-t pt-4 text-sm">
            <h2 className="font-semibold text-base mb-2">Shipping Address</h2>
            <p>{order.name}</p>
            <p>{order.phone}</p>
            <p>{order.email}</p>
            <p>{order.address}</p>
          </div>

          {/* Order Items */}
          <div className="border-t pt-4">
            <h2 className="font-semibold text-base mb-2">Order Items</h2>
            <ul className="divide-y divide-gray-200 text-sm">
              {order.items.map((item, idx) => (
                <li key={idx} className="py-2 flex justify-between">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-semibold text-base mt-3">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          className="mt-10 px-6 py-2 bg-black text-white rounded hover:bg-gray-900 transition"
          onClick={() => router.push("/candles")}
        >
          Shop More Candles
        </button>
      </div>
    </div>
  );
}
