"use client";

import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import Image from "next/image";
import toast from "react-hot-toast";
import { convertPrice, getCurrencySymbol } from "@/lib/currency"; // adjust the path as needed
import { useCurrencyStore } from "@/store/currency";


export default function CartDrawer() {
  const isOpen = useUIStore((state) => state.isCartOpen);
  const onClose = useUIStore((state) => state.closeCart);
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
const currency = useCurrencyStore((state) => state.currency);
const symbol = getCurrencySymbol(currency);

  if (!isOpen) return null;

  return (
    <>
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-100 bg-[#f5f5eb] z-50 shadow-lg overflow-y-auto p-4 flex flex-col min-w-[300px] text-sm">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="self-end mb-2 text-gray-600 hover:text-black text-xs"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="font-[D-DIN] text-sm font-light mb-10">Cart</h2>

        {/* Cart Items */}
        {items.length === 0 ? (
          <div className="space-y-2">
            <p className="font-[D-DIN] text-xs text-gray-600">
              Your cart is currently empty.
            </p>
            <hr className="w-full border-t border-gray-300" />
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto space-y-4">
              {items.map((item, index) => (
                <div key={item.slug}>
                  {/* Item Row */}
                  <div className="flex gap-2 items-start pb-2">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="object-cover "
                    />
                    <div className="flex flex-col flex-grow">
                      <h3 className="font-light  text-xs leading-tight mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-black/70 ">
                        {symbol}
                        {convertPrice(item.price, currency).toFixed(2)}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-xs">
                        <label htmlFor={`qty-${item.slug}`}>Qty:</label>
                        <input
                          id={`qty-${item.slug}`}
                          type="number"
                          min={1}
                          max={10}
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.slug, Number(e.target.value))
                          }
                          className="w-12  px-1 py-0.5 text-xs"
                        />
                      </div>
                      <button
                        onClick={() => {
                          removeItem(item.slug);
                          toast.success("Item removed");
                        }}
                        className="font-[D-DIN] mt-1 text-[10px] text-[#323232] hover:text-[#737373] self-start"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Item Total (moved here) */}
                  <div className="font-[D-DIN] text-xs font-medium text-right pb-1">
                    {symbol}
                    {convertPrice(item.price * item.quantity, currency).toFixed(
                      2
                    )}
                  </div>

                  {/* Divider after every item */}
                  <div className="flex justify-end pt-2">
                    <hr className="w-full border-t border-gray-300" />
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="font-[D-DIN] pt-4 mt-4 border-t border-gray-300 flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>
                {symbol}
                {convertPrice(total, currency).toFixed(2)}
              </span>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  onClose();
                  window.location.href = "/checkout";
                }}
                className="font-[D-DIN] border border-black px-5 py-3 text-center uppercase text-xs text-white bg-black hover:bg-[#323232] hover:text-[#737373]"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
