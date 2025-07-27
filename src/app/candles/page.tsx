"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CandleStorePageInner from "./CandleStorePageInner";

// Create a separate component for the search params logic
function CandleStoreContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const scent = searchParams.get("scent") || "";

  return (
    <CandleStorePageInner initialCategory={category} initialScent={scent} />
  );
}

// Main component with Suspense boundary
export default function CandleStorePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CandleStoreContent />
    </Suspense>
  );
}
