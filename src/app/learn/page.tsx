/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageContainer } from '@/components/layout'
import { createPublicClient } from '@/lib/supabase/public'
import type { Database } from '@/lib/supabase/types'
import { Badge } from '@/components/atoms'

export const revalidate = 900

export const metadata: Metadata = {
  title: 'Guides – KI-Tricks Plattform',
  description: 'Publizierte How-To-Guides mit klaren Schritten, Rollenbezug und Evidenzlevel für dein Team.'
}

type GuideRow = Database['public']['Tables']['guides']['Row']

type GuideListItem = Pick<
  GuideRow,
  'id' | 'title' | 'summary' | 'slug' | 'industries' | 'tools' | 'evidence_level' | 'risk_level' | 'hero_image_url' | 'published_at'
>

async function fetchGuides(): Promise<GuideListItem[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('guides')
    .select('id, title, summary, slug, industries, tools, evidence_level, risk_level, hero_image_url, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Fehler beim Laden der Guides:', error)
    return []
  }

  return (data ?? []).map(item => ({
    ...item,
    industries: Array.isArray(item.industries) ? item.industries : [],
    tools: Array.isArray(item.tools) ? item.tools : []
  }))
}

export default async function LearnPage() {
  const guides = await fetchGuides()

  return (
    <PageContainer className="pb-20">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-50 mb-4">Guides & How-Tos</h1>
          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto">
            Kuratierte Anleitungen mit klaren Schritten, Praxisbeispielen und Einschätzung zu Risiko & Evidenz.
          </p>
        </header>

        {guides.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center text-neutral-400">
            Noch keine Guides veröffentlicht.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {guides.map(guide => (
              <Link
                key={guide.id}
                href={`/learn/${guide.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary-500/60 hover:bg-white/5"
              >
                {guide.hero_image_url ? (
                  <div className="aspect-[16/9] overflow-hidden border-b border-border/60">
                    <img
                      src={guide.hero_image_url}
                      alt={guide.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] flex items-center justify-center border-b border-border/60 bg-black/20 text-neutral-500">
                    Kein Hero-Bild vorhanden
                  </div>
                )}

                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-100 group-hover:text-primary-200 transition">
                      {guide.title}
                    </h2>
                    <p className="mt-2 text-sm text-neutral-400 line-clamp-3">
                      {guide.summary ?? 'Keine Zusammenfassung vorhanden.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
                    {guide.industries.slice(0, 2).map(industry => (
                      <Badge key={industry} variant="neutral" className="bg-white/10 text-neutral-200">
                        {industry}
                      </Badge>
                    ))}
                    {guide.tools.slice(0, 2).map(tool => (
                      <Badge key={tool} variant="neutral" className="bg-primary-500/10 text-primary-200">
                        {tool}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>Evidenz: {guide.evidence_level ?? 'n/a'}</span>
                    <span>Risiko: {guide.risk_level ?? 'n/a'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
