"use client";

import { useCurrencyStore } from "@/store/currency";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const currencies = [
  { code: "INR", name: "Indian Rupee" },
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "AED", name: "UAE Dirham" },
  { code: "ZAR", name: "South African Rand" },
];

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrencyStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="font-panton-trial uppercase text-sm">
        {currency}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {currencies.map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => setCurrency(curr.code)}
            className="font-panton-trial uppercase"
          >
            {curr.code} - {curr.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
