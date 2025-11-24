// app/candles/[slug]/page.tsx
import { Metadata } from "next";
import CandlePageClient from "./CandlePageClient";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "https://api.samaabysiblings.com/backend";

interface Candle {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  scent?: string;
  description?: string;
  mood?: string;
  stock: number;
  in_stock: boolean;
  is_bundle?: boolean;
  taglines?: string[];
  images?: string[];
  notes?: string[];
  features?: string[];
}

// Fetch candle for metadata (Server-side)
async function getCandle(slug: string): Promise<Candle | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/candles/${slug}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
      cache: "force-cache",
    });

    if (!res.ok) {
      console.error(`Failed to fetch candle: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching candle for metadata:", error);
    return null;
  }
}

// Generate metadata (runs on server)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const candle = await getCandle(slug);

  if (!candle) {
    return {
      title: "Product Not Found | Samaa by Siblings",
      description: "The requested product could not be found.",
    };
  }

  // Create a compelling meta description
  // Priority: description > mood > scent + category info
  let description = "";

  if (candle.description) {
    // Take first 2-3 sentences or 160 chars
    const sentences = candle.description.split(". ").slice(0, 2);
    description = sentences.join(". ") + (sentences.length > 0 ? "." : "");
  } else if (candle.mood) {
    description = candle.mood;
  } else {
    description = `${candle.name} - A ${candle.category || ""} ${
      candle.scent || ""
    } scented candle handcrafted by Samaa by Siblings.`;
  }

  const truncatedDescription = description.slice(0, 160);

  // Format price for display
  const formattedPrice = `₹${candle.price.toFixed(2)}`;

  return {
    title: `${candle.name} - ${formattedPrice} | Samaa by Siblings`,
    description: truncatedDescription,

    // Open Graph (Facebook, LinkedIn)
    openGraph: {
      title: candle.name,
      description: truncatedDescription,
      type: "website",
      url: `https://www.samaabysiblings.com/candles/${slug}`,
      siteName: "Samaa by Siblings",
      ...(candle.image && {
        images: [
          {
            url: candle.image,
            width: 1200,
            height: 630,
            alt: candle.name,
          },
        ],
      }),
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: candle.name,
      description: truncatedDescription,
      ...(candle.image && {
        images: [candle.image],
      }),
      creator: "@samaabysiblings",
    },

    // Additional metadata
    alternates: {
      canonical: `https://www.samaabysiblings.com/candles/${slug}`,
    },

    // Product-specific metadata
    other: {
      "product:price:amount": candle.price.toString(),
      "product:price:currency": "INR",
      "product:availability":
        candle.in_stock && candle.stock > 0 ? "in stock" : "out of stock",
      "product:condition": "new",
      "product:brand": "Samaa by Siblings",
      ...(candle.category && { "product:category": candle.category }),
    },

    // Keywords for SEO
    keywords: [
      candle.name,
      "scented candles",
      "luxury candles",
      "soy candles",
      "handmade candles",
      ...(candle.scent ? [candle.scent] : []),
      ...(candle.category ? [candle.category] : []),
      "Samaa by Siblings",
      "Indian candles",
    ].join(", "),
  };
}

// Main page component (Server Component)
export default async function CandlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CandlePageClient params={Promise.resolve({ slug })} />;
}
