"use client";

import { useState } from "react";

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
  delivered_to?: string;
  shipment_track?: Array<{
    current_status: string;
    date: string;
    location: string;
    activities: string;
  }>;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.samaabysiblings.com/backend/api/v1";

// Shipment Timeline Component
function ShipmentTimeline({ status, courier, awb, etd }: {
  status: string;
  courier: string;
  awb: string;
  etd?: string;
}) {
  const stages = ["Order Placed", "In Transit", "Out for Delivery", "Delivered"];
  const currentStageIndex = 
    status.toLowerCase().includes("delivered") ? 3 :
    status.toLowerCase().includes("out for delivery") ? 2 :
    status.toLowerCase().includes("transit") || status.toLowerCase().includes("shipped") ? 1 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-[D-DIN]">Status: <strong>{status}</strong></span>
        {etd && <span className="font-[D-DIN]">ETD: {etd}</span>}
      </div>
      
      <div className="relative flex justify-between items-center">
        {stages.map((stage, index) => (
          <div key={stage} className="flex flex-col items-center relative z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                index <= currentStageIndex
                  ? "bg-[#4d272e] text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            <span className="mt-2 text-xs font-[D-DIN] text-center max-w-[80px]">
              {stage}
            </span>
          </div>
        ))}
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-300 -z-0" style={{ width: "100%", margin: "0 auto" }}>
          <div
            className="h-full bg-[#4d272e] transition-all duration-500"
            style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong className="font-[D-DIN]">Courier:</strong> {courier}</p>
        <p><strong className="font-[D-DIN]">AWB Code:</strong> {awb}</p>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  const [awb, setAwb] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!awb.trim() || !email.trim()) {
      setError("Please enter both AWB code and email");
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
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#f5f5eb", position: "relative" }}
    >
      {/* Heading at top-most left side */}
      <h1
        className="text-xs md:text-sm font-normal font-[TANTanglon] uppercase tracking-wide p-6"
        style={{ position: "absolute", top: "100px", left: "0" }}
      >
        Track Order
      </h1>

      <div className="pt-28 pb-20 px-6 md:px-20 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full">
          {/* Form box centered */}
          <div className="p-6 mx-auto">
            <input
              type="text"
              placeholder="Order Number Without #"
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
              className="w-full pl-0 pr-4 py-[0.2rem] font-[D-DIN] text-sm leading-none focus:outline-none focus:ring-0 bg-transparent"
              style={{ borderBottom: "1px solid #4d272e" }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-0 pr-5 py-1 text-sm leading-none font-[D-DIN] focus:outline-none focus:ring-0 mt-10 bg-transparent"
              style={{ borderBottom: "1px solid #4d272e" }}
              onKeyPress={(e) => e.key === "Enter" && handleTrack()}
            />

            <button
              onClick={handleTrack}
              disabled={loading || !awb || !email}
              className={`px-6 py-4 text-white cursor-pointer font-[D-DIN] text-sm w-full transition-colors mt-10
                bg-[#4d272e]
                hover:bg-white/80 hover:border-[#4d272e] hover:text-[#4d272e]
                ${loading ? "opacity-75" : "opacity-100"}`}
            >
              {loading ? "Tracking..." : "TRACK"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-600 mt-6 text-sm max-w-4xl mx-auto text-center px-6">
          {error}
        </p>
      )}

      {tracking && order && (
        <div className="mt-10 px-6 md:px-20 pb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-semibold mb-4 font-[D-DIN]">
              Shipment Progress
            </h2>

            <ShipmentTimeline
              status={tracking.shipment_status}
              courier={tracking.courier_name}
              awb={tracking.awb_code}
              etd={tracking.etd}
            />

            <div className="mt-8 text-sm text-gray-600 bg-gray-50 p-4 rounded space-y-1">
              <p>
                <strong className="font-[D-DIN]">Current City:</strong>{" "}
                {tracking.current_city || "In Transit"}
              </p>
              <p>
                <strong className="font-[D-DIN]">Delivered To:</strong>{" "}
                {tracking.delivered_to || "N/A"}
              </p>
              {tracking.destination && (
                <p>
                  <strong className="font-[D-DIN]">Destination:</strong>{" "}
                  {tracking.destination}
                </p>
              )}
              {tracking.delivered_on && (
                <p>
                  <strong className="font-[D-DIN]">Delivered On:</strong>{" "}
                  {new Date(tracking.delivered_on).toLocaleString()}
                </p>
              )}
            </div>

            {/* Order Items */}
            {order.items && order.items.length > 0 && (
              <div className="mt-8 bg-white rounded p-6">
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
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}