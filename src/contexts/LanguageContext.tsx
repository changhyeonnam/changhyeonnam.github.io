'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Language = 'en' | 'ko'

const LanguageContext = createContext<{
  lang: Language
  setLang: (lang: Language) => void
}>({ lang: 'en', setLang: () => {} })

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en')

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Language | null
    if (stored === 'en' || stored === 'ko') setLangState(stored)
  }, [])

  const setLang = (l: Language) => {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
