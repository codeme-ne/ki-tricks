import { Header, Footer } from '@/components/layout'
import { AnimatedHeroSection } from '@/components/ui/animated-hero-section'
import { MinimalButton } from '@/components/ui/MinimalButton'
import { MinimalStatsGrid } from '@/components/ui/MinimalStatsGrid'
import { BaseCard } from '@/components/atoms'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Filter, Target, Zap } from 'lucide-react'
import Image from 'next/image'
import type { Metadata } from 'next'
import { RefinedTrickCard } from '@/components/enhanced/RefinedTrickCard'
import { 
  getTotalTricksCount, 
  getTotalCategoriesCount, 
  getAllTools,
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
    steps: t.steps || null,
    examples: t.examples || null,
    slug: t.slug,
    why_it_works: t.why_it_works,
    status: t.status || 'published',
    quality_score: t.quality_score || null,
    view_count: t.view_count || 0,
    created_at: t.created_at,
    updated_at: t.updated_at,
    published_at: t.published_at || null
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
              columns={3}
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
                <BaseCard hover={false} variant="compact">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-neutral-900">Schritt-für-Schritt</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">Kompakte Anleitungen mit klaren Schritten und Beispielen.</p>
                    </div>
                  </div>
                </BaseCard>
                <BaseCard hover={false} variant="compact">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                      <Filter className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-neutral-900">Kategorisiert</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">Finde schnell passende Tricks nach Kategorie und Tool.</p>
                    </div>
                  </div>
                </BaseCard>
                <BaseCard hover={false} variant="compact">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-green-50 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-neutral-900">Praxiserprobt</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">Nur Workflows, die getestet und verständlich dokumentiert sind.</p>
                    </div>
                  </div>
                </BaseCard>
                <BaseCard hover={false} variant="compact">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-neutral-900">Schnelle Umsetzung</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">Kurze Zeit bis zum Ergebnis, ideal für busy Professionals.</p>
                    </div>
                  </div>
                </BaseCard>
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
                    className="block h-full group"
                  >
                    <BaseCard className="text-center" variant="compact">
                      <div className="relative w-12 h-12 mx-auto mb-3 p-2 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-200">
                        {categoryIcons[category as keyof typeof categoryIcons] ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={categoryIcons[category as keyof typeof categoryIcons]}
                              alt={categoryLabels[category as keyof typeof categoryLabels]}
                              fill
                              className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                              style={{ filter: 'brightness(0) saturate(100%)' }}
                            />
                          </div>
                        ) : (
                          <div className="text-2xl flex items-center justify-center h-full opacity-70 group-hover:opacity-100 transition-opacity">
                            {categoryEmojis[category as keyof typeof categoryEmojis]}
                          </div>
                        )}
                      </div>
                      <h4 className="font-semibold mb-1 text-foreground text-sm group-hover:text-blue-600 transition-colors">{categoryLabels[category as keyof typeof categoryLabels]}</h4>
                      <p className="text-xs text-muted-foreground">
                        {tricksByCategory[category] || 0} {(tricksByCategory[category] || 0) === 1 ? 'Trick' : 'Tricks'}
                      </p>
                    </BaseCard>
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

        {/* FAQ Section (toggles) */}
        <section className="py-16 bg-white border-t border-neutral-200">
          <div className="container max-w-5xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">Häufige Fragen</h2>
            <div className="space-y-3">
              <BaseCard hover={false} variant="compact">
                <details className="group" open>
                  <summary className="cursor-pointer font-semibold text-foreground list-none flex items-center justify-between hover:text-blue-600 transition-colors">
                    <span>Für wen ist KI Tricks gedacht?</span>
                    <div className="p-1 rounded bg-neutral-100 group-open:bg-blue-100 transition-colors">
                      <span className="text-neutral-500 group-open:text-blue-600 group-open:rotate-180 transition-all duration-200 block">▾</span>
                    </div>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed">Für Professionals, die mit wenig Zeit schnelle, verlässliche Ergebnisse brauchen – z. B. Consultants, Marketer, Produktteams und Solo-Maker.</p>
                </details>
              </BaseCard>

              <BaseCard hover={false} variant="compact">
                <details className="group">
                  <summary className="cursor-pointer font-semibold text-foreground list-none flex items-center justify-between hover:text-blue-600 transition-colors">
                    <span>Sind die Anleitungen kostenlos?</span>
                    <div className="p-1 rounded bg-neutral-100 group-open:bg-blue-100 transition-colors">
                      <span className="text-neutral-500 group-open:text-blue-600 group-open:rotate-180 transition-all duration-200 block">▾</span>
                    </div>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed">Ja. Alle veröffentlichten Tricks sind frei zugänglich.</p>
                </details>
              </BaseCard>

              <BaseCard hover={false} variant="compact">
                <details className="group">
                  <summary className="cursor-pointer font-semibold text-foreground list-none flex items-center justify-between hover:text-blue-600 transition-colors">
                    <span>Wie werden Tricks ausgewählt?</span>
                    <div className="p-1 rounded bg-neutral-100 group-open:bg-blue-100 transition-colors">
                      <span className="text-neutral-500 group-open:text-blue-600 group-open:rotate-180 transition-all duration-200 block">▾</span>
                    </div>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed">Tricks werden auf Praxistauglichkeit geprüft, klar dokumentiert und kategorisiert. Community-Einsendungen werden redaktionell gesichtet.</p>
                </details>
              </BaseCard>

              <BaseCard hover={false} variant="compact">
                <details className="group">
                  <summary className="cursor-pointer font-semibold text-foreground list-none flex items-center justify-between hover:text-blue-600 transition-colors">
                    <span>Kann ich eigene Tricks einreichen?</span>
                    <div className="p-1 rounded bg-neutral-100 group-open:bg-blue-100 transition-colors">
                      <span className="text-neutral-500 group-open:text-blue-600 group-open:rotate-180 transition-all duration-200 block">▾</span>
                    </div>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed">Gerne – über <Link href="/tricks/einreichen" className="text-blue-600 hover:text-blue-700 underline font-medium">Trick einreichen</Link> kannst du Beiträge vorschlagen.</p>
                </details>
              </BaseCard>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-neutral-50 border-t border-neutral-200">
          <div className="container max-w-5xl">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-foreground mb-3">Starte jetzt mit bewährten KI‑Workflows</h2>
                <p className="text-muted-foreground">Finde passende Tricks für deinen Use Case – oder reiche eigene ein und hilf der Community.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/tricks">
                    <MinimalButton variant="primary" size="lg">Tricks entdecken</MinimalButton>
                  </Link>
                  <Link href="/tricks/einreichen">
                    <MinimalButton variant="secondary" size="lg">Trick einreichen</MinimalButton>
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto w-32 h-32 md:w-40 md:h-40">
                <Image src="/icons/categories/marketing-target.svg" alt="Zielgerichtete KI‑Tricks" fill className="object-contain opacity-90" style={{ filter: 'brightness(0) saturate(100%)' }} />
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
