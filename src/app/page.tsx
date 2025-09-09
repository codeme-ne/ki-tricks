import { Header, Footer } from '@/components/layout'
import { AnimatedHeroSection } from '@/components/ui/animated-hero-section'
import { MinimalButton } from '@/components/ui/MinimalButton'
import { MinimalStatsGrid } from '@/components/ui/MinimalStatsGrid'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import type { Metadata } from 'next'
import { RefinedTrickCard } from '@/components/enhanced/RefinedTrickCard'
import { 
  getTotalTricksCount, 
  getTotalCategoriesCount, 
  getAllTools,
  getAverageImplementationTime,
  getTrickCountByCategory,
  getAllCategories,
  getPublishedTricks,
} from '@/lib/actions/tricks.actions'
import { categoryLabels, categoryEmojis, categoryIcons } from '@/lib/constants/constants'
import { Category, KITrick } from '@/lib/types/types'

// Icon mapping moved to constants for reuse

export const metadata: Metadata = {
  title: 'KI-Tricks: Automationen, Workflows & Prompts für Professionals',
  description: 'Bewährte KI-Tricks mit Schritt-für-Schritt-Anleitungen. Finde geprüfte Workflows nach Kategorien und Tools – von Produktivität bis Marketing.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'KI-Tricks: Automationen, Workflows & Prompts',
    description: 'Bewährte KI-Tricks mit Schritt-für-Schritt-Anleitungen. Finde geprüfte Workflows nach Kategorien und Tools.',
    type: 'website',
  },
}

