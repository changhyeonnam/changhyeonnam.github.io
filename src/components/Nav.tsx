'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export function Nav() {
  const { resolvedTheme, setTheme } = useTheme()
  const { lang, setLang } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <nav className="flex items-center justify-between px-2 md:px-0">
      <Link
        href="/"
        className="text-[15px] transition-opacity hover:opacity-50"
        style={{ color: 'var(--c-text-muted)' }}
      >
        home
      </Link>

      {mounted && (
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div
            className="flex items-center gap-0.5 rounded-full p-1"
            style={{ border: '1px solid var(--c-border)' }}
          >
            {(['en', 'ko'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="flex h-6 w-8 items-center justify-center rounded-full text-xs font-medium transition-all duration-150"
                style={{
                  backgroundColor: lang === l ? 'var(--c-text)' : 'transparent',
                  color: lang === l ? 'var(--c-bg)' : 'var(--c-text-muted)',
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <div
            className="flex items-center gap-0.5 rounded-full p-1"
            style={{ border: '1px solid var(--c-border)' }}
          >
            {[
              { value: 'light', icon: <SunIcon /> },
              { value: 'dark', icon: <MoonIcon /> },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                aria-label={opt.value}
                className="flex h-6 w-6 items-center justify-center rounded-full transition-all duration-150"
                style={{
                  backgroundColor: resolvedTheme === opt.value ? 'var(--c-text)' : 'transparent',
                  color: resolvedTheme === opt.value ? 'var(--c-bg)' : 'var(--c-text-muted)',
                }}
              >
                {opt.icon}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
