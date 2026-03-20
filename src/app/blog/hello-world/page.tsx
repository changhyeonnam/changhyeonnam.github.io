import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Hello World — Changhyeon Nam',
  description: 'First post.',
}

export default function HelloWorld() {
  return (
    <>
      <Nav />
      <main className="mt-6 flex min-h-0 flex-auto flex-col px-2 md:px-0">
        <article className="mb-16">
          <header className="mb-8">
            <h1
              className="mb-2 text-2xl font-semibold tracking-tighter"
              style={{ color: 'var(--c-text)' }}
            >
              Hello World
            </h1>
            <time className="text-sm tabular-nums" style={{ color: 'var(--c-text-muted)' }}>
              March 20, 2026
            </time>
          </header>

          <div className="prose-content text-sm">
            <p>This is a sample blog post. Replace this content with your own writing.</p>
            <p>
              Each post lives in its own directory under{' '}
              <code>src/app/blog/your-slug/page.tsx</code>. This makes it easy to add interactive
              React components — calculators, visualizations, demos — directly inside a post.
            </p>
            <h2>Adding a new post</h2>
            <p>
              1. Create <code>src/app/blog/your-slug/page.tsx</code>
              <br />
              2. Add the entry to <code>src/lib/posts.ts</code>
              <br />
              3. Done — it appears on the home page automatically.
            </p>
          </div>
        </article>

        <footer className="mb-16" />
      </main>
    </>
  )
}
