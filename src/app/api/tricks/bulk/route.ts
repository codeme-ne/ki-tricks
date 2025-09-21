import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/types'
import type { KITrick } from '@/lib/types/types'

type TrickSubmissionRow = Database['public']['Tables']['trick_submissions']['Row']
type SupabaseAdminClient = ReturnType<typeof createAdminClient>

const ensureStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter(item => typeof item === 'string')
  }
  return []
}

const mapSubmission = (row: TrickSubmissionRow): (Partial<KITrick> & { id: string }) => {
  const data = (row.trick_data as Record<string, any>) || {}
  return {
    id: row.id,
    title: data.title,
    description: data.description,
    category: data.category,
    tools: ensureStringArray(data.tools),
    steps: ensureStringArray(data.steps),
    examples: ensureStringArray(data.examples),
    slug: data.slug,
    why_it_works: typeof data.why_it_works === 'string' ? data.why_it_works : undefined,
    status: (row.status ?? data.status) as KITrick['status'],
    quality_score: data.quality_score ?? row.quality_score ?? null,
    created_at: data.created_at ?? row.created_at,
    updated_at: data.updated_at ?? row.created_at
  }
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[äöüß]/g, (match) => {
      const map: Record<string, string> = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }
      return map[match] || match
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function publishedSlugExists(
  supabase: SupabaseAdminClient,
  slug: string
): Promise<boolean> {
  const { count, error } = await supabase
    .from('ki_tricks')
    .select('id', { count: 'exact', head: true })
    .eq('slug', slug)

  if (error) {
    throw error
  }

  return (count ?? 0) > 0
}

async function ensurePublishedSlug(
  supabase: SupabaseAdminClient,
  baseSlug: string,
  usedSlugs: Set<string>
): Promise<string> {
  let slug = baseSlug
  let attempt = 2

  const slugInUse = async (candidate: string) =>
    usedSlugs.has(candidate) || (await publishedSlugExists(supabase, candidate))

  while (await slugInUse(slug)) {
    slug = `${baseSlug}-${attempt}`
    attempt += 1
  }

  usedSlugs.add(slug)
  return slug
}

// POST: Bulk operations (approve/reject multiple tricks)
export async function POST(request: NextRequest) {
  try {
    // Check admin auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      )
    }

    const { ids, action } = await request.json()
    
    if (!ids || !Array.isArray(ids) || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Ungültige Parameter' },
        { status: 400 }
      )
    }

    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'Keine Tricks ausgewählt' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data: submissions, error } = await supabase
      .from('trick_submissions')
      .select('id, trick_data, status, quality_score, created_at')
      .in('id', ids)

    if (error) {
      throw error
    }

    const typedSubmissions = (submissions ?? []) as unknown as TrickSubmissionRow[]

    const submissionMap = new Map<string, TrickSubmissionRow>(
      typedSubmissions.map(row => [row.id, row] as const)
    )

    const processedTricks: Array<{ id: string; title: string; action: string }> = []
    const failedTricks: string[] = []
    const usedSlugs = new Set<string>()
    const now = new Date().toISOString()

    for (const id of ids) {
      const submission = submissionMap.get(id)

      if (!submission) {
        failedTricks.push(id)
        continue
      }

      if (action === 'approve') {
        if (submission.status !== 'pending') {
          failedTricks.push(id)
          continue
        }

        const trick = mapSubmission(submission)

        if (!trick.title || !trick.description || !trick.category) {
          failedTricks.push(id)
          continue
        }

        const baseSlug = typeof trick.slug === 'string' && trick.slug.length > 0
          ? trick.slug
          : generateSlug(trick.title)

        let slug: string
        try {
          slug = await ensurePublishedSlug(supabase, baseSlug, usedSlugs)
        } catch (slugError) {
          console.error('Error ensuring slug uniqueness:', slugError)
          failedTricks.push(id)
          continue
        }

        const { error: insertError } = await supabase
          .from('ki_tricks')
          .insert({
            title: trick.title,
            description: trick.description,
            category: trick.category,
            tools: ensureStringArray(trick.tools),
            steps: ensureStringArray(trick.steps),
            examples: ensureStringArray(trick.examples),
            slug,
            why_it_works:
              typeof trick.why_it_works === 'string' && trick.why_it_works.length > 0
                ? trick.why_it_works
                : 'Dieser Trick wurde aus einer Community-Einreichung übernommen.',
            status: 'published',
            quality_score: trick.quality_score ?? submission.quality_score ?? null,
            published_at: now
          })
          .single()

        if (insertError) {
          console.error('Error inserting published trick:', insertError)
          failedTricks.push(id)
          continue
        }

        const updatedTrickData = { ...trick, slug, status: 'approved' }

        const { error: updateError } = await supabase
          .from('trick_submissions')
          .update({
            status: 'approved',
            reviewed_at: now,
            trick_data: updatedTrickData,
            quality_score: trick.quality_score ?? submission.quality_score ?? null
          })
          .eq('id', id)

        if (updateError) {
          console.error('Error updating submission status:', updateError)
          failedTricks.push(id)
          continue
        }

        processedTricks.push({
          id,
          title: trick.title,
          action
        })
      } else {
        const { error: updateError } = await supabase
          .from('trick_submissions')
          .update({
            status: 'rejected',
            reviewed_at: now
          })
          .eq('id', id)

        if (updateError) {
          console.error('Error rejecting submission:', updateError)
          failedTricks.push(id)
          continue
        }

        const trick = mapSubmission(submission)
        processedTricks.push({
          id,
          title: trick.title || 'Unbekannter Trick',
          action
        })
      }
    }

    return NextResponse.json({
      success: failedTricks.length === 0,
      message: `${processedTricks.length} Tricks wurden ${action === 'approve' ? 'freigegeben' : 'abgelehnt'}.`,
      processed: processedTricks,
      failed: failedTricks,
      stats: {
        total: ids.length,
        successful: processedTricks.length,
        failed: failedTricks.length
      }
    })
    
  } catch (error) {
    console.error('Error in bulk operation:', error)
    return NextResponse.json(
      { error: 'Fehler bei der Bulk-Operation' },
      { status: 500 }
    )
  }
}
