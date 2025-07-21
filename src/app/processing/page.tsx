"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useMutation } from "@tanstack/react-query";
import { useCartStore } from "../../store/cart";
import toast from "react-hot-toast";

function ProcessingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);
  
  const payment_id = params.get("payment_id");
  const order_id = params.get("order_id");
  const signature = params.get("signature");
  const raw = params.get("raw");

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!payment_id || !order_id || !signature || !raw)
        throw new Error("Missing payment data");
      
      const parsed = JSON.parse(atob(raw)); // { cartItems, formData, total }
      
      const res = await fetch(
        `/api/razorpay/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: payment_id,
            razorpay_order_id: order_id,
            razorpay_signature: signature,
            ...parsed,
          }),
        }
      );
      
      const data = await res.json();
      if (!data.success) throw new Error("Verification failed");
      
      localStorage.setItem("samaa_last_order", JSON.stringify(data.order));
      clearCart();
      router.push("/success");
    },
    onError: () => {
      toast.error("Payment failed. Redirecting...");
      setTimeout(() => router.replace("/fail"), 2000);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5eb]">
      <h1 className="text-xl font-semibold mb-2">Processing Payment...</h1>
      <p className="text-sm text-gray-600">
        Please do not refresh or close this tab.
      </p>
      <div className="mt-6 animate-spin h-10 w-10 rounded-full border-4 border-black border-t-transparent" />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
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
