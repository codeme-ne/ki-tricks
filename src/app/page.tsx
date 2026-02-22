import { Header, Footer } from '@/components/layout'
import { AnimatedHeroSection } from '@/components/ui/animated-hero-section'
import { Button } from '@/components/ui/button'
import { BaseCard } from '@/components/atoms'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Filter, Target, Zap, ChevronDown, HelpCircle, Sparkles } from 'lucide-react'
import Image from 'next/image'
import type { Metadata } from 'next'
import { TrickCard, FAQAccordion } from '@/components/molecules'
import SchemaMarkup from '@/components/SEO/SchemaMarkup'
import type { Database } from '@/lib/supabase/types'
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateFAQSchema
} from '@/lib/utils/schema-markup'
import { NewsletterSignup, FloatingNewsletterWidget } from '@/components/monetization'
import { 
  getTotalTricksCount, 
  getTotalCategoriesCount, 
  getAllTools,
  getTrickCountByCategory,
  getAllCategories,
  getPublishedTricks,
} from '@/lib/actions/tricks.actions'
import { categoryLabels, categoryLucideIcons } from '@/lib/constants/constants'
import { Category, KITrick } from '@/lib/types/types'

// Icon mapping moved to constants for reuse
type PublishedTrickRow = Database['public']['Tables']['ki_tricks']['Row']

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
// Enable ISR: Revalidate every 60 seconds
export const revalidate = 60

