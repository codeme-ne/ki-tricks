import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Database, Json } from '@/lib/supabase/types'
import {
  detectGuideDuplicates,
  type GuideDraft
} from '@/lib/services/guide-formatter'

const unauthorizedResponse = () =>
  NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })

const badRequest = (message: string) =>
  NextResponse.json({ error: message }, { status: 400 })

type GuideRow = Database['public']['Tables']['guides']['Row']

type RiskLevel = Database['public']['Enums']['risk_level_enum']

type EvidenceLevel = Database['public']['Enums']['evidence_level_enum']

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

const requireAuth = (request: NextRequest): boolean => {
  const authHeader = request.headers.get('authorization')
  return Boolean(authHeader && authHeader.startsWith('Basic '))
}

async function ensureUniqueGuideSlug(
  supabase: ReturnType<typeof createAdminClient>,
  baseSlug: string,
  ignoreId?: string
): Promise<string> {
  const sanitizedBase = baseSlug && baseSlug.length > 0 ? baseSlug : 'guide'
  let candidate = sanitizedBase
  let suffix = 2

  while (true) {
    let query = supabase
      .from('guides')
      .select('id', { head: true, count: 'exact' })
      .eq('slug', candidate)

    if (ignoreId) {
      query = query.neq('id', ignoreId)
    }

    const { count, error } = await query
    if (error) {
      throw error
    }

    if (!count || count === 0) {
      return candidate
    }

    candidate = `${sanitizedBase}-${suffix}`
    suffix += 1
  }
}

function mapGuideForDuplicateCheck(guide: GuideRow): GuideDraft {
  return {
    title: guide.title,
    summary: typeof guide.summary === 'string' ? guide.summary : '',
    steps: Array.isArray(guide.steps) ? guide.steps : [],
    examples: Array.isArray(guide.examples) ? guide.examples : [],
    role: guide.role ?? null,
    industries: Array.isArray(guide.industries) ? guide.industries : [],
    tools: Array.isArray(guide.tools) ? guide.tools : [],
    evidence_level: guide.evidence_level ?? null,
    risk_level: guide.risk_level ?? 'medium',
    sources: Array.isArray(guide.sources) ? (guide.sources as Json[]) : [],
    quality: {
      score: guide.quality_score ?? 0,
      category: 'fair',
      suggestions: []
    }
  }
}

export async function GET(request: NextRequest) {
  if (!requireAuth(request)) {
    return unauthorizedResponse()
  }

  const supabase = createAdminClient()

  const { data: pendingGuides, error: pendingError } = await supabase
    .from('guides')
    .select(
      'id, title, summary, steps, examples, status, slug, quality_score, role, industries, tools, evidence_level, risk_level, hero_image_url, sources, created_at, updated_at, published_at'
    )
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (pendingError) {
    console.error('Failed to load pending guides:', pendingError)
    return NextResponse.json({ error: 'Guides konnten nicht geladen werden.' }, { status: 500 })
  }

  const { data: comparisonGuides, error: comparisonError } = await supabase
    .from('guides')
    .select('id, title, summary, steps, examples, status, slug')
    .neq('status', 'archived')

  if (comparisonError) {
    console.error('Failed to load guides for duplicate detection:', comparisonError)
    return NextResponse.json({ error: 'Duplicate-Check nicht möglich.' }, { status: 500 })
  }

  const guidesWithDuplicates = (pendingGuides ?? []).map(guide => {
    const draft = mapGuideForDuplicateCheck(guide as GuideRow)
    const duplicates = detectGuideDuplicates(
      draft,
      (comparisonGuides ?? []).filter(existing => existing.id !== guide.id) as GuideRow[]
    )

    return {
      ...guide,
      duplicates: duplicates.matches,
      highestDuplicateSimilarity: duplicates.highestSimilarity
    }
  })

  return NextResponse.json({ guides: guidesWithDuplicates })
}

export async function PUT(request: NextRequest) {
  if (!requireAuth(request)) {
    return unauthorizedResponse()
  }

  let payload: {
    id?: string
    action?: 'publish'
    slug?: string
    role?: string
    industries?: unknown
    tools?: unknown
    risk?: string
    evidence?: string
  }

  try {
    payload = await request.json()
  } catch (error) {
    return badRequest('Ungültige JSON-Daten')
  }

  if (!payload.id || payload.action !== 'publish') {
    return badRequest('Ungültige Parameter')
  }

  const supabase = createAdminClient()

  const { data: guide, error: fetchError } = await supabase
    .from('guides')
    .select('*')
    .eq('id', payload.id)
    .maybeSingle()

  if (fetchError || !guide) {
    return NextResponse.json({ error: 'Guide nicht gefunden' }, { status: 404 })
  }

  const role = payload.role ? parseEnum(payload.role, ROLE_OPTIONS) : guide.role
  const evidence = payload.evidence ? parseEnum(payload.evidence, EVIDENCE_OPTIONS) : guide.evidence_level
  const risk = payload.risk ? parseEnum(payload.risk, RISK_OPTIONS) : guide.risk_level
  const industries = normalizeList(payload.industries)
  const tools = normalizeList(payload.tools)

  const sourceSlug = payload.slug && payload.slug.length > 0 ? payload.slug : guide.slug
  const baseSlug = sourceSlug?.length ? generateSlug(sourceSlug) : generateSlug(guide.title)
  let uniqueSlug = guide.slug

  if (baseSlug !== guide.slug) {
    try {
      uniqueSlug = await ensureUniqueGuideSlug(supabase, baseSlug, guide.id)
    } catch (error) {
      console.error('Slug uniqueness check failed:', error)
      return NextResponse.json({ error: 'Slug konnte nicht validiert werden.' }, { status: 500 })
    }
  }

  const { error: updateError } = await supabase
    .from('guides')
    .update({
      slug: uniqueSlug,
      role,
      industries: industries.length ? industries : guide.industries,
      tools: tools.length ? tools : guide.tools,
      evidence_level: evidence,
      risk_level: risk ?? 'medium',
      status: 'published',
      published_at: new Date().toISOString()
    })
    .eq('id', guide.id)

  if (updateError) {
    console.error('Failed to publish guide:', updateError)
    return NextResponse.json({ error: 'Guide konnte nicht veröffentlicht werden.' }, { status: 500 })
  }

  return NextResponse.json({ success: true, slug: uniqueSlug })
}
