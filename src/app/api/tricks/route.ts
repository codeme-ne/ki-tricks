import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { KITrick, Category } from '@/lib/types/types'
import { checkPendingDuplicates } from '@/lib/utils/duplicate-detection'
import { calculateQualityScore } from '@/lib/utils/quality-scoring'

// Helper function to generate slugs
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[äöüß]/g, (match) => {
      const map: { [key: string]: string } = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }
      return map[match] || match
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Rate limiting store (in-memory for simplicity)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Check rate limit
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitStore.get(ip)
  
  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + 3600000 }) // 1 hour
    return true
  }
  
  if (limit.count >= 3) {
    return false
  }
  
  limit.count++
  return true
}

// Get client IP
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return ip
}

// File paths
const PENDING_TRICKS_PATH = path.join(process.cwd(), 'data', 'pending-tricks.json')
const APPROVED_TRICKS_PATH = path.join(process.cwd(), 'data', 'approved-tricks.json')

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Read JSON file
async function readJsonFile(filePath: string): Promise<any[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    // If file doesn't exist, return empty array
    return []
  }
}

// Write JSON file
async function writeJsonFile(filePath: string, data: any[]) {
  await ensureDataDir()
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

// POST: Submit new trick
export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const ip = getClientIp(request)
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Zu viele Einreichungen. Bitte versuche es später erneut.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { forceDuplicate = false } = body
    
    // Validation
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

    // Create new trick with status field
    const newTrick: any = {
      id: `pending-${Date.now()}`,
      title: body.title,
      description: body.description,
  category: body.category as Category,
      tools: body.tools || ['Claude'],
      steps: body.steps || [],
      examples: body.examples || [],
      slug: generateSlug(body.title),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      why_it_works: body.why_it_works || 
        'Dieser Trick nutzt bewährte KI-Prinzipien und wurde von der Community erprobt.',
      status: 'pending'
    }

    // Calculate and store quality score
    const qualityScore = calculateQualityScore(newTrick)
    newTrick.qualityScore = qualityScore.total
    newTrick.qualityCategory = qualityScore.category

    // Read existing pending tricks
    const pendingTricks = await readJsonFile(PENDING_TRICKS_PATH)
    
    // Check for duplicates in existing tricks - disabled for now since mock data removed
    const existingDuplicates = { 
      isDuplicate: false, 
      duplicates: [], 
      highestSimilarity: 0,
      similarTricks: [] as Array<{trick: any, similarity: number}>
    }
    
    // Check for duplicates in pending tricks
    const pendingDuplicates = checkPendingDuplicates(newTrick, pendingTricks)
    
    // If high similarity found and not forcing duplicate, return warning
    if (!forceDuplicate && (existingDuplicates.isDuplicate || pendingDuplicates.isDuplicate)) {
      const highestSimilarity = Math.max(
        existingDuplicates.highestSimilarity,
        pendingDuplicates.highestSimilarity
      )
      
      const similarTrick = existingDuplicates.isDuplicate 
        ? existingDuplicates.similarTricks[0]?.trick
        : pendingDuplicates.similarTricks[0]?.trick
      
      return NextResponse.json({
        success: false,
        error: 'duplicate_detected',
        message: `Ein ähnlicher Trick wurde bereits gefunden: "${similarTrick?.title}" (${highestSimilarity}% Ähnlichkeit). Bitte überarbeite deinen Trick oder prüfe die bestehenden Tricks.`,
        similarTricks: [
          ...existingDuplicates.similarTricks.slice(0, 3),
          ...pendingDuplicates.similarTricks.slice(0, 2)
        ]
      }, { status: 400 })
    }
    
    // Check for duplicate slugs
    const existingSlug = pendingTricks.find(t => t.slug === newTrick.slug)
    if (existingSlug) {
      newTrick.slug = `${newTrick.slug}-${Date.now()}`
    }
    
    // Add new trick
    pendingTricks.push(newTrick)
    
    // Save to file
    await writeJsonFile(PENDING_TRICKS_PATH, pendingTricks)
    
    return NextResponse.json({
      success: true,
      message: 'Trick erfolgreich eingereicht! Er wird in Kürze geprüft.',
      id: newTrick.id
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
    // Check admin auth (basic auth header should be present)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      )
    }

    const pendingTricks = await readJsonFile(PENDING_TRICKS_PATH)
    return NextResponse.json(pendingTricks)
    
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
    // Check admin auth
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

    // Read pending tricks
    const pendingTricks = await readJsonFile(PENDING_TRICKS_PATH)
    const trickIndex = pendingTricks.findIndex(t => t.id === id)
    
    if (trickIndex === -1) {
      return NextResponse.json(
        { error: 'Trick nicht gefunden' },
        { status: 404 }
      )
    }

    const trick = pendingTricks[trickIndex]
    
    if (action === 'approve') {
      // Move to approved tricks
      const approvedTricks = await readJsonFile(APPROVED_TRICKS_PATH)
      trick.status = 'approved'
      trick.updated_at = new Date().toISOString()
      trick.id = `approved-${Date.now()}` // New ID for approved trick
      approvedTricks.push(trick)
      await writeJsonFile(APPROVED_TRICKS_PATH, approvedTricks)
    } else {
      // Mark as rejected but keep in pending with status
      trick.status = 'rejected'
      trick.updated_at = new Date().toISOString()
    }

    // Remove from pending if approved, update if rejected
    if (action === 'approve') {
      pendingTricks.splice(trickIndex, 1)
    }
    await writeJsonFile(PENDING_TRICKS_PATH, pendingTricks)

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