// app/track-order/page.tsx - IMPROVED VERSION
"use client";

import { Metadata } from "next";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type OrderData = {
  id: number;
  status: string;
  shipping_status: string;
  created_at: string;
  shipped_at?: string;
  delivered_at?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  timeline: Array<{
    timestamp: string;
    status: string;
    message: string;
  }>;
};

type TrackingData = {
  shipment_status: string;
  courier_name: string;
  awb_code: string;
  etd?: string;
  current_city?: string;
  destination?: string;
  delivered_on?: string;
  shipment_track?: Array<{
    current_status: string;
    date: string;
    location: string;
    activities: string;
  }>;
};

export const metadata: Metadata = {
  title: "Track Your Order - SAMAA Candle Delivery",
  description:
    "Track your order from SAMAA—real-time updates on your handcrafted candles, beautifully packed and shipped with care.",
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.samaabysiblings.com/backend/api/v1";

export default function TrackOrderPage() {
  const [awb, setAwb] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!awb.trim() || !email.trim()) {
      toast.error("Please enter both AWB code and email");
      return;
    }

    setLoading(true);
    setOrder(null);
    setTracking(null);
    setError("");

    try {
      const res = await fetch(
        `${API_BASE}/tracking/track/${awb}?email=${encodeURIComponent(email)}`
      );
      
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Tracking information not found");
      }

      setOrder(data.data.order);
      setTracking(data.data.tracking);
      toast.success("Order found!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      delivered: "text-green-600",
      shipped: "text-blue-600",
      processing: "text-yellow-600",
      cancelled: "text-red-600",
    };
    return statusColors[status.toLowerCase()] || "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-[#f5f5eb]">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="pt-28 pb-8 px-6 md:px-20">
        <h1 className="text-3xl font-[TANTanglon] uppercase tracking-wide">
          Track Your Order
        </h1>
        <p className="text-sm text-gray-600 mt-2 font-[D-DIN]">
          Enter your AWB code and email to track your shipment
        </p>
      </div>

      {/* Search Form */}
      <div className="px-6 md:px-20 pb-10">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 font-[D-DIN]">
                AWB / Tracking Number *
              </label>
              <input
                type="text"
                placeholder="Enter tracking number"
                value={awb}
                onChange={(e) => setAwb(e.target.value.trim())}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4d272e] font-[D-DIN]"
                onKeyPress={(e) => e.key === "Enter" && handleTrack()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 font-[D-DIN]">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="Email used during checkout"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4d272e] font-[D-DIN]"
                onKeyPress={(e) => e.key === "Enter" && handleTrack()}
              />
            </div>

            <button
              onClick={handleTrack}
              disabled={loading || !awb || !email}
              className={`w-full px-6 py-4 text-white font-[D-DIN] text-sm transition-colors
                ${loading || !awb || !email
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#4d272e] hover:bg-[#3d1f24]"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full h-4 w-4 inline-block mr-2" />
                  Tracking...
                </span>
              ) : (
                "TRACK ORDER"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {(order || error) && (
        <div className="px-6 md:px-20 pb-20">
          {error ? (
            <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 font-[D-DIN]">{error}</p>
            </div>
          ) : order && tracking ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Order Status Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold font-[D-DIN]">
                      Order #{order.id}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Placed on {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.shipping_status
                      )} bg-opacity-10`}
                    >
                      {tracking.shipment_status}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-xs text-gray-500 mb-1">Courier</p>
                    <p className="font-medium font-[D-DIN]">
                      {tracking.courier_name}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-xs text-gray-500 mb-1">AWB Code</p>
                    <p className="font-medium font-mono text-sm">
                      {tracking.awb_code}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-xs text-gray-500 mb-1">
                      {order.delivered_at ? "Delivered On" : "Expected Delivery"}
                    </p>
                    <p className="font-medium font-[D-DIN]">
                      {order.delivered_at
                        ? formatDate(order.delivered_at)
                        : tracking.etd || "3-5 business days"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              {tracking.shipment_track && tracking.shipment_track.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4 font-[D-DIN]">
                    Shipment Timeline
                  </h3>
                  <div className="space-y-4">
                    {tracking.shipment_track.map((track, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              index === 0 ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                          {index < tracking.shipment_track!.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium text-sm font-[D-DIN]">
                            {track.current_status}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(track.date)}
                          </p>
                          {track.location && (
                            <p className="text-xs text-gray-600 mt-1">
                              📍 {track.location}
                            </p>
                          )}
                          {track.activities && (
                            <p className="text-xs text-gray-600 mt-1">
                              {track.activities}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 font-[D-DIN]">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b last:border-b-0"
                    >
                      <div>
                        <p className="font-medium font-[D-DIN]">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium font-[D-DIN]">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 border-t-2">
                    <p className="font-semibold font-[D-DIN]">Total</p>
                    <p className="font-semibold text-lg font-[D-DIN]">
                      ₹{order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-700 font-[D-DIN]">
                  Need help? Contact us at{" "}
                  <a
                    href="mailto:support@samaabysiblings.com"
                    className="text-blue-600 hover:underline"
                  >
                    support@samaabysiblings.com
                  </a>
                </p>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}