// app/stories/[slug]/page.tsx
import { Metadata } from 'next'
import StoryPageClient from './StoryPageClient'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "https://api.samaabysiblings.com/backend"

interface Story {
  slug: string
  tags: any
  id: number
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

// Fetch story data for metadata
async function getStory(slug: string): Promise<Story | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/stories/${slug}`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    })
    
    if (!res.ok) return null
    
    const data = await res.json()
    return data.data
  } catch (error) {
    console.error('Error fetching story:', error)
    return null
  }
}

// Generate metadata for SEO
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

  // Use excerpt (meta_description) or fallback to subtitle or truncated content
  const description = story.excerpt || story.subtitle || 
    `Read ${story.title} by ${story.author || 'Samaa by Siblings'}`

  return {
    title: `${story.title} | Samaa by Siblings Stories`,
    description: description.slice(0, 160), // Ensure max 160 chars
    
    // Open Graph (for Facebook, LinkedIn, etc.)
    openGraph: {
      title: story.title,
      description: description.slice(0, 160),
      type: 'article',
      url: `https://samaabysiblings.com/stories/${story.slug || params.slug}`,
      images: story.image_url ? [
        {
          url: story.image_url,
          width: 1200,
          height: 630,
          alt: story.title,
        }
      ] : [],
      siteName: 'Samaa by Siblings',
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
      description: description.slice(0, 160),
      ...(story.image_url && {
        images: [story.image_url],
      }),
      creator: '@samaabysiblings', // Replace with your Twitter handle
    },

    // Additional metadata
    alternates: {
      canonical: `https://samaabysiblings.com/stories/${params.slug}`,
    },
    
    keywords: story.tags?.join(', ') || 'stories, Samaa by Siblings',
    
    authors: story.author ? [{ name: story.author }] : undefined,
  }
}

export default function StoryPage({ params }: { params: { slug: string } }) {
  return <StoryPageClient />
}