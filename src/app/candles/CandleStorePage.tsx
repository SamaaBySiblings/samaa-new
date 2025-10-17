"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CandleStorePageInner from "./CandleStorePageInner";

function CandleStoreContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const scent = searchParams.get("scent") || "";

  return (
    <CandleStorePageInner initialCategory={category} initialScent={scent} />
  );
}

export default function CandleStorePage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center">Loading candles...</div>}>
      <CandleStoreContent />
    </Suspense>
  );
}
