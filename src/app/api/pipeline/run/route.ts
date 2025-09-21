import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Verify that the request is from Vercel Cron
async function verifyCronSecret(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    console.warn('CRON_SECRET not configured')
    return false
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    // Also check for Vercel's cron header
    const vercelCronHeader = request.headers.get('x-vercel-cron')
    if (!vercelCronHeader) {
      return false
    }
  }

  return true
}

export async function GET(request: NextRequest) {
  try {
    // Verify the request is authorized
    const isAuthorized = await verifyCronSecret(request)
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Starting pipeline run...')
    const startTime = Date.now()
    const results = {
      fetch: { success: false, message: '' },
      normalize: { success: false, message: '' },
      curate: { success: false, message: '' },
      format: { success: false, message: '' },
      totalTime: 0
    }

    // Run each pipeline step
    try {
      console.log('Step 1: Fetching feeds...')
      const fetchResult = await execAsync('npm run pipeline:fetch')
      results.fetch = { success: true, message: 'Feeds fetched successfully' }
    } catch (error) {
      results.fetch = { success: false, message: `Fetch failed: ${error}` }
      console.error('Fetch error:', error)
    }

    try {
      console.log('Step 2: Normalizing...')
      const normalizeResult = await execAsync('npm run pipeline:normalize')
      results.normalize = { success: true, message: 'Items normalized successfully' }
    } catch (error) {
      results.normalize = { success: false, message: `Normalization failed: ${error}` }
      console.error('Normalize error:', error)
    }

    try {
      console.log('Step 3: Curating...')
      const curateResult = await execAsync('npm run pipeline:curate')
      results.curate = { success: true, message: 'Content curated successfully' }
    } catch (error) {
      results.curate = { success: false, message: `Curation failed: ${error}` }
      console.error('Curate error:', error)
    }

    try {
      console.log('Step 4: Formatting guides...')
      const formatResult = await execAsync('npm run pipeline:format-guides')
      results.format = { success: true, message: 'Guides formatted successfully' }
    } catch (error) {
      results.format = { success: false, message: `Format failed: ${error}` }
      console.error('Format error:', error)
    }

    results.totalTime = Date.now() - startTime

    // Log metrics (could be sent to monitoring service)
    console.log('Pipeline completed:', results)

    // Determine overall status
    const allSuccess = Object.values(results)
      .filter(r => typeof r === 'object' && 'success' in r)
      .every(r => r.success)

    return NextResponse.json({
      status: allSuccess ? 'success' : 'partial',
      results,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Pipeline error:', error)
    return NextResponse.json(
      { error: 'Pipeline execution failed', details: String(error) },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request)
}