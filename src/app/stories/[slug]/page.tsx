"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

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
    fetch(`/api/stories/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Story not found");
        return res.json();
      })
      .then((data) => {
        setStory(data.data);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p>Loading story...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!story) return <p>No story found</p>;

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
              return <p key={i}>{block.text}</p>;
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
