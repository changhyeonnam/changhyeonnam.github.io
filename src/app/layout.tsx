import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Changhyeon Nam',
  description: 'Software Engineer at SK Telecom, working on AI infrastructure and LLM systems.',
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
