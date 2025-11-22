// app/stories/[slug]/page.tsx
import { Metadata } from 'next'
import StoryPageClient from '@/app/stories/[slug]/StoryPageClient'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "https://api.samaabysiblings.com/backend"

interface Story {
  id: number
  slug: string
  title: string
  subtitle?: string
  image_url?: string
  content: any
  author?: string
  excerpt?: string
  read_time_minutes?: number
  created_at: string
  cta_text?: string
  cta_link?: string
}

// Fetch story for metadata (Server-side)
async function getStory(slug: string): Promise<Story | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/stories/${slug}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
      cache: 'force-cache'
    })
    
    if (!res.ok) {
      console.error(`Failed to fetch story: ${res.status}`)
      return null
    }
    
    const data = await res.json()
    return data.data
  } catch (error) {
    console.error('Error fetching story for metadata:', error)
    return null
  }
}

// Generate metadata (runs on server)
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const story = await getStory(params.slug)

  if (!story) {
    return {
      title: 'Story Not Found | Samaa by Siblings',
      description: 'The requested story could not be found.',
    }
  }

  // Use excerpt as meta description, or fallback to subtitle
  const description = story.excerpt || story.subtitle || 
    `Read ${story.title} by ${story.author || 'Samaa by Siblings'}`

  const truncatedDescription = description.slice(0, 160)

  return {
    title: `${story.title} | Samaa by Siblings Stories`,
    description: truncatedDescription,
    
    // Open Graph (Facebook, LinkedIn)
    openGraph: {
      title: story.title,
      description: truncatedDescription,
      type: 'article',
      url: `https://www.samaabysiblings.com/stories/${params.slug}`,
      siteName: 'Samaa by Siblings',
      ...(story.image_url && {
        images: [
          {
            url: story.image_url,
            width: 1200,
            height: 630,
            alt: story.title,
          }
        ],
      }),
      ...(story.created_at && {
        publishedTime: story.created_at,
      }),
      ...(story.author && {
        authors: [story.author],
      }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: story.title,
      description: truncatedDescription,
      ...(story.image_url && {
        images: [story.image_url],
      }),
      creator: '@samaabysiblings',
    },

    // Additional metadata
    alternates: {
      canonical: `https://www.samaabysiblings.com/stories/${params.slug}`,
    },
    
    authors: story.author ? [{ name: story.author }] : undefined,
    
    other: {
      'article:published_time': story.created_at,
      'article:author': story.author || 'Samaa by Siblings',
    }
  }
}

// Main page component (Server Component)
export default function StoryPage({ params }: { params: { slug: string } }) {
  return <StoryPageClient slug={params.slug} />
}