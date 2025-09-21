import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/types'

type TrickSubmissionRow = Database['public']['Tables']['trick_submissions']['Row']
type PublishedTrickRow = Database['public']['Tables']['ki_tricks']['Row']
type SupabaseAdminClient = ReturnType<typeof createAdminClient>

const mapSubmission = (row: TrickSubmissionRow) => {
  const data = (row.trick_data as Record<string, any>) || {}
  return {
    ...data,
    id: row.id,
    status: row.status,
    category: data.category,
    created_at: data.created_at ?? row.created_at,
    updated_at: data.updated_at ?? row.reviewed_at ?? row.created_at,
    reviewed_at: row.reviewed_at,
    quality_score: data.quality_score ?? row.quality_score ?? null
  }
}

const isWithinRange = (date: string | null | undefined, start: Date, end: Date) => {
  if (!date) return false
  const value = new Date(date)
  return value >= start && value <= end
}

// Calculate date range
function getDateRange(range: string): Date {
  const now = new Date()
  switch (range) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
}

// Generate date series
function generateDateSeries(startDate: Date, endDate: Date): string[] {
  const dates: string[] = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  
  return dates
}

// GET: Analytics data
export async function GET(request: NextRequest) {
  try {
    // Check admin auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const range = url.searchParams.get('range') || '30d'
    const startDate = getDateRange(range)
    const endDate = new Date()

    const supabase = createAdminClient()
    const startIso = startDate.toISOString()
    const endIso = endDate.toISOString()

    const submissionsFilter = [
      `and(created_at.gte.${startIso},created_at.lte.${endIso})`,
      `and(reviewed_at.gte.${startIso},reviewed_at.lte.${endIso})`
    ].join(',')

    const [{ data: submissionRows, error: submissionsError }, { data: publishedRows, error: publishedError }] = await Promise.all([
      supabase
        .from('trick_submissions')
        .select('id, trick_data, status, created_at, reviewed_at, quality_score')
        .or(submissionsFilter),
      supabase
        .from('ki_tricks')
        .select('id, category, status, published_at, created_at')
        .eq('status', 'published')
        .gte('published_at', startIso)
        .lte('published_at', endIso)
    ])

    if (submissionsError) {
      throw submissionsError
    }

    if (publishedError) {
      throw publishedError
    }

    const submissions = (submissionRows ?? []).map(row => mapSubmission(row as TrickSubmissionRow))
    const published = (publishedRows ?? []) as PublishedTrickRow[]

    const totals = {
      pending: submissions.filter(trick => trick.status === 'pending' && isWithinRange(trick.created_at, startDate, endDate)).length,
      approved: submissions.filter(trick => trick.status === 'approved' && isWithinRange(trick.reviewed_at ?? trick.updated_at, startDate, endDate)).length,
      rejected: submissions.filter(trick => trick.status === 'rejected' && isWithinRange(trick.reviewed_at ?? trick.updated_at, startDate, endDate)).length,
      published: published.filter(trick => isWithinRange(trick.published_at ?? trick.created_at, startDate, endDate)).length
    }

    const categoryCount: Record<string, number> = {}

    submissions.forEach(trick => {
      if (trick.category && isWithinRange(trick.created_at, startDate, endDate)) {
        categoryCount[trick.category] = (categoryCount[trick.category] || 0) + 1
      }
    })

    published.forEach(trick => {
      if (trick.category && isWithinRange(trick.published_at ?? trick.created_at, startDate, endDate)) {
        categoryCount[trick.category] = (categoryCount[trick.category] || 0) + 1
      }
    })

    const totalCategoryEntries = Object.values(categoryCount).reduce((sum, count) => sum + count, 0)

    const mostActiveCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({
        category,
        count,
        percentage: totalCategoryEntries > 0 ? Math.round((count / totalCategoryEntries) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const dateRange = generateDateSeries(startDate, endDate)
    const submissionsByDate: Record<string, number> = {}

    dateRange.forEach(date => {
      submissionsByDate[date] = 0
    })

    submissions.forEach(trick => {
      if (!isWithinRange(trick.created_at, startDate, endDate)) return
      const dayKey = new Date(trick.created_at).toISOString().split('T')[0]
      if (submissionsByDate[dayKey] !== undefined) {
        submissionsByDate[dayKey] += 1
      }
    })

    const recentSubmissions = dateRange
      .slice(-7)
      .map(date => ({
        date,
        count: submissionsByDate[date] || 0
      }))

    const processedTricks = submissions.filter(trick =>
      (trick.status === 'approved' || trick.status === 'rejected') &&
      trick.created_at &&
      trick.reviewed_at
    )

    let avgProcessingTime = 0
    if (processedTricks.length > 0) {
      const totalProcessingTime = processedTricks.reduce((total, trick) => {
        const created = new Date(trick.created_at!).getTime()
        const reviewed = new Date(trick.reviewed_at!).getTime()
        return total + (reviewed - created)
      }, 0)

      avgProcessingTime = totalProcessingTime / processedTricks.length / (1000 * 60 * 60)
    }

    const totalProcessed = totals.approved + totals.rejected
    const approvalRate = totalProcessed > 0 ? (totals.approved / totalProcessed) * 100 : 0

    return NextResponse.json({
      totals,
      categories: categoryCount,
      recentSubmissions,
      avgProcessingTime,
      approvalRate,
      mostActiveCategories
    })
    
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Analytics' },
      { status: 500 }
    )
  }
}
