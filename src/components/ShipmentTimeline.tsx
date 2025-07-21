import React from "react";

interface TimelineProps {
  status: string;
  courier: string;
  awb: string;
  etd?: string;
}

const STAGES = ["Shipped", "In Transit", "Out for Delivery", "Delivered"];

function getActiveIndex(status: string | undefined | null) {
  if (!status || typeof status !== "string") {
    return 0;
  }

  const statusMap: Record<string, number> = {
    NEW: 0,
    SHIPPED: 0,
    IN_TRANSIT: 1,
    OUT_FOR_DELIVERY: 2,
    DELIVERED: 3,
    PENDING: 0,
    CONFIRMED: 0,
    PROCESSING: 0,
    DISPATCHED: 0,
    TRANSIT: 1,
    DELIVERY: 2,
    COMPLETED: 3,
  };

  const key = status.toUpperCase().replace(/\s/g, "_");
  return statusMap[key] ?? 0;
}

export default function ShipmentTimeline({
  status,
  courier,
  awb,
  etd,
}: TimelineProps) {
  const activeIndex = getActiveIndex(status);

  return (
    <div className="space-y-6 text-sm">
      {/* Info */}
      <div className="text-gray-700">
        <p>
          <strong>Courier:</strong> {courier || "N/A"}
        </p>
        <p>
          <strong>AWB:</strong> {awb || "N/A"}
        </p>
        {etd && (
          <p>
            <strong>Estimated Delivery:</strong>{" "}
            {new Date(etd).toLocaleDateString()}
          </p>
        )}
        {awb && (
          <a
            href={`https://www.shiprocket.in/shipment-tracking/${awb}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Track Shipment
          </a>
        )}
      </div>

      {/* Timeline */}
      <div className="flex items-center justify-between w-full">
        {STAGES.map((stage, index) => {
          const isActive = index <= activeIndex;
          return (
            <div key={stage} className="flex-1 flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full z-10 ${
                  isActive ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
              <span
                className={`text-xs mt-2 text-center ${
                  isActive ? "text-blue-600 font-medium" : "text-gray-400"
                }`}
              >
                {stage}
              </span>
              {/* Draw a line between dots except after the last one */}
              {index < STAGES.length - 1 && (
                <div className="absolute top-2 left-1/2 w-full h-0.5 bg-gray-300">
                  <div
                    className="h-0.5 bg-blue-600"
                    style={{
                      width:
                        activeIndex > index
                          ? "100%"
                          : activeIndex === index
                          ? "50%"
                          : "0%",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