export default async function HomePage() {
  // Calculate dynamic statistics from Supabase
  const totalTricks = await getTotalTricksCount()
  const totalCategories = await getTotalCategoriesCount()
  const allTools = await getAllTools()
  const totalTools = allTools.length
  const tricksByCategory = await getTrickCountByCategory()
  const allCategories = await getAllCategories()

  // Latest tricks for homepage
  const recentRaw = (await getPublishedTricks()).slice(0, 6) as PublishedTrickRow[]
  const recentTricks: KITrick[] = recentRaw.map((t) => ({
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
    <div className="min-h-screen flex flex-col relative bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 lg:py-32">
          <div className="container max-w-7xl px-4">
            <div className="max-w-5xl mx-auto text-center">
              <AnimatedHeroSection />
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-8 border-y border-border bg-muted/30">
          <div className="container max-w-7xl px-4">
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{totalTricks}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">KI-Tricks</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{totalCategories}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Kategorien</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{totalTools}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Tools</div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-16 bg-background">
          <div className="container max-w-7xl px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="space-y-4">
                  <h2 className="text-heading-2">Was ist KI Tricks?</h2>
                  <div className="space-y-3 text-body-large">
                    <p className="text-muted-foreground leading-relaxed">
                      KI Tricks ist eine kuratierte Sammlung erprobter KI-Workflows, Automationen und Prompts.
                      Jedes Beispiel ist knapp erklärt, nachvollziehbar und nach Kategorien sowie Tools filterbar.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Ideal für Consultants, Marketer, Maker und Teams, die schnelle Ergebnisse brauchen –
                      ohne in generischen Tipps zu versinken.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <BaseCard hover={false} variant="compact">
                    <div className="flex flex-col gap-3">
                      <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 w-fit">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-base text-foreground">Schritt-für-Schritt</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">Kompakte Anleitungen mit klaren Schritten und Beispielen.</p>
                      </div>
                    </div>
                  </BaseCard>
                  <BaseCard hover={false} variant="compact">
                    <div className="flex flex-col gap-3">
                      <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 w-fit">
                        <Filter className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-base text-foreground">Kategorisiert</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">Finde schnell passende Tricks nach Kategorie und Tool.</p>
                      </div>
                    </div>
                  </BaseCard>
                  <BaseCard hover={false} variant="compact">
                    <div className="flex flex-col gap-3">
                      <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 w-fit">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-base text-foreground">Praxiserprobt</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">Nur Workflows, die getestet und verständlich dokumentiert sind.</p>
                      </div>
                    </div>
                  </BaseCard>
                  <BaseCard hover={false} variant="compact">
                    <div className="flex flex-col gap-3">
                      <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 w-fit">
                        <Target className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-base text-foreground">Schnelle Umsetzung</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">Kurze Zeit bis zum Ergebnis, ideal für busy Professionals.</p>
                      </div>
                    </div>
                  </BaseCard>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup Section */}
        <section className="py-12 sm:py-16 bg-muted/30 border-t border-border">
          <div className="container max-w-7xl px-4">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
                Verpasse keine neuen KI-Tricks
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg">
                Werde Teil unserer Community und erhalte wöchentlich die neuesten,
                praxiserprobten KI-Workflows direkt in dein Postfach.
              </p>
            </div>

            <NewsletterSignup
              source="landing_page_main"
              className="max-w-lg mx-auto"
            />
          </div>
        </section>

        {/* Latest Tricks */}
        <section className="py-12 sm:py-16 bg-background border-t border-border">
          <div className="container max-w-7xl px-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Neueste Tricks</h2>
                <p className="text-sm sm:text-base text-muted-foreground">Frisch hinzugefügte KI-Workflows und Automationen</p>
              </div>
              <Link href="/tricks" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium inline-flex items-center gap-1 self-start sm:self-auto">
                Alle ansehen <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {recentTricks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {recentTricks.map((trick) => (
                  <TrickCard key={trick.id} trick={trick} variant="default" />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Noch keine veröffentlichten Tricks.</p>
            )}
          </div>
        </section>

        {/* Categories Preview */}
        <section id="categories" className="py-12 sm:py-16 bg-muted/50">
          <div className="container max-w-7xl px-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
              Tricks nach Kategorien
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {allCategories
                .filter(category => (tricksByCategory[category] || 0) > 0)
                .sort((a, b) => (tricksByCategory[b] || 0) - (tricksByCategory[a] || 0))
                .slice(0, 8)
                .map(category => (
                  <Link
                    key={category}
                    href={`/tricks?categories=${category}`}
                    className="block h-full group"
                  >
                    <BaseCard className="text-center h-full flex flex-col items-center justify-center py-4 sm:py-6 hover:shadow-lg transition-all" variant="compact">
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 p-2 sm:p-3 rounded-xl bg-background/50 dark:bg-background/30 group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                        {(() => {
                          const IconComponent = categoryLucideIcons[category as keyof typeof categoryLucideIcons]
                          return IconComponent ? (
                            <IconComponent className="w-full h-full text-foreground/70 dark:text-foreground/60 group-hover:text-primary dark:group-hover:text-primary group-hover:opacity-100 transition-all" />
                          ) : null
                        })()}
                      </div>
                      <h4 className="font-semibold mb-1 sm:mb-2 text-foreground text-sm sm:text-base group-hover:text-primary transition-colors">{categoryLabels[category as keyof typeof categoryLabels]}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {tricksByCategory[category] || 0} {(tricksByCategory[category] || 0) === 1 ? 'Trick' : 'Tricks'}
                      </p>
                    </BaseCard>
                  </Link>
                ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/tricks">
                <Button
                  variant="secondary"
                  size="md"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Alle Kategorien ansehen
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background via-background to-muted/30">
          <div className="container max-w-4xl px-4">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-4 py-2 rounded-full mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Häufig gefragt</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">Noch Fragen?</h2>
              <p className="text-base sm:text-lg text-muted-foreground">Alles, was du über KI Tricks wissen musst</p>
            </div>

            <FAQAccordion
              items={[
                {
                  question: 'Wie unterscheiden sich diese Tricks von ChatGPT-Tutorials auf YouTube?',
                  answer: 'Die meisten YouTube-Tutorials zeigen nur Basics oder sind veraltet. Hier findest du konkrete Workflows mit exakten Prompts, Tool-Kombinationen und Beispielen aus echten Projekten. Kein Fluff – nur das, was wirklich funktioniert.',
                  iconColor: 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary'
                },
                {
                  question: 'Brauche ich Programmierkenntnisse?',
                  answer: 'Nein. Die meisten Tricks sind ohne Code umsetzbar. Bei technischen Workflows zeigen wir dir den kompletten Weg – mit Copy-Paste-Code und klaren Anweisungen. Wenn du bereits entwickelst, findest du auch Advanced-Tricks für Automationen.',
                  iconColor: 'bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                },
                {
                  question: 'Funktionieren die Tricks nur mit ChatGPT?',
                  answer: 'Nein – die meisten Tricks funktionieren mit ChatGPT, Claude, Gemini und anderen LLMs. Wir taggen jeden Trick mit kompatiblen Tools, sodass du sofort siehst, was du brauchst.',
                  iconColor: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400'
                },
                {
                  question: 'Wie aktuell sind die Tricks?',
                  answer: 'Wir aktualisieren regelmäßig und kennzeichnen veraltete Inhalte. Neue Tricks werden wöchentlich hinzugefügt. Wenn ein Trick nicht mehr funktioniert, kannst du das melden und wir fixen es.',
                  iconColor: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                },
                {
                  question: 'Kann ich eigene Workflows teilen?',
                  answer: (
                    <>
                      Ja! Über <Link href="/tricks/einreichen" className="text-primary dark:text-primary hover:text-primary/80 dark:hover:text-primary/80 underline font-semibold transition-colors">Trick einreichen</Link> kannst du deinen Workflow vorschlagen. Wenn er nützlich ist und gut dokumentiert, veröffentlichen wir ihn – mit deinem Namen als Credit.
                    </>
                  ),
                  iconColor: 'bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400'
                }
              ]}
            />

            <div className="mt-8 sm:mt-12 text-center">
              <p className="text-muted-foreground dark:text-muted-foreground mb-6 text-base sm:text-lg font-medium">Weitere Fragen?</p>
              <Link href="/kontakt">
                <Button variant="secondary" size="lg" className="shadow-lg hover:shadow-xl transition-all text-base font-semibold px-8 py-6">
                  Kontaktiere uns
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Enhanced Schema Markup for SEO */}
        <SchemaMarkup
          id="organization-schema"
          schema={generateOrganizationSchema()}
        />
        <SchemaMarkup
          id="website-schema"
          schema={generateWebsiteSchema()}
        />
        <SchemaMarkup
          id="faq-schema"
          schema={generateFAQSchema()}
        />
      </main>

      <Footer />

      {/* Floating Newsletter Widget */}
      <FloatingNewsletterWidget
        delayMs={45000}
        showAfterScrollPercent={60}
        source="landing_page_exit_intent"
      />
    </div>
  )
}
