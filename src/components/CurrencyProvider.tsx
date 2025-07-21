"use client";

import { ReactNode, useEffect } from "react";
import { useCurrencyStore } from "@/store/currency";

const countryToCurrency: Record<string, string> = {
  IN: "INR",
  US: "USD",
  GB: "GBP",
  EU: "EUR",
  CA: "CAD",
  AU: "AUD",
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const setCurrency = useCurrencyStore((state) => state.setCurrency);

  useEffect(() => {
    async function detectCurrency() {
      const stored = localStorage.getItem("currency");
      if (stored) {
        setCurrency(stored);
        return;
      }

      try {
        const res = await fetch("https://ipinfo.io/json?token=d1ec4368fb7737"); // later we gonna replace this with samaa token
        const data = await res.json();
        const country = data.country;

        const currency = countryToCurrency[country] || "INR";
        setCurrency(currency);
        localStorage.setItem("currency", currency);
      } catch {
        setCurrency("INR");
        localStorage.setItem("currency", "INR");
      }
    }
    detectCurrency();
  }, [setCurrency]);

  return <>{children}</>;
}
