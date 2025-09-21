import { NextRequest, NextResponse } from 'next/server'
import { Category, KITrick } from '@/lib/types/types'
import { checkForDuplicates, checkPendingDuplicates } from '@/lib/utils/duplicate-detection'
import { calculateQualityScore } from '@/lib/utils/quality-scoring'
import { createAdminClient } from '@/lib/supabase/admin'
import { TricksService } from '@/lib/services/tricks.service'
import type { Database } from '@/lib/supabase/types'

type TrickSubmissionRow = Database['public']['Tables']['trick_submissions']['Row']

const generateSlug = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[äöüß]/g, match => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }[match] || match))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const normalizeStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(v => String(v)).filter(Boolean)
  }
  if (typeof value === 'string') {
    return value.split(',').map(s => s.trim()).filter(Boolean)
  }
  return []
}

async function fetchPendingSubmissions() {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('trick_submissions')
    .select('id, trick_data, status, created_at, reviewed_at, quality_score')
    .eq('status', 'pending')

  if (error) throw error

  // Map to KITrick-like objects for duplicate checks
  const rows = (data ?? []) as unknown as TrickSubmissionRow[]
  return rows.map(row => {
    const t = (row.trick_data as any) || {}
    return {
      id: row.id,
      title: t.title,
      description: t.description,
      category: t.category,
      tools: normalizeStringArray(t.tools),
      steps: normalizeStringArray(t.steps),
      examples: normalizeStringArray(t.examples),
      slug: t.slug,
      why_it_works: t.why_it_works,
      status: (row.status ?? t.status) as KITrick['status'],
      created_at: t.created_at ?? row.created_at,
      updated_at: t.updated_at ?? row.reviewed_at ?? row.created_at,
      published_at: t.published_at ?? null,
      quality_score: t.qualityScore ?? row.quality_score ?? null,
      view_count: 0
    } as KITrick
  })
}

async function slugExists(slug: string): Promise<boolean> {
  const admin = createAdminClient()
  const { count: publishedCount, error: pubErr } = await admin
    .from('ki_tricks')
    .select('id', { head: true, count: 'exact' })
    .eq('slug', slug)
  if (pubErr) throw pubErr
  if ((publishedCount ?? 0) > 0) return true

  const { count: subCount, error: subErr } = await admin
    .from('trick_submissions')
    .select('id', { head: true, count: 'exact' })
    .eq('trick_data->>slug', slug)
  if (subErr) throw subErr
  return (subCount ?? 0) > 0
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  const base = baseSlug && baseSlug.length > 0 ? baseSlug : 'ki-trick'
  let candidate = base
  let n = 2
  while (await slugExists(candidate)) {
    candidate = `${base}-${n}`
    n += 1
  }
  return candidate
}

// Compatibility shim for legacy client: expects nested { trickData, submitterInfo }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const trickData = body?.trickData || {}
    const forceDuplicate = Boolean(trickData?.forceDuplicate)

    const title = String(trickData.title || '').trim()
    const description = String(trickData.description || '').trim()
    const category = trickData.category as Category | undefined

    if (!title || title.length < 10) {
      return NextResponse.json({ error: 'Titel muss mindestens 10 Zeichen lang sein.' }, { status: 400 })
    }
    if (!description || description.length < 50) {
      return NextResponse.json({ error: 'Beschreibung muss mindestens 50 Zeichen lang sein.' }, { status: 400 })
    }
    if (!category) {
      return NextResponse.json({ error: 'Kategorie ist ein Pflichtfeld.' }, { status: 400 })
    }

    const baseSlug = generateSlug(title)
    const uniqueSlug = await ensureUniqueSlug(trickData.slug || baseSlug)

    const newTrick: Partial<KITrick> & { category: Category } = {
      title,
      description,
      category,
      tools: normalizeStringArray(trickData.tools) || ['Claude'],
      steps: normalizeStringArray(trickData.steps),
      examples: normalizeStringArray(trickData.examples),
      slug: uniqueSlug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      why_it_works: typeof trickData.why_it_works === 'string' ? trickData.why_it_works : 'Dieser Trick nutzt bewährte KI-Prinzipien und wurde von der Community erprobt.',
      status: 'pending'
    }

    const qualityScore = calculateQualityScore(newTrick)

    // Duplicate checks: against published and pending submissions
    const [publishedTricks, pendingSubmissions] = await Promise.all([
      TricksService.getPublishedTricks(),
      fetchPendingSubmissions()
    ])

    const existingDuplicates = checkForDuplicates(newTrick, publishedTricks as KITrick[])
    const pendingDuplicates = checkPendingDuplicates(newTrick, pendingSubmissions)

    if (!forceDuplicate && (existingDuplicates.isDuplicate || pendingDuplicates.isDuplicate)) {
      const combined = [...existingDuplicates.similarTricks, ...pendingDuplicates.similarTricks]
        .sort((a, b) => b.overallSimilarity - a.overallSimilarity)
        .slice(0, 5)

      const top = combined[0]

      return NextResponse.json({
        success: false,
        error: 'duplicate_detected',
        message: top?.trick?.title
          ? `Ein ähnlicher Trick wurde bereits gefunden: "${top.trick.title}" (${top.overallSimilarity}% Ähnlichkeit). Bitte überarbeite deinen Trick oder prüfe die bestehenden Tricks.`
          : 'Ein ähnlicher Trick wurde bereits gefunden. Bitte überarbeite deinen Vorschlag.',
        similarTricks: combined.map(({ trick, overallSimilarity }) => ({ trick, overallSimilarity }))
      }, { status: 400 })
    }

    // Persist submission in Supabase
    const admin = createAdminClient()
    const { data: inserted, error: insertErr } = await admin
      .from('trick_submissions')
      .insert({
        trick_data: newTrick,
        status: 'pending',
        quality_score: qualityScore.total
      })
      .select('id')
      .single()

    if (insertErr) {
      console.error('Error saving submission:', insertErr)
      return NextResponse.json({ error: 'Fehler beim Speichern der Einreichung.' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Trick erfolgreich eingereicht! Er wird in Kürze geprüft.',
      id: inserted?.id
    })
  } catch (error) {
    console.error('Submit shim error:', error)
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.' },
      { status: 500 }
    )
  }
}
