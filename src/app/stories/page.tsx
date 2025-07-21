"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Post {
  slug: string;
  image?: string;
  title: string;
}

export default function StoriesPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/stories")
      .then((res) => res.json())
      .then(setPosts)
      .catch(console.error);
  }, []);

  function chunk<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  }

  const getRandomColor = () =>
    `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;

  const [hoverColors, setHoverColors] = useState<Record<number, string>>({});

  const onEnter = (index: number) =>
    setHoverColors((prev) => ({ ...prev, [index]: getRandomColor() }));

  const onLeave = (index: number) =>
    setHoverColors((prev) => ({ ...prev, [index]: "transparent" }));

  return (
    <div className="pt-45 bg-light min-h-screen px-0">
      <h1 className="font-[TANTanglon] text-base md:text-xm font-light tracking-widest mb-5">
        STORIES
      </h1>

      {chunk(posts, 4).map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-2 sm:grid-cols-4">
          {row.map((post, i) => {
            const idx = rowIndex * 4 + i;
            return (
              <Link
                key={post.slug}
                href={`/stories/${post.slug}`}
                onMouseEnter={() => onEnter(idx)}
                onMouseLeave={() => onLeave(idx)}
                className="relative group aspect-[3/4] bg-white overflow-hidden"
              >
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:opacity-20 transition"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                    No image
                  </div>
                )}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  style={{ backgroundColor: hoverColors[idx] }}
                >
                  <h2 className="font-[D-DIN] text-xs uppercase tracking-widest px-2 text-black text-center">
                    {post.title}
                  </h2>
                </div>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
