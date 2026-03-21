import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'

const geist = Geist({ subsets: ['latin'] })

const baseUrl = 'https://changhyeonnam.com'

export const metadata: Metadata = {
  title: 'Changhyeon Nam',
  description: 'Software Engineer at SK Telecom, building GPU platforms for LLM training and serving.',
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: 'Changhyeon Nam',
    description: 'Software Engineer at SK Telecom, building GPU platforms for LLM training and serving.',
    url: baseUrl,
    siteName: 'Changhyeon Nam',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Changhyeon Nam',
    description: 'Software Engineer at SK Telecom, building GPU platforms for LLM training and serving.',
  },
  alternates: {
    types: {
      'application/rss+xml': `${baseUrl}/feed.xml`,
    },
  },
  verification: {
    google: '0V5CXBSMLGnza61r-3pc1C5RKiHmyEU-CshJ1GQutK0',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} mx-4 mt-8 max-w-2xl antialiased lg:mx-auto`}>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
