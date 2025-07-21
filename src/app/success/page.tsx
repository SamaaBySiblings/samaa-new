"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function SuccessPage() {
  const router = useRouter();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("samaa_last_order");
    if (!saved) {
      router.replace("/");
      return;
    }

    setTimeout(() => setShowContent(true), 300);

    const confettiTimeout = setTimeout(() => setShowConfetti(false), 8000);

    const clearTimeoutId = setTimeout(() => {
      localStorage.removeItem("samaa_last_order");
      sessionStorage.removeItem("verify_lock");
    }, 15000); // clear after 7 seconds (confetti + buffer)

    return () => {
      clearTimeout(confettiTimeout);
      clearTimeout(clearTimeoutId);
    };
  }, [router]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5f5eb] px-6 overflow-hidden relative">
      {/* 🎉 Confetti */}
      {showConfetti && (
        <Confetti width={width} height={height} numberOfPieces={250} gravity={0.3} />
      )}

      {/* 🎈 Animated Content */}
      <div
        className={`max-w-xl text-center transition-all duration-1000 ease-out transform ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* ✅ Animated Success Icon */}
        <div className="flex justify-center mb-6">
          <img
            src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922254/checkmark_tjph2l.svg"
            alt="Success"
            className="w-20 h-20 animate-pulse drop-shadow-md"
          />
        </div>

        <h1 className="text-4xl font-bold mb-4 text-black animate-fade-in">
          Payment Successful!
        </h1>

        <p className="text-gray-700 text-lg mb-6 animate-fade-in delay-300">
          Dear buyer, your payment has been successful.
          <br />
          Shortly you will receive an email with your order confirmation and tracking details.
        </p>

        <button
          onClick={() => router.push("/candles")}
          className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition-all shadow-md animate-bounce-slow"
        >
          Shop More Candles
        </button>
      </div>

      {/* 🌀 Extra Floating Animation Style (Optional) */}
      <style jsx global>{`
        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-slow {
          animation: bounceSlow 2.4s infinite ease-in-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
