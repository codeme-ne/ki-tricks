import { NextRequest, NextResponse } from 'next/server'
import { Category, KITrick } from '@/lib/types/types'
import { checkForDuplicates, checkPendingDuplicates } from '@/lib/utils/duplicate-detection'
import { calculateQualityScore } from '@/lib/utils/quality-scoring'
import { createAdminClient } from '@/lib/supabase/admin'
import { TricksService } from '@/lib/services/tricks.service'
import type { Database } from '@/lib/supabase/types'

const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const generateSlug = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[äöüß]/g, match => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }[match] || match))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const getClientIp = (request: NextRequest): string =>
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now()
  const entry = rateLimitStore.get(ip)

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false
  }

  entry.count += 1
  return true
}

const normalizeStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map(item => (typeof item === 'string' ? item.trim() : String(item)))
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

type TrickSubmissionRow = Database['public']['Tables']['trick_submissions']['Row']

type SupabaseAdminClient = ReturnType<typeof createAdminClient>

const mapSubmissionRow = (row: TrickSubmissionRow): Partial<KITrick> & { id: string } => {
  const data = (row.trick_data as Record<string, any>) || {}

  return {
    id: row.id,
    title: data.title,
    description: data.description,
    category: data.category,
    tools: normalizeStringArray(data.tools ?? []),
    steps: normalizeStringArray(data.steps ?? []),
    examples: normalizeStringArray(data.examples ?? []),
    slug: data.slug,
    why_it_works: data.why_it_works,
    status: (row.status ?? data.status) as KITrick['status'],
    created_at: data.created_at ?? row.created_at,
    updated_at: data.updated_at ?? row.reviewed_at ?? row.created_at,
    published_at: data.published_at ?? null,
    quality_score: data.qualityScore ?? row.quality_score ?? null
  }
}

const fetchPendingSubmissions = async (admin: SupabaseAdminClient) => {
  const { data, error } = await admin
    .from('trick_submissions')
    .select('id, trick_data, status, created_at, reviewed_at, quality_score')
    .eq('status', 'pending')

  if (error) throw error
  const rows = (data ?? []) as unknown as TrickSubmissionRow[]
  return rows.map(mapSubmissionRow)
}

const slugExists = async (
  admin: SupabaseAdminClient,
  slug: string,
  ignoreSubmissionId?: string
): Promise<boolean> => {
  const { count: publishedCount, error: publishedError } = await admin
    .from('ki_tricks')
    .select('id', { head: true, count: 'exact' })
    .eq('slug', slug)

  if (publishedError) throw publishedError
  if ((publishedCount ?? 0) > 0) return true

  let submissionQuery = admin
    .from('trick_submissions')
    .select('id', { head: true, count: 'exact' })
    .eq('trick_data->>slug', slug)

  if (ignoreSubmissionId) {
    submissionQuery = submissionQuery.neq('id', ignoreSubmissionId)
  }

  const { count: submissionCount, error: submissionError } = await submissionQuery
  if (submissionError) throw submissionError

  return (submissionCount ?? 0) > 0
}

const ensureUniqueSlug = async (
  admin: SupabaseAdminClient,
  baseSlug: string,
  ignoreSubmissionId?: string
): Promise<string> => {
  const sanitizedBase = baseSlug && baseSlug.length > 0 ? baseSlug : 'ki-trick'
  let candidate = sanitizedBase
  let suffix = 2

  while (await slugExists(admin, candidate, ignoreSubmissionId)) {
    candidate = `${sanitizedBase}-${suffix}`
    suffix += 1
  }

  return candidate
}

// POST: Submit new trick
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Zu viele Einreichungen. Bitte versuche es später erneut.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { forceDuplicate = false } = body

    if (!body.title || body.title.length < 10) {
      return NextResponse.json(
        { error: 'Titel muss mindestens 10 Zeichen lang sein.' },
        { status: 400 }
      )
    }

    if (!body.description || body.description.length < 50) {
      return NextResponse.json(
        { error: 'Beschreibung muss mindestens 50 Zeichen lang sein.' },
        { status: 400 }
      )
    }

    if (!body.category) {
      return NextResponse.json(
        { error: 'Kategorie ist ein Pflichtfeld.' },
        { status: 400 }
      )
    }

    const admin = createAdminClient()

    const baseSlug = generateSlug(body.title)
    const uniqueSlug = await ensureUniqueSlug(admin, baseSlug)

    const newTrick: Partial<KITrick> & {
      category: Category
      tools: string[]
      steps: string[]
      examples: string[]
      status: KITrick['status']
      qualityScore?: number
      qualityCategory?: string
    } = {
      title: body.title,
      description: body.description,
      category: body.category as Category,
      tools: normalizeStringArray(body.tools),
      steps: normalizeStringArray(body.steps),
      examples: normalizeStringArray(body.examples),
      slug: uniqueSlug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      why_it_works:
        typeof body.why_it_works === 'string' && body.why_it_works.length > 0
          ? body.why_it_works
          : 'Dieser Trick nutzt bewährte KI-Prinzipien und wurde von der Community erprobt.',
      status: 'pending'
    }

    const qualityScore = calculateQualityScore(newTrick)
    newTrick.qualityScore = qualityScore.total
    newTrick.qualityCategory = qualityScore.category
    newTrick.quality_score = qualityScore.total

    const [publishedTricks, pendingSubmissions] = await Promise.all([
      TricksService.getPublishedTricks(),
      fetchPendingSubmissions(admin)
    ])

    const existingDuplicates = checkForDuplicates(newTrick, publishedTricks as KITrick[])
    const pendingDuplicates = checkPendingDuplicates(newTrick, pendingSubmissions)

    if (!forceDuplicate && (existingDuplicates.isDuplicate || pendingDuplicates.isDuplicate)) {
      const combinedSimilar = [
        ...existingDuplicates.similarTricks,
        ...pendingDuplicates.similarTricks
      ]
        .sort((a, b) => b.overallSimilarity - a.overallSimilarity)
        .slice(0, 5)

      const topMatch = combinedSimilar[0]

      return NextResponse.json(
        {
          success: false,
          error: 'duplicate_detected',
          message: topMatch?.trick?.title
            ? `Ein ähnlicher Trick wurde bereits gefunden: "${topMatch.trick.title}" (${topMatch.overallSimilarity}% Ähnlichkeit). Bitte überarbeite deinen Trick oder prüfe die bestehenden Tricks.`
            : 'Ein ähnlicher Trick wurde bereits gefunden. Bitte überarbeite deinen Vorschlag.',
          similarTricks: combinedSimilar.map(({ trick, overallSimilarity }) => ({
            title: trick.title,
            slug: trick.slug,
            category: trick.category,
            similarity: overallSimilarity
          }))
        },
        { status: 400 }
      )
    }

    const { data: inserted, error: insertError } = await admin
      .from('trick_submissions')
      .insert({
        trick_data: newTrick,
        status: 'pending',
        quality_score: qualityScore.total
      })
      .select('id')
      .single()

    if (insertError) {
      throw insertError
    }

    return NextResponse.json({
      success: true,
      message: 'Trick erfolgreich eingereicht! Er wird in Kürze geprüft.',
      id: inserted.id
    })
  } catch (error) {
    console.error('Error submitting trick:', error)
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.' },
      { status: 500 }
    )
  }
}

