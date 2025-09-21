/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageContainer } from '@/components/layout'
import { createPublicClient } from '@/lib/supabase/public'
import type { Database } from '@/lib/supabase/types'
import SchemaMarkup from '@/components/SEO/SchemaMarkup'
import { generateGuideBreadcrumbSchema, generateGuideHowToSchema } from '@/lib/utils/schema-markup'
import { Badge, Button } from '@/components/atoms'
import Link from 'next/link'
import { Calendar, ShieldAlert, ShieldCheck } from 'lucide-react'

export const revalidate = 900

interface PageProps {
  params: Promise<{ slug: string }>
}

type GuideRow = Database['public']['Tables']['guides']['Row']

type GuideDetail = GuideRow & {
  sources: Array<Record<string, unknown>>
}

const formatDate = (value: string | null) => {
  if (!value) return null
  return new Date(value).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const extractSource = (guide: GuideDetail) => {
  const entry = Array.isArray(guide.sources)
    ? (guide.sources.find(source => source && source['type'] === 'news_item') as
        | Record<string, unknown>
        | undefined)
    : undefined
  return entry && typeof entry.url === 'string' ? entry : null
}

async function fetchGuideSlugs(): Promise<string[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('guides')
    .select('slug')
    .eq('status', 'published')

  return (data ?? []).map(item => item.slug)
}

async function fetchGuideBySlug(slug: string): Promise<GuideDetail | null> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) {
    console.error('Guide konnte nicht geladen werden:', error)
    return null
  }

  if (!data) return null

  return {
    ...data,
    steps: Array.isArray(data.steps) ? data.steps : [],
    examples: Array.isArray(data.examples) ? data.examples : [],
    tools: Array.isArray(data.tools) ? data.tools : [],
    industries: Array.isArray(data.industries) ? data.industries : [],
    sources: Array.isArray(data.sources) ? (data.sources as Array<Record<string, unknown>>) : []
  }
}

export async function generateStaticParams() {
  const slugs = await fetchGuideSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = await fetchGuideBySlug(slug)

  if (!guide) {
    return {
      title: 'Guide nicht gefunden – KI-Tricks'
    }
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ki-tricks.com').replace(/\/$/, '')
  const canonical = `${siteUrl}/learn/${guide.slug}`
  const description = guide.summary ?? guide.title

  return {
    title: `${guide.title} – KI-Tricks Guide`,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title: guide.title,
      description,
      type: 'article',
      url: canonical,
      images: guide.hero_image_url ? [guide.hero_image_url] : undefined,
      tags: [...guide.tools, ...(guide.industries ?? [])]
    }
  }
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params
  const guide = await fetchGuideBySlug(slug)

  if (!guide) {
    notFound()
  }

  const publishedAt = formatDate(guide.published_at)
  const sourceEntry = extractSource(guide)

  const schema = generateGuideHowToSchema({
    id: guide.id,
    slug: guide.slug,
    title: guide.title,
    summary: guide.summary,
    steps: Array.isArray(guide.steps) ? guide.steps : [],
    examples: Array.isArray(guide.examples) ? guide.examples : [],
    tools: Array.isArray(guide.tools) ? guide.tools : [],
    industries: Array.isArray(guide.industries) ? guide.industries : [],
    hero_image_url: guide.hero_image_url,
    evidence_level: guide.evidence_level,
    risk_level: guide.risk_level,
    published_at: guide.published_at,
    updated_at: guide.updated_at
  })

  const breadcrumbSchema = generateGuideBreadcrumbSchema(guide.slug, guide.title)

  return (
    <div className="min-h-screen bg-background">
      <PageContainer className="max-w-4xl">
        <article className="space-y-10">
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
              {publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {publishedAt}
                </span>
              )}
              <span>Evidenz: {guide.evidence_level ?? 'n/a'}</span>
              <span>Risiko: {guide.risk_level ?? 'n/a'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-50">{guide.title}</h1>

            {guide.summary && (
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
                {guide.summary}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {(guide.industries ?? []).map(industry => (
                <Badge key={industry} variant="neutral" className="bg-white/10 text-neutral-200">
                  {industry}
                </Badge>
              ))}
              {(guide.tools ?? []).map(tool => (
                <Badge key={tool} variant="neutral" className="bg-primary-500/10 text-primary-200">
                  {tool}
                </Badge>
              ))}
            </div>

            {guide.hero_image_url && (
              <div className="overflow-hidden rounded-xl border border-border/60">
                <img src={guide.hero_image_url} alt={guide.title} className="w-full object-cover" />
              </div>
            )}
          </header>

          <section className="space-y-4" id="schritt-fuer-schritt">
            <h2 className="text-2xl font-semibold text-neutral-100">Schritt-für-Schritt</h2>
            <ol className="space-y-3 text-neutral-300 list-decimal list-inside">
              {(guide.steps ?? []).map((step, index) => (
                <li key={index} id={`schritt-${index + 1}`} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </section>

          {guide.examples && guide.examples.length > 0 && (
            <section className="space-y-4" id="beispiele">
              <h2 className="text-2xl font-semibold text-neutral-100">Praxisbeispiele</h2>
              <ul className="space-y-3 text-neutral-300 list-disc list-inside">
                {guide.examples.map((example, index) => (
                  <li key={index} className="leading-relaxed">
                    {example}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {sourceEntry && (
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-neutral-100">Quelle</h2>
              <p className="text-sm text-neutral-400">
                {String(sourceEntry.title) || 'Original-Link'}
              </p>
              <Button variant="outline" asChild>
                <Link href={String(sourceEntry.url)} target="_blank" rel="noreferrer">
                  Zur Quelle
                </Link>
              </Button>
            </section>
          )}
        </article>
      </PageContainer>

      <SchemaMarkup schema={schema} id="guide-howto" />
      <SchemaMarkup schema={breadcrumbSchema} id="guide-breadcrumb" />
    </div>
  )
}
