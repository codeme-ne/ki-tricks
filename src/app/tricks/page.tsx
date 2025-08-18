import { Suspense } from 'react'
import { Metadata } from 'next'
import { Header, Footer, PageContainer } from '@/components/layout'
import { SparklesCore } from '@/components/atoms'
import TricksProvider from './TricksProvider'

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
    <div className="min-h-screen flex flex-col relative">
      {/* Background Sparkles */}
      <div className="fixed inset-0 h-full w-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#2299dd"
          speed={1}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Header />
        <PageContainer>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-100 mb-2">
              Entdecke KI Tricks
            </h1>
            <p className="text-lg text-neutral-300">
              Finde praktische KI-Tipps und Tricks für deinen Arbeitsalltag
            </p>
          </div>

          <Suspense fallback={<div>Lade...</div>}>
            <TricksProvider />
          </Suspense>
        </PageContainer>
        <Footer />
      </div>
    </div>
  )
}