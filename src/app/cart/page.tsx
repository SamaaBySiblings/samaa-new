"use client";

import { useCartStore } from "@/store/cart";
import { useCurrencyStore } from "@/store/currency";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { convertPrice, getCurrencySymbol } from "@/lib/currency"; // ✅ use shared currency helpers

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const currency = useCurrencyStore((state) => state.currency);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const totalINR = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(totalINR);
  }, [items]);

  const format = (priceINR: number) => {
    const converted = convertPrice(priceINR, currency);
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${converted.toFixed(2)}`;
  };

  if (items.length === 0) {
    return (
      <div className="pt-28 font-[D-DIN] pb-16 px-6 text-center text-[var(--brand-dark)] min-h-screen">
        <h1 className="text-2xl font-medium mb-2">Your cart is empty.</h1>
        <Link href="/candles" className="text-sm underline mt-4 inline-block">
          Browse Candles
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 font-[D-DIN] pb-24 px-6 md:px-20 text-[var(--brand-dark)] bg-[var(--brand-light)] min-h-screen">
      <h1 className="text-3xl font-[var(--font-logo)] mb-8">Your Cart</h1>

      <div className="space-y-10">
        {items.map((item, idx) => (
          <div
            key={item.slug + idx}
            className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6"
          >
            <div className="flex gap-4 items-start">
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
                className="rounded object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm">{format(item.price)}</p>

                <div className="flex items-center gap-2 mt-2">
                  <label className="text-sm">Qty:</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.slug, Number(e.target.value))
                    }
                    className="w-16 px-2 py-1 border text-sm"
                  />
                </div>

                <button
                  onClick={() => {
                    removeItem(item.slug);
                    toast.success("Item removed");
                  }}
                  className="mt-2 text-xs text-red-500 underline"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="mt-4 md:mt-0 font-medium">
              {format(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t pt-6 flex justify-between text-lg font-medium">
        <span>Total:</span>
        <span>{format(total)}</span>
      </div>

      <div className="flex gap-4 mt-8 flex-wrap">
        <button
          onClick={() => {
            clearCart();
            toast.success("Cart cleared");
          }}
          className="border border-black px-6 py-2 text-sm hover:bg-black hover:text-white"
        >
          Clear Cart
        </button>

        <Link href="/checkout">
          <button className=" border border-black px-6 py-2 text-sm hover:bg-black hover:text-white">
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
}
