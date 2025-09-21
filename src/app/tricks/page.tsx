import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import TricksProvider from './TricksProvider'
import { Header, Footer } from '@/components/layout'
import { BreadcrumbNav } from '@/components/molecules'
import { TrickGridSkeleton } from '@/components/atoms/SkeletonLoader'
import { Button } from '@/components/ui/button'

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

  <main className="container max-w-7xl py-6 px-4">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNav items={[
          { label: 'Alle Tricks', href: '/tricks', current: true }
        ]} />
        
        {/* Page Header */}
        <div className="mb-8 content-spacing">
          <h1 className="text-heading-1">Entdecke KI Tricks</h1>
          <p className="text-body-large">Finde praktische KI-Tipps und Tricks für deinen Arbeitsalltag</p>
        </div>

        <Suspense fallback={
          <div className="space-y-6">
            <div className="text-body text-muted-foreground">Lade KI-Tricks...</div>
            <TrickGridSkeleton count={9} />
          </div>
        }>
          <TricksProvider />
        </Suspense>
      </main>

  <Footer />
    </div>
  )
}
