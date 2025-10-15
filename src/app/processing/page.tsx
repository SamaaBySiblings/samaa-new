"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useMutation } from "@tanstack/react-query";
import { useCartStore } from "@/store/cart";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.samaabysiblings.com/backend/api/v1";

function ProcessingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);
  const [errorMessage, setErrorMessage] = useState("");

  const payment_id = params.get("payment_id");
  const order_id = params.get("order_id");
  const signature = params.get("signature");
  const raw = params.get("raw");

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!payment_id || !order_id || !signature || !raw) {
        throw new Error("Missing payment data");
      }

      const parsed = JSON.parse(atob(raw));

      console.log("Verifying payment:", {
        razorpay_payment_id: payment_id,
        razorpay_order_id: order_id,
        razorpay_signature: signature,
        cartItems: parsed.cartItems,
        formData: parsed.formData,
        total: parsed.total,
      });

      const res = await fetch(`${API_BASE}/payments/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_payment_id: payment_id,
          razorpay_order_id: order_id,
          razorpay_signature: signature,
          ...parsed,
        }),
      });

      const data = await res.json();
      console.log("Verification response:", data);

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Verification failed");
      }

      // Store order data - handle both possible response structures
      const orderData = data.data?.order || data.order;
      if (orderData) {
        localStorage.setItem("samaa_last_order", JSON.stringify(orderData));
      }

      clearCart();
      router.push("/success");
    },
    onError: (error: any) => {
      const message = error?.message || "Payment verification failed";
      console.error("Verification error:", error);
      setErrorMessage(message);
      toast.error(message);
      setTimeout(() => router.replace("/fail"), 3000);
    },
  });

  useEffect(() => {
    const alreadyProcessed = sessionStorage.getItem("verify_lock");
    if (!alreadyProcessed) {
      sessionStorage.setItem("verify_lock", "true");
      mutate();
    }
  }, [mutate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5eb] px-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold mb-2 font-[D-DIN]">
          {errorMessage ? "Verification Failed" : "Processing Payment..."}
        </h1>
        
        {errorMessage ? (
          <>
            <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
            <p className="text-xs text-gray-600">
              Redirecting to failure page...
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-6">
              Please do not refresh or close this tab.
            </p>
            <div className="mt-6 animate-spin h-10 w-10 rounded-full border-4 border-black border-t-transparent mx-auto" />
          </>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5eb]">
      <h1 className="text-xl font-semibold mb-2">Loading...</h1>
      <div className="mt-6 animate-spin h-10 w-10 rounded-full border-4 border-black border-t-transparent" />
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProcessingContent />
    </Suspense>
  );
}