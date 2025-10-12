"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import axios from "axios"

interface Story {
  id: number
  slug: string
  image_url?: string
  title: string
  published: boolean
  excerpt?: string
  read_time_minutes?: number
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "https://api.samaabysiblings.com/backend"

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/v1/stories/`)
      .then((response) => {
        console.log("API Response:", response.data) // Debug log
        // Backend returns data in response.data.data
        const allStories = response.data.data || []
        // Only show published stories on public page
        const publishedStories = allStories.filter((s: Story) => s.published)
        setStories(publishedStories)
        setError(null)
      })
      .catch((err) => {
        console.error("Error fetching stories:", err)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  function chunk<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    )
  }

  const getRandomColor = () =>
    `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`

  const [hoverColors, setHoverColors] = useState<Record<number, string>>({})

  const onEnter = (index: number) =>
    setHoverColors((prev) => ({ ...prev, [index]: getRandomColor() }))

  const onLeave = (index: number) =>
    setHoverColors((prev) => ({ ...prev, [index]: "transparent" }))

  if (loading) {
    return (
      <div className="pt-45 bg-light min-h-screen px-0">
        <h1 className="font-[TANTanglon] text-base md:text-xm font-light tracking-widest mb-5">
          STORIES
        </h1>
        <p className="text-center py-12 text-gray-500">Loading stories...</p>
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <div className="pt-45 bg-light min-h-screen px-0">
        <h1 className="font-[TANTanglon] text-base md:text-xm font-light tracking-widest mb-5">
          STORIES
        </h1>
        <p className="text-center py-12 text-gray-500">No stories published yet</p>
      </div>
    )
  }

  return (
    <div className="pt-45 bg-light min-h-screen px-0">
      <h1 className="font-[TANTanglon] text-base md:text-xm font-light tracking-widest mb-5">
        STORIES
      </h1>

      {chunk(stories, 4).map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-2 sm:grid-cols-4">
          {row.map((story, i) => {
            const idx = rowIndex * 4 + i
            return (
              <Link
                key={story.slug}
                href={`/stories/${story.slug}`}
                onMouseEnter={() => onEnter(idx)}
                onMouseLeave={() => onLeave(idx)}
                className="relative group aspect-[3/4] bg-white overflow-hidden"
              >
                {story.image_url ? (
                  <Image
                    src={story.image_url}
                    alt={story.title}
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
                  <h2 className="font-[D-DIN] text-xs uppercase tracking-widest px-2 text-[#262626] text-center">
                    {story.title}
                  </h2>
                </div>
              </Link>
            )
          })}
        </div>
      ))}
    </div>
  )
}