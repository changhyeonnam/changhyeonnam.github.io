import { posts } from '@/lib/posts'

export const dynamic = 'force-static'

export function GET() {
  const baseUrl = 'https://changhyeonnam.github.io'

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <description><![CDATA[${post.description ?? ''}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
    </item>`,
    )
    .join('')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Changhyeon Nam</title>
    <link>${baseUrl}</link>
    <description>Changhyeon Nam's blog</description>
    <language>en</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(feed, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
