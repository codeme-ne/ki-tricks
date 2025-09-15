
import { Analytics } from '@vercel/analytics/next';
import DevToolbar from '@/components/DevToolbar';
import type { Metadata } from 'next'
import '../styles/globals.css'
import { PerformanceMonitoring } from '@/components/PerformanceMonitoring'

// Conditional font loading - use system fonts in CI/restricted environments
const inter = process.env.SKIP_GOOGLE_FONTS === 'true' 
  ? { className: 'font-sans' }
  : (() => {
      try {
        const { Inter } = require('next/font/google')
        return Inter({ 
          subsets: ['latin'],
          display: 'swap',
        })
      } catch {
        return { className: 'font-sans' }
      }
    })()

export const metadata: Metadata = {
  // Ensure absolute URLs for OG and canonical
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ki-tricks.com'),
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
    url: 'https://www.ki-tricks.com',
    siteName: 'KI Tricks Plattform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KI-Automationen & Workflows für Berater',
    description: 'Entdecke praktische KI-Automationen für deinen Arbeitsalltag',
    creator: '@codeme_ne',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
  <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        {children}
        <DevToolbar />
        <Analytics />
        <PerformanceMonitoring />
      </body>
    </html>
  )
}
