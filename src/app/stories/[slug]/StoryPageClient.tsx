// app/stories/[slug]/StoryPageClient.tsx
"use client";

import { JSX, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import React from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "https://api.samaabysiblings.com/backend";

interface Story {
  author_slug: any;
  author_name: string | undefined;
  id: number;
  title: string;
  subtitle?: string;
  image_url?: string;
  content: any;
  author?: string;
  read_time_minutes?: number;
  created_at: string;
  cta_text?: string;
  cta_link?: string;
}

// Helper to generate slug from author name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Render function (keep as is)
function renderTiptapNode(node: any, index: number): React.ReactNode {
  // ... your existing renderTiptapNode code ...
  if (!node) return null;

  const { type, content, attrs, marks, text } = node;

  if (type === "text") {
    let rendered: React.ReactNode = text;

    if (marks && marks.length > 0) {
      marks.forEach((mark: any, markIndex: number) => {
        const key = `${index}-${mark.type}-${markIndex}`;
        if (mark.type === "bold")
          rendered = <strong key={key}>{rendered}</strong>;
        if (mark.type === "italic") rendered = <em key={key}>{rendered}</em>;
        if (mark.type === "underline") rendered = <u key={key}>{rendered}</u>;
        if (mark.type === "link")
          rendered = (
            <a
              key={key}
              href={mark.attrs.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {rendered}
            </a>
          );
      });
    }

    return <span key={index}>{rendered}</span>;
  }

  const children = content?.map((child: any, i: number) =>
    renderTiptapNode(child, `${index}-${i}` as any)
  );

  switch (type) {
    case "doc":
      return <div key={index}>{children}</div>;
    case "paragraph":
      return (
        <p key={index} className="mb-4">
          {children}
        </p>
      );
    case "heading":
      const level = attrs?.level || 1;
      const headingClasses: Record<number, string> = {
        1: "text-3xl font-bold mt-8 mb-4",
        2: "text-2xl font-bold mt-6 mb-3",
        3: "text-xl font-semibold mt-4 mb-2",
      };
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
      return React.createElement(
        HeadingTag,
        { key: index, className: headingClasses[level] },
        children
      );
    case "bulletList":
      return (
        <ul key={index} className="list-disc ml-6 mb-4 space-y-2">
          {children}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={index} className="list-decimal ml-6 mb-4 space-y-2">
          {children}
        </ol>
      );
    case "listItem":
      return <li key={index}>{children}</li>;
    case "blockquote":
      return (
        <blockquote
          key={index}
          className="border-l-4 border-gray-400 pl-4 italic my-4 text-gray-700"
        >
          {children}
        </blockquote>
      );
    case "codeBlock":
      return (
        <pre
          key={index}
          className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm"
        >
          <code>{children}</code>
        </pre>
      );
    case "image":
      return (
        <div key={index} className="relative w-full max-w-2xl mx-auto my-8">
          <div className="relative w-full aspect-video">
            <Image
              src={attrs?.src || ""}
              alt={attrs?.alt || "Image"}
              fill
              className="object-contain rounded-lg"
            />
          </div>
          {attrs?.alt && (
            <p className="text-sm text-gray-500 text-center mt-2 italic">
              {attrs.alt}
            </p>
          )}
        </div>
      );
    case "hardBreak":
      return <br key={index} />;
    case "table":
      return (
        <div key={index} className="overflow-x-auto my-6">
          <table className="min-w-full border-collapse border border-gray-300">
            <tbody>{children}</tbody>
          </table>
        </div>
      );
    case "tableRow":
      return <tr key={index}>{children}</tr>;
    case "tableCell":
      return (
        <td key={index} className="border border-gray-300 p-3 text-sm">
          {children}
        </td>
      );
    case "tableHeader":
      return (
        <th
          key={index}
          className="border border-gray-300 p-3 font-bold bg-gray-50 text-sm"
        >
          {children}
        </th>
      );
    default:
      console.warn(`Unhandled node type: ${type}`);
      return <div key={index}>{children}</div>;
  }
}

// Client Component
export default function StoryPageClient({ slug }: { slug: string }) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);

    axios
      .get(`${API_BASE_URL}/api/v1/stories/${slug}`)
      .then((response) => {
        const storyData = response.data.data;

        if (typeof storyData.content === "string") {
          try {
            storyData.content = JSON.parse(storyData.content);
          } catch (e) {
            console.error("Failed to parse content:", e);
            throw new Error("Invalid story content format");
          }
        }

        setStory(storyData);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching story:", error);
        if (error.response && error.response.status === 404) {
          setError("Story not found");
        } else {
          setError(error.message || "Failed to load story");
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--brand-light)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--brand-light)]">
        <div className="text-center max-w-md px-4">
          <p className="text-red-500 text-xl mb-4">😔 {error}</p>
          <Link
            href="/stories"
            className="inline-block px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
          >
            ← Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--brand-light)]">
        <div className="text-center">
          <p className="text-gray-600">No story found</p>
          <Link
            href="/stories"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            ← Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 py-24 bg-[var(--brand-light)] text-[var(--brand-dark)] min-h-screen">
      <article className="max-w-3xl mx-auto font-[D-DIN]">
        {story.image_url && (
          <div className="relative w-full aspect-[16/9] mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={story.image_url}
              alt={story.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold text-left leading-tight tracking-wide mb-4">
          {story.title}
        </h1>

        {story.subtitle && (
          <p className="text-xl text-gray-600 mb-6">{story.subtitle}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
          {story.author_slug ? (
            <span>
              By{" "}
              <Link
                href={`/authors/${story.author_slug}`}
                className="font-bold hover:text-gray-800 hover:underline transition"
              >
                {story.author_name || story.author}
              </Link>
            </span>
          ) : (
            story.author && (
              <span>
                By <strong>{story.author}</strong>
              </span>
            )
          )}
          {story.read_time_minutes && (
            <>
              <span>•</span>
              <span>{story.read_time_minutes} min read</span>
            </>
          )}
          {story.created_at && (
            <>
              <span>•</span>
              <span>
                {new Date(story.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </>
          )}
        </div>

        <div className="prose prose-lg max-w-none text-[var(--brand-dark)] leading-relaxed">
          {story.content && renderTiptapNode(story.content, 0)}
        </div>

        {(story.cta_text || story.cta_link) && (
          <div className="mt-16 pt-8 border-t border-gray-200 text-right">
            <Link
              href={story.cta_link || "https://substack.com/@samaacircle"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 underline italic text-sm transition"
            >
              {story.cta_text || "It's your turn to twist it →"}
            </Link>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition"
          >
            <span>←</span>
            <span>Back to all stories</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
