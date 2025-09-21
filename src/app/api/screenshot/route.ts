import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import { createAdminClient } from '@/lib/supabase/admin'

const BUCKET = 'materials'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const unauthorizedResponse = () =>
  NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })

interface ScreenshotPayload {
  url?: string
  guideId?: string
  width?: number
  height?: number
  fullPage?: boolean
}

function requireAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  return Boolean(authHeader && authHeader.startsWith('Basic '))
}

async function captureScreenshot(
  url: string,
  options: { width: number; height: number; fullPage: boolean }
): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: options.width, height: options.height, deviceScaleFactor: 1 })

    const qualities = [70, 55]
    let lastError: unknown

    for (const quality of qualities) {
      try {
        await page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: 20000
        })
        await new Promise(resolve => setTimeout(resolve, 1500))

        const buffer = (await page.screenshot({
          type: 'webp',
          quality,
          fullPage: options.fullPage
        })) as Buffer

        if (buffer.length <= 320 * 1024 || quality === qualities[qualities.length - 1]) {
          return buffer
        }
      } catch (error) {
        lastError = error
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    throw lastError ?? new Error('Screenshot konnte nicht erstellt werden.')
  } finally {
    await browser.close()
  }
}

export async function POST(request: NextRequest) {
  if (!requireAuth(request)) {
    return unauthorizedResponse()
  }

  let body: ScreenshotPayload
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json({ error: 'Ungültige JSON-Daten' }, { status: 400 })
  }

  if (!body.url || !body.guideId) {
    return NextResponse.json({ error: 'url und guideId sind Pflichtfelder.' }, { status: 400 })
  }

  try {
    new URL(body.url)
  } catch (error) {
    return NextResponse.json({ error: 'Ungültige URL.' }, { status: 400 })
  }

  const width = Number.isFinite(body.width) && body.width ? Math.min(1600, Math.max(800, body.width)) : 1280
  const height = Number.isFinite(body.height) && body.height ? Math.min(1200, Math.max(720, body.height)) : 720
  const fullPage = Boolean(body.fullPage)

  let screenshot: Buffer
  try {
    screenshot = await captureScreenshot(body.url, { width, height, fullPage })
  } catch (error) {
    console.error('Screenshot capture failed:', error)
    return NextResponse.json({ error: 'Screenshot konnte nicht erstellt werden.' }, { status: 500 })
  }

  const supabase = createAdminClient()
  const filePath = `guides/${body.guideId}/${Date.now()}.webp`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, screenshot, {
      cacheControl: '3600',
      contentType: 'image/webp',
      upsert: true
    })

  if (uploadError) {
    console.error('Upload to storage failed:', uploadError)
    return NextResponse.json({ error: 'Upload fehlgeschlagen.' }, { status: 500 })
  }

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath)
  const publicUrl = publicUrlData?.publicUrl

  if (!publicUrl) {
    return NextResponse.json({ error: 'Öffentliche URL konnte nicht ermittelt werden.' }, { status: 500 })
  }

  const { error: updateError } = await supabase
    .from('guides')
    .update({ hero_image_url: publicUrl })
    .eq('id', body.guideId)

  if (updateError) {
    console.error('Guide update failed after screenshot upload:', updateError)
    return NextResponse.json({ error: 'Guide konnte nicht aktualisiert werden.' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    heroImageUrl: publicUrl,
    sizeBytes: screenshot.length
  })
}
