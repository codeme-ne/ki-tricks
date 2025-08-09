
import { Analytics } from '@vercel/analytics/next';
import DevToolbar from '@/components/DevToolbar';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KI-Automationen, KI-Workflows und KI-Prompts',
  description: 'Entdecke praktische KI-Automationen, Workflows und Prompts für Berater und Coaches. Steigere deine Produktivität mit Claude Code, Claude AI, ChatGPT und No-Code Tools. KI-Workflows die funktionieren.',
  keywords: 'KI-Automationen, KI-Workflows, KI-Prompts, KI für Berater und Coaches, Claude Code, Claude AI, KI Tricks, Künstliche Intelligenz, ChatGPT, Claude, Produktivität, Automatisierung',
  authors: [{ name: 'Lukas Zangerl' }],
  creator: 'Lukas Zangerl',
  publisher: 'KI Tricks Plattform',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'KI-Automationen & Workflows für Berater | KI Tricks Plattform',
    description: 'Entdecke praktische KI-Automationen, Workflows und Prompts für Berater und Coaches. Steigere deine Produktivität mit Claude Code, Claude AI, ChatGPT und No-Code Tools. KI-Workflows die funktionieren.',
    type: 'website',
    locale: 'de_DE',
    url: 'https://ai-tricks-platform.vercel.app',
    siteName: 'KI Tricks Plattform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KI-Automationen & Workflows für Berater',
    description: 'Entdecke praktische KI-Automationen für deinen Arbeitsalltag',
    creator: '@codeme_ne',
  },
  alternates: {
    canonical: 'https://ai-tricks-platform.vercel.app',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={inter.className}>
      <body className="min-h-screen bg-neutral-900 text-neutral-100 antialiased">
        {children}
        <DevToolbar />
        <Analytics />
      </body>
    </html>
  )
}