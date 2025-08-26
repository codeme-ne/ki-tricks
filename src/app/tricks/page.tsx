import { Suspense } from 'react'
import { Metadata } from 'next'
import TricksProvider from './TricksProvider'
import { Header, Footer } from '@/components/layout'

export const metadata: Metadata = {
  title: 'KI-Workflows für Professionals | Praktische KI-Tricks 2025',
  description: 'Filtere durch kategorisierte KI-Tricks für Produktivität, Content-Creation und Business. Mit Schwierigkeitsgrad und Zeitschätzung. KI-Automationen die wirklich funktionieren.',
  keywords: 'KI-Workflows, KI-Tricks, KI Automation, ChatGPT Tricks, Claude Tipps, KI für Business, Produktivität steigern',
  openGraph: {
    title: 'KI-Workflows für Professionals | KI Tricks Platform',
    description: 'Entdecke praktische KI-Tricks mit detaillierten Anleitungen und Beispielen.',
  },
}

export default function TricksPage() {
  return (
    <div className="min-h-screen bg-background">
  <Header />

  <main className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4 leading-tight tracking-tight">Entdecke KI Tricks</h1>
          <p className="text-muted-foreground text-base sm:text-lg">Finde praktische KI-Tipps und Tricks für deinen Arbeitsalltag</p>
        </div>

        <Suspense fallback={<div className="text-muted-foreground">Lade...</div>}>
          <TricksProvider />
        </Suspense>
      </main>

  <Footer />
    </div>
  )
}