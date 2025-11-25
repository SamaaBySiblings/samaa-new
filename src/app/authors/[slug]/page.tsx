import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import * as LucideIcons from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://api.samaabysiblings.com/backend"

interface Author {
  id: number
  slug: string
  name: string
  title?: string
  company?: string
  bio?: string
  profile_image_url?: string
  email?: string
  linkedin_url?: string
  twitter_url?: string
  website_url?: string
  expertise?: string[]
  stories: Story[]
  story_count: number
}

interface Story {
  id: number
  slug: string
  title: string
  subtitle?: string
  image_url?: string
  excerpt?: string
  read_time_minutes?: number
  created_at: string
}

async function getAuthor(slug: string): Promise<Author | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/authors/${slug}`, {
      next: { revalidate: 300 },
      cache: 'force-cache'
    })
    
    if (!res.ok) return null
    
    const data = await res.json()
    return data.data
  } catch (error) {
    console.error('Error fetching author:', error)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthor(slug)
  
  if (!author) {
    return {
      title: 'Author Not Found | Samaa by Siblings',
    }
  }

  const description = author.bio?.slice(0, 160) || 
    `${author.name} - ${author.title || 'Author'} at Samaa by Siblings`

  return {
    title: `${author.name} | Samaa by Siblings Authors`,
    description,
    openGraph: {
      title: author.name,
      description,
      type: 'profile',
      url: `https://www.samaabysiblings.com/authors/${slug}`,
      ...(author.profile_image_url && {
        images: [author.profile_image_url],
      }),
    },
    twitter: {
      card: 'summary',
      title: author.name,
      description,
    },
  }
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const author = await getAuthor(slug)

  if (!author) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[var(--brand-light)] px-4 md:px-8 lg:px-16 py-24">
      <div className="max-w-6xl mx-auto">
        {/* Author Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
            {author.profile_image_url && (
              <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={author.profile_image_url}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Author Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{author.name}</h1>
              
              {author.title && (
                <p className="text-xl text-gray-600 mb-1">{author.title}</p>
              )}
              
              {author.company && (
                <p className="text-lg text-gray-500 mb-4">{author.company}</p>
              )}

              {/* Social Links */}
              <div className="flex flex-wrap gap-4 mb-6">
                {author.linkedin_url && (
                  <a
                    href={author.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <LucideIcons.Linkedin className="h-5 w-5" />
                    LinkedIn
                  </a>
                )}
                {author.twitter_url && (
                  <a
                    href={author.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:underline"
                  >
                    <LucideIcons.Twitter className="h-5 w-5" />
                    Twitter
                  </a>
                )}
                {author.website_url && (
                  <a
                    href={author.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:underline"
                  >
                    <LucideIcons.Globe className="h-5 w-5" />
                    Website
                  </a>
                )}
              </div>

              {/* Expertise Tags */}
              {author.expertise && author.expertise.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {author.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              {author.bio && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {author.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Author's Stories */}
        <div>
          <h2 className="text-3xl font-bold mb-6">
            Stories by {author.name} ({author.story_count})
          </h2>

          {author.stories.length === 0 ? (
            <p className="text-gray-500">No published stories yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {author.stories.map((story) => (
                <Link
                  key={story.id}
                  href={`/stories/${story.slug}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition group"
                >
                  {story.image_url && (
                    <div className="relative w-full aspect-video rounded-t-lg overflow-hidden">
                      <Image
                        src={story.image_url}
                        alt={story.title}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition">
                      {story.title}
                    </h3>
                    {story.subtitle && (
                      <p className="text-gray-600 text-sm mb-3">{story.subtitle}</p>
                    )}
                    {story.excerpt && (
                      <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                        {story.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {story.read_time_minutes && (
                        <span>{story.read_time_minutes} min read</span>
                      )}
                      <span>•</span>
                      <span>
                        {new Date(story.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition"
          >
            <span>←</span>
            <span>Back to all stories</span>
          </Link>
        </div>
      </div>
    </div>
  )
}