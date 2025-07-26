import { useEffect, useState } from "react";

export interface CandleProduct {
  slug: string;
  name: string;
  images: string[];
  tagline: string[]; // already correct
  price: number;
  description: string;
  notes: string[];
  features: string[];
  mood: string;
  isBundle?: boolean;
}

export function useProduct(slug?: string) {
  const [product, setProduct] = useState<CandleProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(false); // reset error state on new fetch

    fetch(`/api/v1candles/${slug}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Product not found");
        const json = await res.json();

        if (json.success && json.data) {
          const data = json.data;

          // Optional: Basic validation/fallbacks
          const safeProduct: CandleProduct = {
            slug: data.slug,
            name: data.name,
            images: Array.isArray(data.images) ? data.images : [],
            tagline: Array.isArray(data.tagline) ? data.tagline : [],
            price: typeof data.price === "number" ? data.price : 0,
            description:
              typeof data.description === "string" ? data.description : "",
            notes: Array.isArray(data.notes) ? data.notes : [],
            features: Array.isArray(data.features) ? data.features : [],
            mood: typeof data.mood === "string" ? data.mood : "",
            isBundle: !!data.isBundle,
          };
          setProduct(safeProduct);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch(() => {
        setError(true);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading, error };
}
