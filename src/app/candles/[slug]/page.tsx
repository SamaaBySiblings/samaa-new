"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useCartStore } from "@/store/cart";
import { useCurrencyStore } from "@/store/currency";
import { convertPrice, getCurrencySymbol } from "@/lib/currency";
import { useProduct } from "@/hooks/useProduct";
import ProductPageSkeleton from "@/components/ProductPageSkeleton";
import { useSearchParams } from "next/navigation";

const bundleOptions = [
  "Golden Sandal",
  "Gajray Bonds",
  "Lemon Crystals",
  "Velvet Pearls",
];

const getBundlePrice = (count: number) =>
  count === 2 ? 1010 : count === 3 ? 1449 : count === 4 ? 1799 : 0;

interface CandlePageProps {
  params: Promise<{ slug: string }>;
}

export default function CandlePage({ params }: CandlePageProps) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const { product, loading, error } = useProduct(slug);
  const addToCart = useCartStore((s) => s.addToCart);
  const currency = useCurrencyStore((s) => s.currency);

  const isBundle = slug === "compose-your-set";

  const [qty, setQty] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [selectedScents, setSelectedScents] = useState<string[]>([]);
  const [bundleSelection, setBundleSelection] = useState<string[]>([]);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [bundleDialogOpen, setBundleDialogOpen] = useState(false);
  const [tempSelection, setTempSelection] = useState<string[]>([]);

  const [showNotes, setShowNotes] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showMood, setShowMood] = useState(false);

  useEffect(() => {
    const scents = searchParams.getAll("scent");
    if (scents.length > 0) {
      setSelectedScents(scents);
    } else {
      setSelectedScents([]);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!product?.images?.length) return;
    const interval = setInterval(() => {
      setActiveImage((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }, 6000);
    return () => clearInterval(interval);
  }, [product]);

  if (loading) return <ProductPageSkeleton />;
  if (error || !product) return <p className="p-6">Product not found.</p>;

  const formatPrice = (priceINR: number) => {
    const converted = convertPrice(priceINR, currency);
    return getCurrencySymbol(currency) + converted.toFixed(2);
  };

  const handleAdd = () => {
    if (isBundle) {
      if (bundleSelection.length < 2 || bundleSelection.length > 4) {
        toast.error("Please select 2 to 4 candles for your bundle.");
        return;
      }
      const price = getBundlePrice(bundleSelection.length);
      addToCart({
        slug,
        name: `${product.name} (${bundleSelection.join(", ")})`,
        price,
        quantity: 1,
        image: product.images[0],
      });
      toast.success("Bundle added to cart!");
      setBundleSelection([]);
    } else {
      addToCart({
        slug,
        name: product.name,
        price: product.price * qty,
        quantity: qty,
        image: product.images[0],
      });
      toast.success("Added to cart!");
    }
  };

  const formatDescription = (text: string) => {
    const sentences = text
      .split(". ")
      .map((s) => s.trim())
      .filter((s) => s);
    if (sentences.length === 0) return ["", "", ""];

    const totalSentences = sentences.length;
    const sentencesPerPara = Math.ceil(totalSentences / 3);

    const para1 =
      sentences.slice(0, sentencesPerPara).join(". ") +
      (sentences.slice(0, sentencesPerPara).length > 0 ? "." : "");
    const para2 =
      sentences.slice(sentencesPerPara, sentencesPerPara * 2).join(". ") +
      (sentences.slice(sentencesPerPara, sentencesPerPara * 2).length > 0
        ? "."
        : "");
    const para3 =
      sentences.slice(sentencesPerPara * 2).join(". ") +
      (sentences.slice(sentencesPerPara * 2).length > 0 ? "." : "");

    return [para1, para2, para3].filter((p) => p.trim() !== ".");
  };

  const paragraphs = formatDescription(product.description);
  const displayPriceINR = isBundle
    ? getBundlePrice(bundleSelection.length)
    : product.price * qty;

  const taglineLines = product.tagline ?? [];

  return (
    <>
      <div
        className={`pt-38 pb-6 px-4 md:px-10 bg-[var(--brand-light)] text-[var(--brand-dark)] min-h-screen ${
          modalOpen || bundleDialogOpen ? "filter blur-sm" : ""
        }`}
      >
        <Toaster position="top-right" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* LEFT COLUMN */}
          <div className="space-y-6 text-sm">
            <h1 className="text-2xl font-[D-DIN] font-light leading-tight">
              {product.name}
            </h1>
            <hr className="border-t border-gray-800" />

            <div className="space-y-1 text-gray-700">
              {taglineLines.map((line, i) => (
                <p key={i} className="font-light font-[D-DIN]">
                  {line}
                </p>
              ))}
            </div>

            <hr className="mt-55 border-t border-gray-800" />

            {/* Fragrance Notes */}
            <div>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="flex items-center justify-between w-full text-base"
              >
                <span className="font-[D-DIN]">Fragrance Notes</span>
                <span className="text-xl">{showNotes ? "-" : "+"}</span>
              </button>
              {showNotes && (
                <>
                  <hr className="border-t border-gray-800 my-2" />
                  <ul className="list-disc list-inside space-y-1">
                    {product.notes.map((note, idx) => (
                      <li key={idx} className="font-light font-[D-DIN]">
                        {note}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <hr className="border-t border-gray-800" />

            {/* Features */}
            <div>
              <button
                onClick={() => setShowFeatures(!showFeatures)}
                className="flex items-center justify-between w-full text-base"
              >
                <span className="font-[D-DIN]">Details & Features</span>
                <span className="text-xl">{showFeatures ? "-" : "+"}</span>
              </button>
              {showFeatures && (
                <>
                  <hr className="border-t border-gray-800 my-2" />
                  <ul className="list-disc list-inside space-y-1">
                    {product.features.map((f, idx) => (
                      <li key={idx} className="font-light font-[D-DIN]">
                        {f}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <hr className="border-t border-gray-800" />

            {/* Mood */}
            <div>
              <button
                onClick={() => setShowMood(!showMood)}
                className="flex items-center justify-between w-full text-base"
              >
                <span className="font-[D-DIN]">Mood</span>
                <span className="text-xl">{showMood ? "-" : "+"}</span>
              </button>
              {showMood && (
                <>
                  <hr className="border-t border-gray-800 my-2" />
                  <p className="text-gray-700 font-[D-DIN] font-light">
                    {product.mood}
                  </p>
                </>
              )}
            </div>

            <hr className="border-t border-gray-800" />

            {/* Quantity or Bundle */}
            {isBundle ? (
              <div>
                <h3 className="font-medium mb-2 font-[D-DIN]">
                  Select 2-4 candles
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {bundleOptions.map((opt) => {
                    const isChecked = bundleSelection.includes(opt);
                    const canSelectMore = bundleSelection.length < 4;

                    return (
                      <label
                        key={opt}
                        className={`flex items-center gap-2 px-2 py-1  border text-sm cursor-pointer transition ${
                          isChecked
                            ? "bg-black text-white border-black"
                            : "bg-[#f5f5eb] text-[#262626] hover:bg-gray-100 border-gray-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setBundleSelection(
                                bundleSelection.filter((i) => i !== opt)
                              );
                            } else if (canSelectMore) {
                              setBundleSelection([...bundleSelection, opt]);
                            }
                          }}
                          className="accent-black cursor-pointer"
                        />
                        {opt}
                      </label>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-600 font-[D-DIN] mt-1">
                  Selected: {bundleSelection.length} / 4
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <label
                  htmlFor="qty"
                  className="font-medium font-[D-DIN] text-sm"
                >
                  Qty:
                </label>
                <input
                  id="qty"
                  type="number"
                  min={1}
                  max={10}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Math.min(10, Number(e.target.value))))
                  }
                  className="w-16 px-2 py-1 font-[D-DIN] text-center text-sm"
                />
              </div>
            )}

            {/* Add to Cart */}
            <div className="space-y-1">
              <button
                onClick={handleAdd}
                className="w-full bg-black text-white py-4 font-[D-DIN] uppercase text-sm font-semibold hover:bg-gray-800 transition"
              >
                Add to Cart
              </button>
              <p className="text-base font-medium font-[D-DIN] text-gray-700">
                {formatPrice(displayPriceINR)}
              </p>
            </div>
          </div>

          {/* CENTER COLUMN: Description */}
          <div className="space-y-10">
            <div className="flex justify-end mt-13">
              <hr className="w-full border-t border-gray-800" />
            </div>
            {paragraphs.map((para, idx) => (
              <p key={idx} className="font-light font-[D-DIN]">
                {para}
              </p>
            ))}
          </div>

          {/* RIGHT COLUMN: Image carousel */}
          <div
            className="relative mt-14 w-full h-72 md:h-120 cursor-pointer overflow-hidden"
            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStartX === null) return;
              const touchEndX = e.changedTouches[0].clientX;
              const diff = touchStartX - touchEndX;
              if (diff > 50 && activeImage < product.images.length - 1) {
                setActiveImage(activeImage + 1);
              } else if (diff < -50 && activeImage > 0) {
                setActiveImage(activeImage - 1);
              }
              setTouchStartX(null);
            }}
            onClick={() => {
              setModalImageIndex(activeImage);
              setModalOpen(true);
            }}
          >
            {product.images && (
              <Image
                src={product.images[activeImage]}
                alt={`${product.name} image ${activeImage + 1}`}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute top-1/2 right-2 -translate-y-1/2 flex flex-col gap-2">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(i);
                  }}
                  className={`h-2.5 w-2.5 rounded-lg transition border ${
                    i === activeImage
                      ? "bg-black border-black"
                      : "border-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bundle Selection Dialog */}
      {bundleDialogOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={() => setBundleDialogOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-md shadow-md w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-[D-DIN] font-semibold mb-4">
              Select 2–4 Candles
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {bundleOptions.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center space-x-2 text-sm font-[D-DIN]"
                >
                  <input
                    type="checkbox"
                    checked={tempSelection.includes(opt)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (tempSelection.length < 4) {
                          setTempSelection([...tempSelection, opt]);
                        }
                      } else {
                        setTempSelection(
                          tempSelection.filter((i) => i !== opt)
                        );
                      }
                    }}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Selected: {tempSelection.length} / 4
            </p>
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setBundleDialogOpen(false)}
                className="px-3 py-1 text-sm border border-gray-400 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (tempSelection.length < 2 || tempSelection.length > 4) {
                    toast.error("Please select 2 to 4 candles.");
                    return;
                  }
                  setBundleSelection(tempSelection);
                  setBundleDialogOpen(false);
                }}
                className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Image Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-white/80 bg-opacity-75 flex items-center justify-center"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full h-[80vh] cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={product.images[modalImageIndex]}
              alt={`Modal view - ${product.name}`}
              fill
              className="object-contain"
            />
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-black text-3xl font-bold"
            >
              &times;
            </button>
            {/* Optional navigation buttons */}
            {product.images.length > 1 && (
              <>
                {/* Left Arrow */}
                <button
                  onClick={() =>
                    setModalImageIndex((prev) =>
                      prev === 0 ? product.images.length - 1 : prev - 1
                    )
                  }
                  className="fixed left-4 md:left-10 top-1/2 -translate-y-1/2 z-50
                 bg-white/70 text-black text-5xl 
                 border border-black px-4 py-2 
                 shadow-lg hover:bg-white transition-all duration-200"
                  aria-label="Previous image"
                >
                  ‹
                </button>

                {/* Right Arrow */}
                <button
                  onClick={() =>
                    setModalImageIndex((prev) =>
                      prev === product.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="fixed right-4 md:right-10 top-1/2 -translate-y-1/2 z-50
                 bg-white/70 text-black text-5xl 
                 border border-black px-4 py-2 
                 shadow-lg hover:bg-white transition-all duration-200"
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
