import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/types'
import {
  detectGuideDuplicates,
  formatNewsItemToGuide,
  type GuideDraft,
  type GuideFormatterOptions
} from '@/lib/services/guide-formatter'

const unauthorizedResponse = () =>
  NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })

const badRequest = (message: string) =>
  NextResponse.json({ error: message }, { status: 400 })

type GuidesInsert = Database['public']['Tables']['guides']['Insert']

type NewsItemRow = Database['public']['Tables']['news_items']['Row']

type EvidenceLevel = Database['public']['Enums']['evidence_level_enum']

type RiskLevel = Database['public']['Enums']['risk_level_enum']

type CompanyRole = Database['public']['Enums']['company_role_enum']

const ROLE_OPTIONS: CompanyRole[] = [
  'general',
  'sales',
  'marketing',
  'hr',
  'finance',
  'it',
  'procurement',
  'operations',
  'customer-service',
  'legal',
  'product',
  'consulting'
]

const EVIDENCE_OPTIONS: EvidenceLevel[] = ['A', 'B', 'C']
const RISK_OPTIONS: RiskLevel[] = ['low', 'medium', 'high']

const generateSlug = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[äöüß]/g, match => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }[match] || match))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const normalizeList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map(item => (typeof item === 'string' ? item : String(item)))
      .map(item => item.trim())
      .filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
  }

  return []
}

const parseEnum = <T extends string>(value: unknown, options: T[]): T | null => {
  if (typeof value !== 'string') return null
  const normalized = value.trim().toLowerCase()
  const match = options.find(option => option.toLowerCase() === normalized)
  return match ?? null
}

const requireAuth = (request: NextRequest): string | null => {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return null
  }
  return authHeader
}

async function ensureUniqueGuideSlug(
  supabase: ReturnType<typeof createAdminClient>,
  baseSlug: string
): Promise<string> {
  const sanitizedBase = baseSlug && baseSlug.length > 0 ? baseSlug : 'guide'
  let candidate = sanitizedBase
  let suffix = 2

  const { data: existingSlug } = await supabase
    .from('guides')
    .select('id')
    .eq('slug', candidate)
    .limit(1)
    .maybeSingle()

  if (!existingSlug) return candidate

  while (true) {
    candidate = `${sanitizedBase}-${suffix}`
    suffix += 1

    const { data } = await supabase
      .from('guides')
      .select('id')
      .eq('slug', candidate)
      .limit(1)
      .maybeSingle()

    if (!data) {
      return candidate
    }
  }
}

const mapNewsItem = (row: NewsItemRow) => ({
  id: row.id,
  title: row.title,
  summary: row.summary,
  url: row.url,
  source_id: row.source_id,
  source_type: row.source_type,
  source_category: row.source_category,
  evidence_level: row.evidence_level,
  published_at: row.published_at,
  tags: row.tags,
  raw: row.raw as Record<string, unknown>,
  content_hash: row.content_hash,
  created_at: row.created_at,
  updated_at: row.updated_at
})

export async function GET(request: NextRequest) {
  const authHeader = requireAuth(request)
  if (!authHeader) {
    return unauthorizedResponse()
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('news_items')
    .select('*')
    .eq('processed', false)
    .eq('is_duplicate', false)
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load news_items queue:', error)
    return NextResponse.json({ error: 'Fehler beim Laden der Queue' }, { status: 500 })
  }

  const items = (data ?? []).map(mapNewsItem)
  return NextResponse.json({ items })
}

