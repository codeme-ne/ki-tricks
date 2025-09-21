#!/usr/bin/env tsx

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'
import type { Database } from '../../src/lib/supabase/types'
import {
  detectGuideDuplicates,
  formatNewsItemToGuide,
  type GuideFormatterOptions
} from '../../src/lib/services/guide-formatter'

const PROJECT_ROOT = process.cwd()
const BATCH_SIZE = 20

type SupabaseAdminClient = SupabaseClient<Database>

type GuideRow = Database['public']['Tables']['guides']['Row']
type NewsItemRow = Database['public']['Tables']['news_items']['Row']

interface PendingGuide extends GuideRow {
  sources: Array<Record<string, unknown>>
}

function loadDotEnv(): void {
  const envPath = path.join(PROJECT_ROOT, '.env.local')
  if (!fs.existsSync(envPath)) return

  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [key, ...valueParts] = trimmed.split('=')
    if (!key || valueParts.length === 0) continue
    if (!process.env[key]) {
      process.env[key] = valueParts.join('=').trim()
    }
  }
}

function createSupabaseClient(): SupabaseAdminClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

function extractNewsItemId(guide: PendingGuide): string | null {
  const sourceEntry = Array.isArray(guide.sources)
    ? (guide.sources.find(entry => entry && typeof entry === 'object' && entry['type'] === 'news_item') as
        | Record<string, unknown>
        | undefined)
    : undefined

  if (!sourceEntry) return null
  const newsItemId = sourceEntry['news_item_id']
  return typeof newsItemId === 'string' ? newsItemId : null
}

async function fetchPendingGuides(client: SupabaseAdminClient): Promise<PendingGuide[]> {
  const { data, error } = await client
    .from('guides')
    .select('*')
    .eq('status', 'pending')
    .or('quality_score.is.null,quality_score.lt.70')
    .order('created_at', { ascending: true })
    .limit(BATCH_SIZE)

  if (error) {
    throw new Error(`Failed to fetch pending guides: ${error.message}`)
  }

  return ((data ?? []) as GuideRow[]).map(row => ({
    ...row,
    sources: Array.isArray(row.sources) ? (row.sources as Array<Record<string, unknown>>) : []
  }))
}

async function fetchNewsItem(client: SupabaseAdminClient, id: string): Promise<NewsItemRow | null> {
  const { data, error } = await client
    .from('news_items')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch news_item ${id}: ${error.message}`)
  }

  return data as NewsItemRow | null
}

async function loadAllGuides(client: SupabaseAdminClient): Promise<GuideRow[]> {
  const { data, error } = await client
    .from('guides')
    .select('id, title, summary, steps, examples, status, slug')

  if (error) {
    throw new Error(`Failed to fetch guides for duplicate analysis: ${error.message}`)
  }

  return (data ?? []) as GuideRow[]
}

function buildFormatterOptions(guide: PendingGuide): GuideFormatterOptions {
  return {
    role: guide.role,
    industries: Array.isArray(guide.industries) ? guide.industries : [],
    tools: Array.isArray(guide.tools) ? guide.tools : [],
    evidenceLevel: guide.evidence_level,
    riskLevel: guide.risk_level
  }
}

async function main(): Promise<void> {
  loadDotEnv()
  const supabase = createSupabaseClient()

  const pendingGuides = await fetchPendingGuides(supabase)
  if (pendingGuides.length === 0) {
    console.log('Keine pending Guides ohne Formatierung gefunden. ✅')
    return
  }

  const allGuides = await loadAllGuides(supabase)

  let processed = 0
  for (const guide of pendingGuides) {
    processed += 1
    console.log(`\n🛠️  Formatiere Guide ${guide.id} – ${guide.title}`)

    const newsItemId = extractNewsItemId(guide)
    if (!newsItemId) {
      console.warn('   ⚠️  Kein News-Item in den Quellen gefunden. Überspringe Guide.')
      continue
    }

    const newsItem = await fetchNewsItem(supabase, newsItemId)
    if (!newsItem) {
      console.warn(`   ⚠️  News-Item ${newsItemId} nicht gefunden. Überspringe Guide.`)
      continue
    }

    const options = buildFormatterOptions(guide)
    const draft = formatNewsItemToGuide(newsItem, options)
    const comparableGuides = allGuides.filter(existing => existing.id !== guide.id)
    const duplicates = detectGuideDuplicates(draft, comparableGuides)

    const { error: updateError } = await supabase
      .from('guides')
      .update({
        summary: draft.summary,
        steps: draft.steps,
        examples: draft.examples,
        industries: draft.industries,
        tools: draft.tools,
        risk_level: draft.risk_level,
        evidence_level: draft.evidence_level,
        quality_score: draft.quality.score,
        sources: [
          {
            type: 'news_item',
            news_item_id: newsItem.id,
            source_id: newsItem.source_id,
            source_category: newsItem.source_category,
            title: newsItem.title,
            url: newsItem.url,
            published_at: newsItem.published_at,
            evidence_level: draft.evidence_level ?? 'C',
            tags: newsItem.tags
          }
        ]
      })
      .eq('id', guide.id)

    if (updateError) {
      console.error(`   ❌  Aktualisierung fehlgeschlagen: ${updateError.message}`)
      continue
    }

    console.log(`   ✅ Aktualisiert. Qualität: ${draft.quality.score}/100 (${draft.quality.category})`)
    if (duplicates.matches.length > 0) {
      console.log(
        `   ⚠️  ${duplicates.matches.length} mögliche Dubletten (max ${duplicates.highestSimilarity}% Übereinstimmung)`
      )
    }
  }

  console.log(`\n📦 Formatierung abgeschlossen. Guides verarbeitet: ${processed}`)
}

main().catch(error => {
  console.error('❌ Fehler im format-guides Skript:', error)
  process.exit(1)
})
