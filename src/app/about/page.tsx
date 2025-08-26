import { Metadata } from 'next'
import { Header, Footer, PageContainer } from '@/components/layout'

export const metadata: Metadata = {
  title: 'KI für Berater und Coaches | Über KI Tricks Platform',
  description: 'Erfahre wie KI-Automationen und Workflows Beratern und Coaches helfen, produktiver zu arbeiten. Praktische Anleitungen für ChatGPT, Claude und mehr.',
  keywords: 'KI für Berater, KI für Coaches, KI Beratung, Automatisierung für Berater, KI-Tools für Coaching',
  openGraph: {
    title: 'KI für Berater und Coaches | KI Tricks Platform',
    description: 'Praktische KI-Lösungen speziell für Berater und Coaches.',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <PageContainer>
        <div className="max-w-3xl mx-auto py-16">
          <h1 className="text-3xl font-bold text-neutral-900 mb-8">
            Über KI Tricks
          </h1>
          
          <div className="prose prose-lg text-neutral-600">
            <p className="text-xl mb-6">
              KI Tricks ist eine kuratierte Sammlung praktischer KI-Tipps und Tricks, 
              die dir helfen, deinen Arbeitsalltag zu optimieren.
            </p>
            
            <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
              Unsere Mission
            </h2>
            <p>
              Wir glauben daran, dass KI-Tools für jeden zugänglich und nützlich sein sollten. 
              Deshalb sammeln, testen und teilen wir die besten KI-Tricks, die wirklich funktionieren.
            </p>
            
            <h2 className="text-2xl font-semibold text-neutral-900 mt-8 mb-4">
              Was dich erwartet
            </h2>
            <ul>
              <li>Geprüfte und getestete KI-Tricks</li>
              <li>Schritt-für-Schritt Anleitungen</li>
              <li>Kategorisierung nach Anwendungsbereichen</li>
              <li>Klarer Fokus: nur nach Kategorien filtern</li>
            </ul>
          </div>
        </div>
      </PageContainer>

      <Footer />
    </div>
  )
}