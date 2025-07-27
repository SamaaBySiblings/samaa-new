"use client";

import { useSearchParams } from "next/navigation";
import CandleStorePageInner from "./CandleStorePageInner";


export default function CandleStorePage() {
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "";
  const scent = searchParams.get("scent") || "";

  return (
    <CandleStorePageInner initialCategory={category} initialScent={scent} />
  );
}
