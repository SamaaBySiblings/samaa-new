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

  function toTitleCase(str: string): string {
    return str.replace(
      /\w\S*/g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
  }

  function capitalizeFirstWordOnly(text: string): string {
    const trimmed = text.trim();
    const firstSpace = trimmed.indexOf(" ");
    if (firstSpace === -1)
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();

    return (
      trimmed.charAt(0).toUpperCase() +
      trimmed.slice(1, firstSpace).toLowerCase() +
      trimmed.slice(firstSpace)
    );
  }

  return (
    <div className="pt-45 px-4 md:px-8 lg:px-16 bg-[var(--brand-light)] text-[var(--brand-dark)]">
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="space-y-4">
          <h1 className="font-[D-DIN] font-logo uppercase tracking-wide text-4xl md:text-lg leading-tight">
            {story.title}
          </h1>
        </header>

        <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden rounded-xl shadow-lg">
          <Image
            src={story.image}
            alt={story.title}
            fill
            className="object-cover"
          />
        </div>

        <article className="font-[D-DIN] prose prose-lg mx-auto">
          {story.content.map((block, i) => {
            if (block.type === "paragraph") {
              return <p key={i}>{capitalizeFirstWordOnly(block.text || "")}</p>;
            }
            if (block.type === "image") {
              return (
                <div
                  key={i}
                  className="font-[D-DIN] my-8 relative w-full h-[300px] md:h-[400px] rounded overflow-hidden shadow-lg"
                >
                  <Image
                    src={block.src!}
                    alt={block.alt || ""}
                    fill
                    className="object-cover"
                  />
                </div>
              );
            }
            return null;
          })}
          <div className="mt-8 text-center italic">
            <Link
              href="https://substack.com/@samaacircle"
              target="_blank"
              rel="noopener noreferrer"
              className="font-[D-DIN] text-sm text-gray-600 hover:text-gray-800 underline"
            >
              -{">"} It's your turn to twist it
            </Link>
          </div>
        </article>

        <Link
          href="/stories"
          className="font-[D-DIN] text-sm text-gray-600 hover:text-gray-800 underline"
        >
          ← Back to all stories
        </Link>
      </div>
    </div>
  );
}
