"use client";

import { useState } from "react";
import ShipmentTimeline from "@/components/ShipmentTimeline";

type TrackingInfo = {
  shipment_status: string;
  courier_name: string;
  awb_code: string;
  etd?: string;
  current_city?: string;
  delivered_to?: string;
  destination?: string;
  delivered_on?: string;
};

export default function TrackOrderPage() {
  const [awb, setAwb] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState<TrackingInfo | null>(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    setLoading(true);
    setTracking(null);
    setError("");

    try {
      const res = await fetch(
        `/api/track-order/${awb}?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();

      if (data.success) {
        setTracking(data.tracking as TrackingInfo);
      } else {
        setError("Tracking information not found.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#f5f5eb", position: "relative" }}
    >
      {/* Heading at top-most left side, moved down a little */}
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
              className="w-full pl-0 pr-4 py-[0.2rem] font-[D-DIN] text-sm leading-none focus:outline-none focus:ring-0"
              style={{ borderBottom: "1px solid #4d272e" }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-0 pr-5 py-1 text-sm leading-none font-[D-DIN] focus:outline-none focus:ring-0 mt-10"
              style={{ borderBottom: "1px solid #4d272e" }}
            />

            <button
              onClick={handleTrack}
              disabled={loading || !awb || !email}
              className={`px-6 py-4  text-white cursor-pointer font-[D-DIN] text-sm w-full transition-colors mt-10
                bg-[#4d272e]
                hover:bg-white/80 hover:border-[#4d272e] hover:text-[#4d272e]
                opacity-100`}
            >
              {loading ? "Tracking..." : "TRACK"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-600 mt-6 text-sm max-w-4xl mx-auto text-center">
          {error}
        </p>
      )}

      {tracking && (
        <div className="mt-10 text-left max-w-4xl mx-auto">
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
        </div>
      )}
    </div>
  );
}
