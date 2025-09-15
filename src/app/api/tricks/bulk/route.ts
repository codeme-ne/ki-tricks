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

// Write JSON file
async function writeJsonFile(filePath: string, data: any[]) {
  const dataDir = path.dirname(filePath)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
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

    // Read pending tricks
    const pendingTricks = await readJsonFile(PENDING_TRICKS_PATH)
    const approvedTricks = await readJsonFile(APPROVED_TRICKS_PATH)
    
    const processedTricks: any[] = []
    const failedTricks: string[] = []
    
    // Process each trick
    for (const id of ids) {
      const trickIndex = pendingTricks.findIndex((t: any) => t.id === id)
      
      if (trickIndex === -1) {
        failedTricks.push(id)
        continue
      }

      const trick = pendingTricks[trickIndex]
      
      if (action === 'approve') {
        // Move to approved tricks
        trick.status = 'approved'
        trick.updated_at = new Date().toISOString()
        trick.id = `approved-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        approvedTricks.push(trick)
        
        // Remove from pending
        pendingTricks.splice(trickIndex, 1)
      } else if (action === 'reject') {
        // Mark as rejected but keep in pending
        trick.status = 'rejected'
        trick.updated_at = new Date().toISOString()
      }
      
      processedTricks.push({
        id: trick.id,
        title: trick.title,
        action
      })
    }

    // Save updated files
    await writeJsonFile(PENDING_TRICKS_PATH, pendingTricks)
    if (action === 'approve') {
      await writeJsonFile(APPROVED_TRICKS_PATH, approvedTricks)
    }

    return NextResponse.json({
      success: true,
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