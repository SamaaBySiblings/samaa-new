"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { useCartStore } from "@/store/cart";
import { useCurrencyStore } from "@/store/currency";
import { convertPrice, getCurrencySymbol } from "@/lib/currency";
import ProductPageSkeleton from "@/components/ProductPageSkeleton";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  scent?: string;
  category?: string;
  isBundle?: boolean;
  stock?: number;
  description?: string;
  status?: "active" | "inactive";
  createdAt?: string;
}

function formatPrice(priceInINR: number, currency: string) {
  const converted = convertPrice(priceInINR, currency);
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${converted.toFixed(2)}`;
}

export default function CandleStorePage() {
  const addToCart = useCartStore((state) => state.addToCart);
  const currency = useCurrencyStore((state) => state.currency);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedScents, setSelectedScents] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filterRef = useRef<HTMLDivElement>(null);

  // Fetch products on mount or when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Build query params for filters
        const params: Record<string, string> = {};
        if (selectedScents.length) params.scent = selectedScents.join(",");
        if (selectedCategories.length)
          params.category = selectedCategories.join(",");

        // If no filters, get all candles; else, get filtered candles
        const endpoint =
          Object.keys(params).length > 0 ? "/candles/filter" : "/candles";

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`,
          { params }
        );
        if (response.data.success) {
          setProducts(response.data.data);
        } else {
          console.error("Failed to load products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedScents, selectedCategories]);

  // Close filter if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterOpen &&
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    toast.success(`Added "${product.name}" to cart`);
  };

  const toggleFilterScent = (scent: string) => {
    setSelectedScents((prev) =>
      prev.includes(scent) ? prev.filter((s) => s !== scent) : [...prev, scent]
    );
  };

  const toggleFilterCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setSelectedScents([]);
    setSelectedCategories([]);
  };

  return (
    <>
      <div className="bg-[#f5f5eb] pt-32 pb-20 px-6 sm:px-12 lg:px-20 relative min-h-screen flex">
        {/* Products grid takes most space */}
        <div className="flex-grow max-w-7xl mx-auto w-full">
          <div className="md:hidden flex justify-end mb-6">
            <button
              onClick={() => setFilterOpen(true)}
              className="text-sm uppercase bg-black text-white px-4 py-2 hover:bg-[#323232] transition"
            >
              Filter
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <ProductPageSkeleton key={i} />
              ))
            ) : products.length > 0 ? (
              products.map((product) => {
                return (
                  <div
                    key={product.slug}
                    className="group relative"
                    tabIndex={0}
                  >
                    <div className="aspect-[4/5] w-full relative overflow-hidden bg-gray-200 lg:h-[450px]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition duration-300 group-hover:opacity-80"
                      />

                      <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm bg-white/30 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                        <Link
                          href={`/candles/${product.slug}`}
                          className="text-gray-800 font-[D-DIN] font-medium text-xs mb-5 hover:text-gray-600 transition"
                        >
                          View Product
                        </Link>

                        {!product.isBundle ? (
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="text-white text-xs font-[D-DIN] uppercase bg-black hover:bg-[#323232] px-4 py-3 transition"
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <Link href={`/candles/${product.slug}`}>
                            <button className="text-white font-[D-DIN] text-sm uppercase bg-black hover:bg-[#323232] px-3 py-2 transition">
                              Make your pack
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm text-gray-700 font-[D-DIN] font-medium">
                          <Link href={`/candles/${product.slug}`}>
                            {product.name}
                          </Link>
                        </h3>
                      </div>
                      <p className="text-sm font-[D-DIN] font-light text-gray-800">
                        {formatPrice(product.price, currency)}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="col-span-full font-[D-DIN] text-center text-gray-500 mt-20">
                No candles found matching your filters.
              </p>
            )}
          </div>
        </div>

        {/* Filter Button - fixed right side, vertical text, no arrow */}
        {/* Desktop Only: Filter Button - floating on right */}
        <button
          onClick={() => setFilterOpen(true)}
          aria-label="Open Filters"
          className="hidden font-[D-DIN] md:block fixed right-0 top-1/2 z-50 cursor-pointer select-none text-gray-700 font-light uppercase hover:text-gray-900"
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "left bottom",
            right: -20,
            top: "50%",
            padding: "0 8px",
            background: "transparent",
            border: "none",
            fontSize: "0.775rem",
            userSelect: "none",
          }}
        >
          Filter
        </button>
      </div>

      {/* Filter Overlay & Panel */}
      <div
        className={`fixed inset-0 bg-white/80 bg-opacity-30 z-40 transition-opacity ${
          filterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setFilterOpen(false)}
      />

      <div
        ref={filterRef}
        className={`fixed top-0 right-0 h-full w-80 bg-[#f5f5eb] shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          filterOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 bg-[#f5f5eb] z-10 p-4 flex items-center justify-between">
          <button
            onClick={() => setFilterOpen(false)}
            aria-label="Close Filters"
            className="text-gray-600 hover:text-gray-900 text-xl"
          >
            &times;
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-64px)] space-y-6">
          <div>
            <h4 className="font-semibold font-[D-DIN] mb-2"> by Scent</h4>
            <div className="flex flex-col gap-2">
              {["morga", "sandalwood", "lemon grass", "jasmine"].map(
                (scent) => {
                  const isSelected = selectedScents.includes(scent);
                  return (
                    <div
                      key={scent}
                      onClick={() => toggleFilterScent(scent)}
                      className={`cursor-pointer font-[D-DIN] text-sm  transition-colors ${
                        isSelected
                          ? "text-black font-semibold decoration-black decoration-2"
                          : "text-gray-700 decoration-gray-400 decoration-1 hover:decoration-black"
                      }`}
                    >
                      {scent}
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <h4 className="font-semibold font-[D-DIN] mb-2">by Category</h4>
          <div className="flex flex-col gap-2">
            {["soft", "sharp"].map((cat) => {
              const isSelected = selectedCategories.includes(cat);
              return (
                <div
                  key={cat}
                  onClick={() => toggleFilterCategory(cat)}
                  className={`cursor-pointer text-sm decoration-1 ${
                    isSelected ? "font-semibold text-black" : "text-gray-700"
                  }`}
                >
                  {cat}
                </div>
              );
            })}
          </div>

          <button
            onClick={clearFilters}
            className="mt-95 w-full bg-black text-white font-[D-DIN] uppercase py-4  hover:bg-[#323232] transition text-xs"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </>
  );
}
