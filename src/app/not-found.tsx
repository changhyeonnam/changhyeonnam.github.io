import Link from 'next/link'
import { Nav } from '@/components/Nav'

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="mt-6 flex min-h-0 flex-auto flex-col px-2 md:px-0">
        <section className="mb-16">
          <h1 className="mb-4 text-2xl font-semibold tracking-tighter" style={{ color: 'var(--c-text)' }}>
            404
          </h1>
          <p className="mb-6 text-sm" style={{ color: 'var(--c-text-muted)' }}>
            Page not found.
          </p>
          <Link
            href="/"
            className="text-sm text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← back home
          </Link>
        </section>
      </main>
    </>
  )
}
