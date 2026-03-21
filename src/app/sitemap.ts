import type { MetadataRoute } from 'next'
import { posts } from '@/lib/posts'

export const dynamic = 'force-static'

const baseUrl = 'https://changhyeonnam.github.io'

export default function sitemap(): MetadataRoute.Sitemap {
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }))

  return [
    { url: baseUrl, lastModified: new Date() },
    ...postUrls,
  ]
}
