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
import { useRouter } from "next/navigation";

export interface Product {
  _id: string;
  id?: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  scent?: string;
  category?: string;
  isBundle?: boolean;
  stock: number;
  in_stock: boolean;
  low_stock_threshold?: number;
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock';
  description?: string;
  createdAt?: string;
}

function formatPrice(priceInINR: number, currency: string) {
  const converted = convertPrice(priceInINR, currency);
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${converted.toFixed(2)}`;
}

// Stock Badge Component
function StockBadge({ stock, stockStatus, inStock }: { 
  stock: number; 
  stockStatus?: string;
  inStock: boolean;
}) {
  if (!inStock || stock <= 0) {
    return (
      <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
        Out of Stock
      </span>
    );
  }

  if (stockStatus === 'low_stock' || stock <= 10) {
    return (
      <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
        Only {stock} left
      </span>
    );
  }

  return (
    <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
      In Stock
    </span>
  );
}

interface Props {
  initialCategory?: string;
  initialScent?: string;
}

export default function CandleStorePageInner({
  initialCategory,
  initialScent,
}: Props) {
  const addToCart = useCartStore((state) => state.addToCart);
  const currency = useCurrencyStore((state) => state.currency);
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedScents, setSelectedScents] = useState<string[]>(
    initialScent ? [initialScent] : []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [showOutOfStock, setShowOutOfStock] = useState(true);

  const filterRef = useRef<HTMLDivElement>(null);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedScents.length) params.set("scent", selectedScents.join(","));
    else params.delete("scent");
    if (selectedCategories.length) params.set("category", selectedCategories.join(","));
    else params.delete("category");

    const queryString = params.toString();
    router.replace(`/candles?${queryString}`, { scroll: false });
  }, [selectedScents, selectedCategories, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (selectedScents.length) params.scent = selectedScents.join(",");
        if (selectedCategories.length) params.category = selectedCategories.join(",");
        if (!showOutOfStock) params.in_stock = 'true';

        const endpoint =
          Object.keys(params).length > 0
            ? "/api/v1/candles/filter"
            : "/api/v1/candles";

        const response = await axios.get(
          `https://api.samaabysiblings.com/backend/${endpoint}`,
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
  }, [selectedScents, selectedCategories, showOutOfStock]);

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
    // Check stock before adding
    if (!product.in_stock || product.stock <= 0) {
      toast.error("This item is out of stock");
      return;
    }

    addToCart({
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      id: product.id,
      sku: product.slug,
    });
    toast.success(`"${product.name}" added to cart`);
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
    setShowOutOfStock(true);
  };

  return (
    <>
      <div className="bg-[#f5f5eb] pt-32 pb-20 px-6 sm:px-12 lg:px-20 relative min-h-screen flex">
        {/* Products grid */}
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
                const isOutOfStock = !product.in_stock || product.stock <= 0;
                
                return (
                  <div 
                    key={product.slug} 
                    className={`group relative ${isOutOfStock ? 'opacity-75' : ''}`} 
                    tabIndex={0}
                  >
                    <div className="aspect-[4/5] w-full relative overflow-hidden bg-gray-200 lg:h-[450px]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className={`object-cover transition duration-300 ${
                          isOutOfStock ? 'grayscale' : 'group-hover:opacity-80'
                        }`}
                      />

                      {/* Out of Stock Overlay */}
                      {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <span className="bg-white px-4 py-2 font-[D-DIN] text-sm font-semibold">
                            OUT OF STOCK
                          </span>
                        </div>
                      )}

                      {/* Hover Actions */}
                      {!isOutOfStock && (
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
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="text-sm text-gray-700 font-[D-DIN] font-medium">
                            <Link href={`/candles/${product.slug}`}>
                              {product.name}
                            </Link>
                          </h3>
                        </div>
                        <p className="text-sm font-[D-DIN] font-light text-gray-800 ml-2">
                          {formatPrice(product.price, currency)}
                        </p>
                      </div>
                      
                      {/* Stock Badge */}
                      <StockBadge 
                        stock={product.stock} 
                        stockStatus={product.stock_status}
                        inStock={product.in_stock}
                      />
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

        {/* Filter Button for desktop */}
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

      {/* Filter overlay */}
      <div
        className={`fixed inset-0 bg-white/80 bg-opacity-30 z-40 transition-opacity ${
          filterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setFilterOpen(false)}
      />

      {/* Filter sidebar */}
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
          {/* Stock Filter */}
          <div>
            <h4 className="font-semibold font-[D-DIN] mb-2">Availability</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOutOfStock}
                onChange={(e) => setShowOutOfStock(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-[D-DIN]">Show out of stock items</span>
            </label>
          </div>

          {/* Scent Filter */}
          <div>
            <h4 className="font-semibold font-[D-DIN] mb-2">by Scent</h4>
            <div className="flex flex-col gap-2">
              {["mogra", "sandalwood", "lemon grass", "jasmine"].map((scent) => {
                const isSelected = selectedScents.includes(scent);
                return (
                  <div
                    key={scent}
                    onClick={() => toggleFilterScent(scent)}
                    className={`cursor-pointer font-[D-DIN] text-sm transition-colors ${
                      isSelected
                        ? "text-[#262626] font-semibold decoration-black decoration-2"
                        : "text-gray-700 decoration-gray-400 decoration-1 hover:decoration-black"
                    }`}
                  >
                    {scent}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="font-semibold font-[D-DIN] mb-2">by Category</h4>
            <div className="flex flex-col gap-2">
              {["soft", "sharp"].map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <div
                    key={cat}
                    onClick={() => toggleFilterCategory(cat)}
                    className={`cursor-pointer text-sm decoration-1 ${
                      isSelected
                        ? "font-semibold text-[#262626]"
                        : "text-gray-700"
                    }`}
                  >
                    {cat}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="mt-10 w-full bg-black text-white font-[D-DIN] uppercase py-4 hover:bg-[#323232] transition text-xs"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </>
  );
}