// GET: Get pending tricks (admin only)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      )
    }

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('trick_submissions')
      .select('id, trick_data, status, created_at, reviewed_at, quality_score')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    const formatted = (data ?? []).map(row => {
      const trick = (row.trick_data as Record<string, any>) || {}
      return {
        id: row.id,
        status: row.status,
        created_at: row.created_at,
        reviewed_at: row.reviewed_at,
        quality_score: row.quality_score,
        ...trick
      }
    })

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching tricks:', error)
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Tricks' },
      { status: 500 }
    )
  }
}

// PUT: Update trick status (approve/reject)
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      )
    }

    const { id, action } = await request.json()

    if (!id || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Ungültige Parameter' },
        { status: 400 }
      )
    }

    const admin = createAdminClient()
    const { data: submission, error: fetchError } = await admin
      .from('trick_submissions')
      .select('id, trick_data, status, quality_score, created_at, reviewed_at')
      .eq('id', id)
      .single()

    if (fetchError || !submission) {
      return NextResponse.json(
        { error: 'Trick nicht gefunden' },
        { status: 404 }
      )
    }

    const trickData = (submission.trick_data as Record<string, any>) || {}
    const now = new Date().toISOString()

    if (action === 'approve') {
      if (!trickData.title || !trickData.description || !trickData.category) {
        return NextResponse.json(
          { error: 'Unvollständige Trick-Daten. Freigabe nicht möglich.' },
          { status: 400 }
        )
      }

      const uniqueSlug = await ensureUniqueSlug(
        admin,
        typeof trickData.slug === 'string' && trickData.slug.length > 0
          ? trickData.slug
          : generateSlug(trickData.title),
        submission.id
      )

      const tools = normalizeStringArray(trickData.tools)
      const steps = normalizeStringArray(trickData.steps)
      const examples = normalizeStringArray(trickData.examples)

      const { error: insertError } = await admin
        .from('ki_tricks')
        .insert({
          title: trickData.title,
          description: trickData.description,
          category: trickData.category as Category,
          tools,
          steps: steps.length ? steps : null,
          examples: examples.length ? examples : null,
          slug: uniqueSlug,
          why_it_works:
            typeof trickData.why_it_works === 'string' && trickData.why_it_works.length > 0
              ? trickData.why_it_works
              : 'Dieser Trick wurde aus einer Community-Einreichung übernommen.',
          status: 'published',
          quality_score: trickData.qualityScore ?? submission.quality_score ?? null,
          published_at: now
        })
        .select('id')
        .single()

      if (insertError) {
        console.error('Error publishing trick:', insertError)
        return NextResponse.json(
          { error: 'Fehler beim Veröffentlichen' },
          { status: 500 }
        )
      }

      const updatedTrickData = {
        ...trickData,
        slug: uniqueSlug,
        status: 'approved',
        reviewed_at: now
      }

      const { error: updateError } = await admin
        .from('trick_submissions')
        .update({
          status: 'approved',
          reviewed_at: now,
          trick_data: updatedTrickData,
          quality_score: trickData.qualityScore ?? submission.quality_score ?? null
        })
        .eq('id', id)

      if (updateError) {
        console.error('Error updating submission status:', updateError)
      }
    } else {
      const { error: rejectError } = await admin
        .from('trick_submissions')
        .update({
          status: 'rejected',
          reviewed_at: now
        })
        .eq('id', id)

      if (rejectError) {
        console.error('Error rejecting submission:', rejectError)
        return NextResponse.json(
          { error: 'Fehler beim Ablehnen' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: action === 'approve' ? 'Trick wurde freigegeben!' : 'Trick wurde abgelehnt.',
      action
    })
  } catch (error) {
    console.error('Error updating trick:', error)
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Tricks' },
      { status: 500 }
    )
  }
}