export async function POST(request: NextRequest) {
  const authHeader = requireAuth(request)
  if (!authHeader) {
    return unauthorizedResponse()
  }

  const supabase = createAdminClient()

  let payload: {
    newsItemId?: string
    role?: string
    industries?: unknown
    tools?: unknown
    evidence?: string
    risk?: string
  }

  try {
    payload = await request.json()
  } catch (error) {
    console.error('Invalid JSON payload for guide proposal:', error)
    return badRequest('Ungültige JSON-Daten')
  }

  if (!payload.newsItemId) {
    return badRequest('newsItemId fehlt')
  }

  const role = payload.role ? parseEnum(payload.role, ROLE_OPTIONS) : null
  const evidence = payload.evidence ? parseEnum(payload.evidence, EVIDENCE_OPTIONS) : null
  const risk = payload.risk ? parseEnum(payload.risk, RISK_OPTIONS) : null
  const industries = normalizeList(payload.industries)
  const tools = normalizeList(payload.tools)

  const { data: newsItem, error: fetchError } = await supabase
    .from('news_items')
    .select('*')
    .eq('id', payload.newsItemId)
    .maybeSingle()

  if (fetchError || !newsItem) {
    return NextResponse.json({ error: 'News-Item nicht gefunden' }, { status: 404 })
  }

  if (newsItem.is_duplicate) {
    return NextResponse.json({ error: 'Duplikate können nicht vorgeschlagen werden.' }, { status: 409 })
  }

  if (newsItem.processed) {
    return NextResponse.json({ error: 'Eintrag wurde bereits verarbeitet.' }, { status: 409 })
  }

  const baseSlug = generateSlug(newsItem.title)
  const uniqueSlug = await ensureUniqueGuideSlug(supabase, baseSlug)

  const formatterOptions: GuideFormatterOptions = {
    role,
    industries,
    tools,
    evidenceLevel: evidence ?? newsItem.evidence_level ?? null,
    riskLevel: risk ?? null
  }

  const formatted = formatNewsItemToGuide(newsItem, formatterOptions)

  const { data: existingGuides, error: existingGuidesError } = await supabase
    .from('guides')
    .select('id, title, summary, steps, examples, status, slug')

  if (existingGuidesError) {
    console.error('Failed to fetch guides for duplicate detection:', existingGuidesError)
    return NextResponse.json({ error: 'Guides konnten nicht geprüft werden.' }, { status: 500 })
  }

  const guideDraft: GuideDraft = {
    ...formatted,
    risk_level: formatted.risk_level ?? 'medium',
    sources: [
      {
        type: 'news_item',
        news_item_id: newsItem.id,
        source_id: newsItem.source_id,
        source_category: newsItem.source_category,
        title: newsItem.title,
        url: newsItem.url,
        published_at: newsItem.published_at,
        evidence_level: formatted.evidence_level ?? 'C',
        tags: newsItem.tags
      }
    ]
  }

  const duplicateAnalysis = detectGuideDuplicates(guideDraft, existingGuides ?? [])

  const insertPayload: GuidesInsert = {
    slug: uniqueSlug,
    title: guideDraft.title,
    summary: guideDraft.summary,
    steps: guideDraft.steps,
    examples: guideDraft.examples,
    role: guideDraft.role,
    industries: guideDraft.industries,
    tools: guideDraft.tools,
    evidence_level: guideDraft.evidence_level,
    risk_level: guideDraft.risk_level,
    status: 'pending',
    sources: guideDraft.sources,
    hero_image_url: null,
    quality_score: guideDraft.quality.score
  }

  const { data: inserted, error: insertError } = await supabase
    .from('guides')
    .insert(insertPayload)
    .select('id')
    .maybeSingle()

  if (insertError || !inserted) {
    console.error('Failed to create guide draft:', insertError)
    return NextResponse.json({ error: 'Guide konnte nicht angelegt werden.' }, { status: 500 })
  }

  const { error: updateError } = await supabase
    .from('news_items')
    .update({ processed: true })
    .eq('id', newsItem.id)

  if (updateError) {
    console.error('Failed to update news_item after draft creation:', updateError)
    return NextResponse.json({ error: 'Guide erstellt, aber News-Item konnte nicht aktualisiert werden.' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    guideId: inserted.id,
    quality: guideDraft.quality,
    duplicates: duplicateAnalysis.matches,
    highestDuplicateSimilarity: duplicateAnalysis.highestSimilarity
  })
}
