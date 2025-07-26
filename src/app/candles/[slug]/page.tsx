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
import { useRouter } from "next/router";

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
  const router = useRouter();
  const { scent: scentFromQuery } = router.query;
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

  // Collapsible toggles for left column
  const [showNotes, setShowNotes] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showMood, setShowMood] = useState(false);

  // When query param changes, update selectedScents filter
  useEffect(() => {
    if (typeof scentFromQuery === "string") {
      setSelectedScents([scentFromQuery]);
    } else if (Array.isArray(scentFromQuery)) {
      // If multiple scents passed (like ?scent=sharp&scent=soft)
      setSelectedScents(scentFromQuery);
    } else {
      // If no scent param, clear scents filter
      setSelectedScents([]);
    }
  }, [scentFromQuery]);

  useEffect(() => {
    if (!product) return;

    const interval = setInterval(() => {
      setActiveImage((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }, 6000); // change image every 6 seconds

    return () => clearInterval(interval);
  }, [product]);

  if (loading) return <ProductPageSkeleton />;
  if (error || !product) return <p className="p-6">Product not found.</p>;

  const formatPrice = (priceINR: number) => {
    const converted = convertPrice(priceINR, currency);
    return getCurrencySymbol(currency) + converted.toFixed(2);
  };

  // Open modal at clicked image
  const openModal = (index: number) => {
    setModalImageIndex(index);
    setModalOpen(true);
  };

  // Navigate modal images
  const prevImage = () => {
    setModalImageIndex((idx) =>
      idx === 0 ? product.images.length - 1 : idx - 1
    );
  };
  const nextImage = () => {
    setModalImageIndex((idx) =>
      idx === product.images.length - 1 ? 0 : idx + 1
    );
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

  // Format description into 3 paragraphs by splitting sentences
  const formatDescription = (text: string) => {
    const sentences = text.split(". ").map((s) => s.trim());
    const para1 = sentences.slice(0, 3).join(". ") + ".";
    const para2 = sentences.slice(3, 6).join(". ") + ".";
    const para3 = sentences.slice(6).join(".");
    return [para1, para2, para3];
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
          modalOpen ? "filter blur-sm" : ""
        }`}
      >
        <Toaster position="top-right" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* LEFT COLUMN */}
          <div className="space-y-6 text-sm">
            {/* Product Name */}
            <h1 className="text-2xl font-[D-DIN] font-light leading-tight">
              {product.name}
            </h1>
            <hr className="border-t border-gray-800" />

            {/* Tagline display */}
            <div className="space-y-1 text-gray-700">
              {taglineLines.map((line, i) => (
                <p key={i} className="font-light font-[D-DIN]">
                  {line}
                </p>
              ))}
            </div>

            <hr className="mt-55 border-t border-gray-800" />

            {/* Fragrance Notes - collapsible */}
            <div>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="flex items-center justify-between w-full text-base"
                aria-expanded={showNotes}
                aria-controls="fragrance-notes"
              >
                <span className="font-[D-DIN]">Fragrance Notes</span>
                <span className="text-xl">{showNotes ? "-" : "+"}</span>
              </button>
              {showNotes && (
                <>
                  <hr className="border-t border-gray-800 font-medium my-2" />
                  <ul
                    id="fragrance-notes"
                    className="text-gray-800 space-y-1 list-disc list-inside"
                  >
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

            {/* Details & Features - collapsible */}
            <div>
              <button
                onClick={() => setShowFeatures(!showFeatures)}
                className="flex items-center justify-between w-full  text-base"
                aria-expanded={showFeatures}
                aria-controls="details-features"
              >
                <span className="font-[D-DIN]">Details & Features</span>
                <span className="text-xl">{showFeatures ? "-" : "+"}</span>
              </button>
              {showFeatures && (
                <>
                  <hr className="border-t border-gray-800 my-2" />
                  <ul
                    id="details-features"
                    className="list-disc list-inside text-gray-800 space-y-1"
                  >
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="font-[D-DIN] font-light">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <hr className="border-t border-gray-800" />

            {/* Mood - collapsible */}
            <div>
              <button
                onClick={() => setShowMood((prev) => !prev)}
                className="flex items-center justify-between w-full text-base"
                aria-expanded={showMood}
                aria-controls="product-mood"
              >
                <span className="font-[D-DIN]">Mood</span>
                <span className="text-xl">{showMood ? "-" : "+"}</span>
              </button>
              {showMood && (
                <>
                  <hr className="border-t border-gray-800 my-2" />
                  <p
                    id="product-mood"
                    className="text-gray-700 font-[D-DIN] font-light"
                  >
                    {product.mood}
                  </p>
                </>
              )}
            </div>

            <hr className="border-t border-gray-800" />

            {/* Qty or Bundle Selector */}
            <div>
              {isBundle ? (
                <div>
                  <h3 className="font-medium mb-2 font-[D-DIN]">
                    Select 2-4 candles
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {bundleOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() =>
                          bundleSelection.includes(opt)
                            ? setBundleSelection(
                                bundleSelection.filter((i) => i !== opt)
                              )
                            : bundleSelection.length < 4
                            ? setBundleSelection([...bundleSelection, opt])
                            : bundleSelection
                        }
                        className={`px-2 py-1 rounded border text-sm transition ${
                          bundleSelection.includes(opt)
                            ? "bg-black text-white"
                            : "bg-white text-black hover:bg-gray-100"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
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
            </div>

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

          {/* CENTER COLUMN */}
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

          {/* RIGHT COLUMN: Image + Dots */}
          <div
            className="relative mt-14 w-full h-72 md:h-120 cursor-pointer font-[D-DIN] overflow-hidden shadow-sm"
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
            onClick={() => openModal(activeImage)}
          >
            <Image
              src={product.images[activeImage]}
              alt={`${product.name} image ${activeImage + 1}`}
              fill
              className="object-cover"
            />

            {/* Vertical Dot Navigation on Right */}
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
                  aria-label={`Select image ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 bg-opacity-70"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery modal"
        >
          <div
            className="relative w-full max-w-4xl max-h-[80vh] px-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button fixed top right edge of screen */}
            <button
              onClick={() => setModalOpen(false)}
              className="fixed top-4 right-4 text-white bg-black text-3xl cursor-pointer border border-amber-900 px-2 py-1 z-50 hover:text-gray-700 transition"
              aria-label="Close modal"
            >
              &times;
            </button>

            {/* Left arrow */}
            <button
              onClick={prevImage}
              className="fixed left-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black border border-amber-900 px-2 py-1 cursor-pointer z-50 select-none hover:text-gray-700 transition"
              aria-label="Previous image"
            >
              &#8249;
            </button>

            {/* Right arrow */}
            <button
              onClick={nextImage}
              className="fixed right-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black border border-amber-900 px-2 py-1 cursor-pointer z-50 select-none hover:text-gray-700 transition"
              aria-label="Next image"
            >
              &#8250;
            </button>

            {/* Modal image */}
            <Image
              src={product.images[modalImageIndex]}
              alt={`${product.name} large image ${modalImageIndex + 1}`}
              width={900}
              height={600}
              className="object-contain rounded mx-auto max-h-[80vh]"
            />
          </div>
        </div>
      )}
    </>
  );
}

