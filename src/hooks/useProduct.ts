import { useEffect, useState } from "react";
import axios from "axios";

// This allows easy env management — remember to set it in your `.env` or Vercel env
const API_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "https://api.samaabysiblings.com/backend";

export interface CandleProduct {
  slug: string;
  name: string;
  images: string[];
  tagline: string[];
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

    const fetchProduct = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/candles/${slug}`
        );

        if (response.data.success && response.data.data) {
          const data = response.data.data;

          const safeProduct: CandleProduct = {
            slug: data.slug,
            name: data.name,
            images: Array.isArray(data.images) ? data.images : [],
            tagline: Array.isArray(data.taglines) ? data.taglines : [],
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
          throw new Error("Invalid product data format");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(true);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
}
