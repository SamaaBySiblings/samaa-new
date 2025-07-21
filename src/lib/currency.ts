// conversion rates vs INR (example rates, you can update with live rates later)
const rates: Record<string, number> = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0098,
  AUD: 0.017,
  CAD: 0.016,
};

const symbols: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
  CAD: "C$",
};

export function convertPrice(amountInINR: number, currency: string) {
  const rate = rates[currency] ?? 1;
  return amountInINR * rate;
}

export function getCurrencySymbol(currency: string) {
  return symbols[currency] || "₹";
}
