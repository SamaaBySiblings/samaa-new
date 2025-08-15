"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelOrderPage() {
  const router = useRouter();
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "invalid"
  >("loading");
  const [message, setMessage] = useState("Cancelling your order...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");

    if (!orderId) {
      setStatus("invalid");
      setMessage("Invalid or missing order ID.");
      return;
    }

    fetch("https://api.samaabysiblings.com/backend/api/v1/orders/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.success) {
          setStatus("success");
          setMessage("Your order has been cancelled and refund initiated.");
        } else {
          setStatus("error");
          setMessage(data.message || "Failed to cancel order.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Network error while cancelling order.");
      });
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#f5f5eb",
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily:
          "Tahoma, Verdana, 'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
        color: "#262626",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <h1
        className="fade-in-scale"
        style={{ fontSize: "2.5rem", marginBottom: "1rem" }}
      >
        {status === "loading"
          ? "Processing Cancellation"
          : status === "success"
          ? "Order Cancelled"
          : status === "invalid"
          ? "Invalid Order"
          : "Cancellation Failed"}
      </h1>
      <p
        className="fade-in"
        style={{ fontSize: "1.25rem", marginBottom: "2rem", maxWidth: 400 }}
      >
        {message}
      </p>

      <button
        onClick={() => router.push("/")}
        disabled={status === "loading"}
        className="btn"
        style={{ cursor: status === "loading" ? "not-allowed" : "pointer" }}
      >
        {status === "success" ? "Shop More Candles" : "Go to Homepage"}
      </button>

      <style jsx>{`
        .fade-in {
          animation: fadeIn 1s ease forwards;
        }
        .fade-in-scale {
          animation: fadeInScale 0.8s ease forwards;
        }
        .btn {
          background-color: black;
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 9999px;
          border: none;
          font-weight: bold;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }
        .btn:hover:not(:disabled) {
          background-color: #222;
          transform: scale(1.05);
        }
        .btn:disabled {
          opacity: 0.6;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
