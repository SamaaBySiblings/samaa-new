"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "https://api.samaabysiblings.com/backend";

interface ContentBlock {
  type: "paragraph" | "image";
  text?: string;
  src?: string;
  alt?: string;
}

interface Story {
  title: string;
  image: string;
  content: ContentBlock[];
}

export default function StoryPageClient() {
  const { slug } = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    axios
      .get(`${API_BASE_URL}/api/v1/stories/${slug}`)
      .then((response) => {
        setStory(response.data.data);
        setError(null);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setError("Story not found");
        } else {
          setError(error.message);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p>Loading story...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!story) return <p>No story found</p>;

  return (
    <div className="px-4 md:px-8 lg:px-16 py-24 bg-[var(--brand-light)] text-[var(--brand-dark)]">
      <article className="max-w-3xl mx-auto font-[D-DIN]">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center leading-tight tracking-wide mb-8">
          {story.title}
        </h1>

        {/* Hero Image */}
       

        {/* Body Content */}
        <div className="prose prose-lg prose-invert max-w-none space-y-8 text-[var(--brand-dark)]">
          {story.content.map((block, i) => {
            if (block.type === "paragraph") {
              return <p key={i}>{block.text}</p>;
            }

            if (block.type === "image") {
              return (
                <div
                  key={i}
                  className="relative w-full h-[300px] md:h-[400px] my-8"
                >
                  <Image
                    src={block.src!}
                    alt={block.alt || ""}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-right italic text-sm">
          <Link
            href="https://substack.com/@samaacircle"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800 underline"
          >
            -{">"} It's your turn to twist it
          </Link>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/stories"
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            ← Back to all stories
          </Link>
        </div>
      </article>
    </div>
  );
}
