import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// File paths
const PENDING_TRICKS_PATH = path.join(process.cwd(), 'data', 'pending-tricks.json')
const APPROVED_TRICKS_PATH = path.join(process.cwd(), 'data', 'approved-tricks.json')

// Read JSON file
async function readJsonFile(filePath: string): Promise<any[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    return []
  }
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

    // Read data
    const pendingTricks = await readJsonFile(PENDING_TRICKS_PATH)
    const approvedTricks = await readJsonFile(APPROVED_TRICKS_PATH)

    // Filter by date range
    const filteredPending = pendingTricks.filter(trick => {
      const createdAt = new Date(trick.createdAt)
      return createdAt >= startDate && createdAt <= endDate
    })

    const filteredApproved = approvedTricks.filter(trick => {
      const createdAt = new Date(trick.createdAt)
      return createdAt >= startDate && createdAt <= endDate
    })

    // Calculate totals
    const totals = {
      pending: filteredPending.filter(t => t.status !== 'rejected').length,
      approved: filteredApproved.length,
      rejected: filteredPending.filter(t => t.status === 'rejected').length,
      published: 0 // TODO: Fetch from Supabase
    }

    // Category distribution
    const allTricks = [...filteredPending, ...filteredApproved]
    const categoryCount: Record<string, number> = {}
    
    allTricks.forEach(trick => {
      categoryCount[trick.category] = (categoryCount[trick.category] || 0) + 1
    })

    // Most active categories (sorted by count)
    const mostActiveCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / allTricks.length) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Recent submissions by date
    const dateRange = generateDateSeries(startDate, endDate)
    const submissionsByDate: Record<string, number> = {}
    
    // Initialize all dates with 0
    dateRange.forEach(date => {
      submissionsByDate[date] = 0
    })
    
    // Count submissions by date
    allTricks.forEach(trick => {
      const date = new Date(trick.createdAt).toISOString().split('T')[0]
      if (submissionsByDate.hasOwnProperty(date)) {
        submissionsByDate[date]++
      }
    })

    const recentSubmissions = dateRange
      .slice(-7) // Last 7 days
      .map(date => ({
        date,
        count: submissionsByDate[date] || 0
      }))

    // Calculate average processing time (mock calculation)
    const processedTricks = filteredApproved.filter(trick => 
      trick.updatedAt && trick.createdAt
    )
    
    let avgProcessingTime = 0
    if (processedTricks.length > 0) {
      const totalProcessingTime = processedTricks.reduce((total, trick) => {
        const created = new Date(trick.createdAt).getTime()
        const updated = new Date(trick.updatedAt).getTime()
        return total + (updated - created)
      }, 0)
      
      avgProcessingTime = totalProcessingTime / processedTricks.length / (1000 * 60 * 60) // Convert to hours
    }

    // Calculate approval rate
    const totalProcessed = totals.approved + totals.rejected
    const approvalRate = totalProcessed > 0 ? (totals.approved / totalProcessed) * 100 : 0

    const analytics = {
      totals,
      categories: categoryCount,
      recentSubmissions,
      avgProcessingTime,
      approvalRate,
      mostActiveCategories
    }

    return NextResponse.json(analytics)
    
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Analytics' },
      { status: 500 }
    )
  }
}