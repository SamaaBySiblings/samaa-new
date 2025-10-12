"use client"

import { JSX, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import axios from "axios"
import React from "react"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "https://api.samaabysiblings.com/backend"

interface Story {
  title: string
  subtitle?: string
  image_url?: string
  content: any // Tiptap JSON content
  author?: string
}

// Recursively render Tiptap JSON nodes
function renderTiptapNode(node: any, index: number): React.ReactNode {
  if (!node) return null

  const { type, content, attrs, marks, text } = node

  // Handle text nodes
  if (type === "text") {
    let rendered: React.ReactNode = text

    // Apply marks (bold, italic, underline, etc.)
    if (marks && marks.length > 0) {
      marks.forEach((mark: any) => {
        if (mark.type === "bold") rendered = <strong key={`${index}-bold`}>{rendered}</strong>
        if (mark.type === "italic") rendered = <em key={`${index}-italic`}>{rendered}</em>
        if (mark.type === "underline") rendered = <u key={`${index}-underline`}>{rendered}</u>
        if (mark.type === "link")
          rendered = (
            <a
              key={`${index}-link`}
              href={mark.attrs.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {rendered}
            </a>
          )
      })
    }

    return <span key={index}>{rendered}</span>
  }

  // Handle block nodes
  const children = content?.map((child: any, i: number) =>
    renderTiptapNode(child, i)
  )

  switch (type) {
    case "doc":
      return <div key={index}>{children}</div>

    case "paragraph":
      return <p key={index}>{children}</p>

    case "heading":
      const level = attrs?.level || 1
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements
      return React.createElement(HeadingTag, { key: index }, children)

    case "bulletList":
      return <ul key={index} className="list-disc ml-6">{children}</ul>

    case "orderedList":
      return <ol key={index} className="list-decimal ml-6">{children}</ol>

    case "listItem":
      return <li key={index}>{children}</li>

    case "blockquote":
      return (
        <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic">
          {children}
        </blockquote>
      )

    case "codeBlock":
      return (
        <pre key={index} className="bg-gray-100 p-4 rounded overflow-x-auto">
          <code>{children}</code>
        </pre>
      )

    case "image":
      return (
        <div key={index} className="relative w-[65%] aspect-square mx-auto my-8">
          <Image
            src={attrs?.src || ""}
            alt={attrs?.alt || ""}
            fill
            className="object-cover rounded"
          />
        </div>
      )

    case "hardBreak":
      return <br key={index} />

    case "table":
      return (
        <table key={index} className="border-collapse border border-gray-300 my-4">
          <tbody>{children}</tbody>
        </table>
      )

    case "tableRow":
      return <tr key={index}>{children}</tr>

    case "tableCell":
      return (
        <td key={index} className="border border-gray-300 p-2">
          {children}
        </td>
      )

    case "tableHeader":
      return (
        <th key={index} className="border border-gray-300 p-2 font-bold bg-gray-50">
          {children}
        </th>
      )

    default:
      return <div key={index}>{children}</div>
  }
}

export default function StoryPageClient() {
  const params = useParams()
  const slug = params?.slug as string
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    setLoading(true)
    axios
      .get(`${API_BASE_URL}/api/v1/stories/${slug}`)
      .then((response) => {
        const storyData = response.data.data
        // Parse content if it's a string
        if (typeof storyData.content === "string") {
          storyData.content = JSON.parse(storyData.content)
        }
        setStory(storyData)
        setError(null)
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setError("Story not found")
        } else {
          setError(error.message)
        }
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <p className="text-center py-24">Loading story...</p>
  if (error) return <p className="text-center py-24 text-red-500">Error: {error}</p>
  if (!story) return <p className="text-center py-24">No story found</p>

  return (
    <div className="px-4 md:px-8 lg:px-16 py-24 bg-[var(--brand-light)] text-[var(--brand-dark)]">
      <article className="max-w-3xl mx-auto font-[D-DIN]">
        {/* Cover Image */}
        {story.image_url && (
          <div className="relative w-full aspect-[16/9] mb-8">
            <Image
              src={story.image_url}
              alt={story.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-left leading-tight tracking-wide mb-4">
          {story.title}
        </h1>

        {/* Subtitle */}
        {story.subtitle && (
          <p className="text-xl text-gray-600 mb-8">{story.subtitle}</p>
        )}

        {/* Author */}
        {story.author && (
          <p className="text-sm text-gray-500 mb-8">By {story.author}</p>
        )}

        {/* Body Content - Render Tiptap JSON */}
        <div className="prose prose-lg max-w-none space-y-4 text-[var(--brand-dark)]">
          {story.content && renderTiptapNode(story.content, 0)}
        </div>

        {/* CTA */}
        <div className="mt-12 text-right italic text-sm">
          <Link
            href="https://substack.com/@samaacircle"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800 underline"
          >
            -{">"}It's your turn to twist it
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
  )
}