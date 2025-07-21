import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUIStore } from "./ui"; // Import UI store here

export interface CartItem {
  slug: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addToCart: (item) => {
        // Open cart drawer globally when adding an item
        useUIStore.getState().openCart();

        set((state) => {
          const existing = state.items.find((i) => i.slug === item.slug);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.slug === item.slug
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },
      removeItem: (slug) =>
        set((state) => ({
          items: state.items.filter((item) => item.slug !== slug),
        })),
      updateQuantity: (slug, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.slug === slug ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "samaa-cart", // localStorage key
    }
  )
);
