'use client'

import Link from 'next/link'
import { Nav } from '@/components/Nav'
import { posts } from '@/lib/posts'
import { useLanguage } from '@/contexts/LanguageContext'

const content = {
  en: {
    p1: 'At SKTelecom, I build GPU platforms for LLM training and serving, covering the full stack from infrastructure to application.',
    p2: 'I developed LLM pretraining and finetuning pipelines on Kubernetes and Slurm, and on the inference side, I focus on disaggregated serving architectures and KV cache tiering, optimizing performance across the system (Kubernetes, NVIDIA Dynamo, etc).',
    p3: 'Previously, I worked as an ML Engineer Intern at NAVER Clova and KIST, building RecSys models with Transformer/RL and MF, ALS, etc.',
  },
  ko: {
    p1: 'SK Telecom에서 LLM 학습 및 서빙을 위한 GPU 플랫폼을 개발하고 있으며, 인프라부터 애플리케이션까지 전반을 담당하고 있습니다.',
    p2: 'Kubernetes와 Slurm 기반 pretraining 및 finetuning 파이프라인을 구축했고, inference 영역에서는 disaggregated serving과 KV cache tiering을 중심으로 시스템 성능 최적화를 수행하고 있습니다.',
    p3: '이전에는 NAVER Clova와 KIST에서 ML Engineer Intern으로 근무하며 Transformer, RL, MF, ALS 기반 RecSys를 개발했습니다.',
  },
}

export default function Home() {
  const { lang } = useLanguage()
  const t = content[lang]

  return (
    <>
      <Nav />
      <main className="mt-6 flex min-h-0 flex-auto flex-col px-2 md:px-0">
        <section className="mb-16">
          <h1 className="mb-8 text-2xl font-semibold tracking-tighter" style={{ color: 'var(--c-text)' }}>
            Changhyeon Nam
          </h1>
          <p className="mb-4 leading-relaxed" style={{ color: 'var(--c-text)' }}>
            {t.p1}
          </p>
          <p className="mb-4 leading-relaxed" style={{ color: 'var(--c-text)' }}>
            {t.p2}
          </p>
          <p className="mb-4 leading-relaxed" style={{ color: 'var(--c-text)' }}>
            {t.p3}
          </p>
          <div className="mt-6 flex items-center gap-4">
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
            <a
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-50"
              style={{ color: 'var(--c-text-muted)' }}
              aria-label="RSS feed"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
              </svg>
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
