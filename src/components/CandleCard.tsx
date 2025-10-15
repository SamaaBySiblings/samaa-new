"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "../store/cart";
import { useState } from "react";
import toast from "react-hot-toast";

interface CandleCardProps {
  slug: string;
  name: string;
  subtitle?: string;
  price: number;
  image: string;
}

export default function CandleCard({
  slug,
  name,
  subtitle,
  price,
  image,
}: CandleCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [hovered, setHovered] = useState(false);

  const handleAdd = () => {
    addToCart({
      slug,
      name,
      price,
      quantity: 1,
      image,
      id: undefined,
      sku: ""
    });
    toast.success("Added to cart!");
  };

  return (
    <div
      className="group relative overflow-hidden text-[var(--brand-dark)] bg-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container */}
      <div className="relative w-full h-96">
        <Image
          src={image}
          alt={name}
          fill
          className={`transition duration-300 object-cover ${
            hovered ? "opacity-20" : "opacity-100"
          }`}
        />
        {/* Overlay Actions */}
        {hovered && (
          <div className="absolute inset-0 flex flex-col justify-center items-center gap-3 z-10">
            <Link
              href={`/candles/${slug}`}
              className="bg-black text-white px-4 py-2 text-xs uppercase"
            >
              View Product
            </Link>
            <button
              onClick={handleAdd}
              className="bg-black text-white px-4 py-2 text-xs uppercase"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>

      {/* Text Section */}
      <div className="pt-3 pb-4">
        <h3 className="text-sm font-medium mb-1">{name}</h3>
        {subtitle && (
          <p className="text-xs text-gray-600 mb-1">{subtitle}</p>
        )}
        <div className="border-t w-10 border-black mb-2" />
        <p className="text-sm font-medium">₹{price}</p>
      </div>
    </div>
  );
}
