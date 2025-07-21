"use client";

import { useState, useRef, useEffect } from "react";
import { useCurrencyStore } from "@/store/currency";


const currencies = [
  { code: "INR" },
  { code: "USD" },
  { code: "EUR" },
  { code: "GBP" },
  { code: "AUD" },
  { code: "CAD" },
];

export function CurrencySelector() {
  const currency = useCurrencyStore((state) => state.currency);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectCurrency(code: string) {
    setCurrency(code);
    localStorage.setItem("currency", code);
    setOpen(false);
  }

  return (
    <div
      ref={dropdownRef}
      className="font-[D-DIN] relative inline-block text-left cursor-pointer select-none text-xs"
    >
      <button
        onClick={() => setOpen(!open)}
        className="bg-transparent text-black px-3 py-[5px] h-10 rounded-sm flex items-center justify-center text-sm w-20"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="w-full text-center">{currency}</span>
      </button>

      {open && (
        <ul className="absolute left-0 mt-1 w-24 bg-white shadow-lg rounded-none z-60 max-h-60 text-xs">
          {currencies.map(({ code }) => (
            <li
              key={code}
              onClick={() => selectCurrency(code)}
              className={`px-3 py-2 text-center hover:bg-gray-100 ${
                code === currency ? "bg-gray-200 font-medium" : ""
              }`}
              role="menuitem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  selectCurrency(code);
                }
              }}
            >
              {code}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

}