export default async function HomePage() {
  // Calculate dynamic statistics from Supabase
  const totalTricks = await getTotalTricksCount()
  const totalCategories = await getTotalCategoriesCount()
  const allTools = await getAllTools()
  const totalTools = allTools.length
  const avgImplementationTime = await getAverageImplementationTime()
  const tricksByCategory = await getTrickCountByCategory()
  const allCategories = await getAllCategories()

  // Latest tricks for homepage
  const recentRaw = (await getPublishedTricks()).slice(0, 6)
  const recentTricks: KITrick[] = recentRaw.map((t: any) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    category: t.category as Category,
    tools: t.tools || [],
    steps: t.steps || [],
    examples: t.examples || [],
    slug: t.slug,
    createdAt: new Date(t.created_at),
    updatedAt: new Date(t.updated_at),
    'Warum es funktioniert': t.why_it_works,
    role: t.role ?? undefined,
    industries: t.industries ?? undefined,
    toolVendor: t.tool_vendor ?? undefined,
    integrations: t.integrations ?? undefined,
    estimatedTimeMinutes: t.estimated_time_minutes ?? undefined,
    estimatedSavingsMinutes: t.estimated_savings_minutes ?? undefined,
    riskLevel: t.risk_level ?? undefined,
    evidenceLevel: t.evidence_level ?? undefined,
    prerequisites: t.prerequisites ?? undefined,
    privacyNotes: t.privacy_notes ?? undefined,
    sources: (Array.isArray(t.sources) ? t.sources : undefined) as any,
    promptExamples: t.prompt_examples ?? undefined,
    kpiSuggestions: t.kpi_suggestions ?? undefined,
  }))
  
  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-b from-white to-neutral-50 overflow-hidden">
      {/* Content */}
      <div className="relative">
        <Header />

        {/* Integrated Hero Section */}
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedHeroSection />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white border-y border-neutral-200">
          <div className="container">
            <MinimalStatsGrid 
              stats={[
                {
                  value: totalTricks,
                  label: 'KI Tricks'
                },
                {
                  value: totalCategories,
                  label: 'Kategorien'
                },
                {
                  value: totalTools,
                  label: 'KI Tools'
                },
                {
                  value: avgImplementationTime,
                  label: 'Ø Umsetzungszeit',
                  suffix: ' min'
                }
              ]}
            />
          </div>
        </section>

        {/* Value Proposition / Intro */}
        <section className="py-16 bg-neutral-50">
          <div className="container max-w-5xl">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Was ist KI Tricks?</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  KI Tricks ist eine kuratierte Sammlung erprobter KI-Workflows, Automationen und Prompts.
                  Jedes Beispiel ist knapp erklärt, nachvollziehbar und nach Kategorien sowie Tools filterbar.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Ideal für Consultants, Marketer, Maker und Teams, die schnelle Ergebnisse brauchen –
                  ohne in generischen Tipps zu versinken.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-white border border-neutral-200 rounded-lg">
                  <h3 className="font-semibold mb-2">Schritt-für-Schritt</h3>
                  <p className="text-sm text-muted-foreground">Kompakte Anleitungen mit klaren Schritten und Beispielen.</p>
                </div>
                <div className="p-5 bg-white border border-neutral-200 rounded-lg">
                  <h3 className="font-semibold mb-2">Kategorisiert</h3>
                  <p className="text-sm text-muted-foreground">Finde schnell passende Tricks nach Kategorie und Tool.</p>
                </div>
                <div className="p-5 bg-white border border-neutral-200 rounded-lg">
                  <h3 className="font-semibold mb-2">Praxiserprobt</h3>
                  <p className="text-sm text-muted-foreground">Nur Workflows, die getestet und verständlich dokumentiert sind.</p>
                </div>
                <div className="p-5 bg-white border border-neutral-200 rounded-lg">
                  <h3 className="font-semibold mb-2">Schnelle Umsetzung</h3>
                  <p className="text-sm text-muted-foreground">Kurze Zeit bis zum Ergebnis, ideal für busy Professionals.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Tricks */}
        <section className="py-16 bg-white border-t border-neutral-200">
          <div className="container">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Neueste Tricks</h2>
              <Link href="/tricks" className="text-sm text-primary hover:underline">Alle ansehen →</Link>
            </div>
            {recentTricks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentTricks.map((trick) => (
                  <RefinedTrickCard key={trick.id} trick={trick} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Noch keine veröffentlichten Tricks.</p>
            )}
          </div>
        </section>

        {/* Categories Preview */}
        <section id="categories" className="py-16 bg-neutral-50">
          <div className="container">
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center text-subheading">
              Tricks nach Kategorien
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Dynamic Category Cards */}
              {allCategories
                .filter(category => (tricksByCategory[category] || 0) > 0) // Only show categories with tricks
                .sort((a, b) => (tricksByCategory[b] || 0) - (tricksByCategory[a] || 0)) // Sort by trick count
                .slice(0, 8) // Show top 8 categories
                .map(category => (
                  <Link 
                    key={category} 
                    href={`/tricks?categories=${category}`}
                    className="block h-full relative bg-white border border-neutral-200 rounded-lg p-6 text-center hover:border-neutral-400 hover:bg-neutral-50 transition-all duration-200 group"
                  >
                    <div className="relative w-10 h-10 md:w-12 md:h-12 mx-auto mb-3">
                      {categoryIcons[category as keyof typeof categoryIcons] ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={categoryIcons[category as keyof typeof categoryIcons]}
                            alt={categoryLabels[category as keyof typeof categoryLabels]}
                            fill
                            className="object-contain filter opacity-60 group-hover:opacity-90 transition-opacity duration-200"
                            style={{ filter: 'brightness(0) saturate(100%) invert(17%) sepia(0%) saturate(7%) hue-rotate(358deg) brightness(95%) contrast(97%)' }}
                          />
                        </div>
                      ) : (
                        <div className="text-3xl md:text-4xl flex items-center justify-center h-full opacity-60 group-hover:opacity-90 transition-opacity">
                          {categoryEmojis[category as keyof typeof categoryEmojis]}
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold mb-1 text-foreground text-sm md:text-base group-hover:text-primary transition-colors text-subheading">{categoryLabels[category as keyof typeof categoryLabels]}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground group-hover:text-foreground transition-colors text-readable">
                      {tricksByCategory[category] || 0} {(tricksByCategory[category] || 0) === 1 ? 'Trick' : 'Tricks'}
                    </p>
                  </Link>
                ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/tricks">
                <MinimalButton
                  variant="secondary"
                  size="md"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Alle Kategorien ansehen
                </MinimalButton>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white border-t border-neutral-200">
          <div className="container max-w-5xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">Häufige Fragen</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Für wen ist KI Tricks gedacht?</h3>
                <p className="text-muted-foreground">Für Professionals, die mit wenig Zeit schnelle, verlässliche Ergebnisse brauchen – z. B. Consultants, Marketer, Produktteams und Solo-Maker.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Sind die Anleitungen kostenlos?</h3>
                <p className="text-muted-foreground">Ja. Alle veröffentlichten Tricks sind frei zugänglich.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Wie werden Tricks ausgewählt?</h3>
                <p className="text-muted-foreground">Tricks werden auf Praxistauglichkeit geprüft, klar dokumentiert und kategorisiert. Community-Einsendungen werden redaktionell gesichtet.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Kann ich eigene Tricks einreichen?</h3>
                <p className="text-muted-foreground">Gerne – über <Link href="/tricks/einreichen" className="underline">Trick einreichen</Link> kannst du Beiträge vorschlagen.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'KI Tricks Plattform',
              url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ki-tricks.com').replace(/\/$/, '/') ,
              potentialAction: {
                '@type': 'SearchAction',
                target: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ki-tricks.com').replace(/\/$/, '') + '/tricks?search={search_term_string}',
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'KI Tricks Plattform',
              url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ki-tricks.com').replace(/\/$/, '/'),
              sameAs: ['https://github.com/codeme-ne']
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Für wen ist KI Tricks gedacht?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Für Professionals, die mit wenig Zeit schnelle, verlässliche Ergebnisse brauchen – z. B. Consultants, Marketer, Produktteams und Solo-Maker.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'Sind die Anleitungen kostenlos?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Ja. Alle veröffentlichten Tricks sind frei zugänglich.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'Wie werden Tricks ausgewählt?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Tricks werden auf Praxistauglichkeit geprüft, klar dokumentiert und kategorisiert. Community-Einsendungen werden redaktionell gesichtet.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'Kann ich eigene Tricks einreichen?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Über die Seite “Trick einreichen” können Beiträge vorgeschlagen werden.'
                  }
                }
              ]
            })
          }}
        />

        <Footer />
      </div>
    </div>
  )
}
