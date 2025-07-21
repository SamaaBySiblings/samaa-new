"use client";

import { useCartStore } from "@/store/cart";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CartBox() {
  const { items, removeItem, updateQuantity } = useCartStore();

  return (
    <motion.div
      className="relative bg-[var(--color-samaa-email-box)] p-4 rounded-lg shadow-md"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-center text-gray-600">Cart is empty.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.slug}
              className="flex items-center justify-between gap-4"
            >
              <span className="font-[var(--font-panton-trial)] text-sm uppercase flex-1">
                {item.name}
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <span className="px-1 text-sm">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                >
                  +
                </Button>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeItem(item.slug)}
              >
                Remove
              </Button>
            </div>
          ))
        )}

        {items.length > 0 && (
          <Button className="bg-[var(--color-samaa-subscribe)] hover:bg-[var(--color-samaa-subscribe-hover)] mt-4">
            Checkout
          </Button>
        )}
      </div>
    </motion.div>
  );
}
