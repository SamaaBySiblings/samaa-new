import { Metadata } from "next";
import CandleStorePage from "@/app/candles/CandleStorePage";
export const metadata: Metadata = {
  title: "Candles - SAMAA Fragrance Store",
  description: "Explore and filter luxury candles by scent and category.",
};


export default function Page() {
  return <CandleStorePage />;
}
