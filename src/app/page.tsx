import Link from 'next/link'
import { Nav } from '@/components/Nav'
import { posts } from '@/lib/posts'

export default function Home() {
  return (
    <>
      <Nav />
      <main className="mt-6 flex min-h-0 flex-auto flex-col px-2 md:px-0">
        <section className="mb-16">
          <h1 className="mb-8 text-2xl font-semibold tracking-tighter" style={{ color: 'var(--c-text)' }}>
            Changhyeon Nam
          </h1>
          <p className="mb-4 leading-relaxed" style={{ color: 'var(--c-text)' }}>
            At SK Telecom, I build GPU platforms for LLM training and serving, covering the full
            stack from infrastructure to application.
          </p>
          <p className="mb-4 leading-relaxed" style={{ color: 'var(--c-text)' }}>
            I developed LLM pretraining and finetuning pipelines on Kubernetes and Slurm, and on
            the inference side, I focus on disaggregated serving architectures and KV cache
            tiering, optimizing performance across the system (Kubernetes, NVIDIA Dynamo, etc).
          </p>
          <p className="mb-4 leading-relaxed" style={{ color: 'var(--c-text)' }}>
            Previously, I worked as an ML Engineer Intern at NAVER Clova and KIST, building
            RecSys models with Transformer/RL and MF, ALS, etc.
          </p>
          <div className="mt-6 flex gap-4">
            <a
              href="https://github.com/changhyeonnam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-opacity hover:opacity-50"
              style={{ color: 'var(--c-text-muted)' }}
            >
              github
            </a>
            <a
              href="https://www.linkedin.com/in/changhyeon-nam-9306a616b/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-opacity hover:opacity-50"
              style={{ color: 'var(--c-text-muted)' }}
            >
              linkedin
            </a>
          </div>
        </section>

        {posts.length > 0 && (
          <section className="mb-16">
            {posts.map((post) => (
              <div
                key={post.slug}
                className="mb-4 flex flex-col space-y-1 md:flex-row md:space-x-2 md:space-y-0"
              >
                <span
                  className="w-[140px] shrink-0 tabular-nums text-sm"
                  style={{ color: 'var(--c-text-muted)' }}
                >
                  {post.date}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="tracking-tight text-sm hover:underline"
                  style={{ color: 'var(--c-text)' }}
                >
                  {post.title}
                </Link>
              </div>
            ))}
          </section>
        )}

        <footer className="mb-16" />
      </main>
    </>
  )
}
