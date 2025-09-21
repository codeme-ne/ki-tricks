#!/usr/bin/env tsx

import { createClient, type PostgrestError, type SupabaseClient } from '@supabase/supabase-js'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import type { Database } from '../../src/lib/supabase/types'

type EvidenceLevel = Database['public']['Enums']['evidence_level_enum']

type SourceType = 'rss' | 'json'

type SourceCategory = string

type FetchFrequency = 'daily' | 'weekly' | 'monthly' | string

interface SourceConfig {
  id: string
  type: SourceType
  url: string
  category: SourceCategory
  evidence: EvidenceLevel
  frequency: FetchFrequency
}

interface RawSourceConfig {
  id?: string
  type?: string
  url?: string
  category?: string
  evidence?: string
  frequency?: string
}

type NewsItemRow = Database['public']['Tables']['news_items']['Row']

type SupabaseAdminClient = SupabaseClient<Database>

interface SourceLookups {
  byId: Map<string, SourceConfig>
  byHost: Map<string, SourceConfig>
}

const PROJECT_ROOT = process.cwd()
const DEFAULT_CONFIG_PATH = path.join(PROJECT_ROOT, 'config', 'sources.json')
const FALLBACK_CONFIG_PATH = path.join(PROJECT_ROOT, 'config', 'sources.example.json')
const CLI_ARGS = process.argv.slice(2)
const BATCH_SIZE = 200

function resolveConfigPath(): string {
  const cliFlagIndex = CLI_ARGS.findIndex(arg => arg === '--config' || arg === '-c')
  if (cliFlagIndex !== -1 && CLI_ARGS[cliFlagIndex + 1]) {
    const candidate = CLI_ARGS[cliFlagIndex + 1]
    return path.isAbsolute(candidate) ? candidate : path.join(PROJECT_ROOT, candidate)
  }

  const envOverride = process.env.SOURCES_CONFIG_PATH
  if (envOverride) {
    return path.isAbsolute(envOverride) ? envOverride : path.join(PROJECT_ROOT, envOverride)
  }

  return DEFAULT_CONFIG_PATH
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

function readConfig(): SourceConfig[] {
  const resolvedPath = resolveConfigPath()
  const pathToUse = fs.existsSync(resolvedPath) ? resolvedPath : FALLBACK_CONFIG_PATH
  if (!fs.existsSync(pathToUse)) {
    console.warn(`⚠️  Keine Quellenkonfiguration gefunden (gesucht: ${resolvedPath}, Fallback: ${FALLBACK_CONFIG_PATH}). Normalisierung ohne Mapping.`)
    return []
  }

  const rawContent = fs.readFileSync(pathToUse, 'utf-8')
  let parsed: { sources?: RawSourceConfig[] }
  try {
    parsed = JSON.parse(rawContent)
  } catch (error) {
    throw new Error(`Unable to parse ${pathToUse}: ${(error as Error).message}`)
  }

  if (!parsed.sources || !Array.isArray(parsed.sources)) {
    return []
  }

  const normalized: SourceConfig[] = []
  for (const entry of parsed.sources) {
    if (!entry.id || !entry.type || !entry.url || !entry.category || !entry.evidence || !entry.frequency) {
      continue
    }

    const type = entry.type.trim().toLowerCase()
    if (type !== 'rss' && type !== 'json') {
      continue
    }

    const evidence = entry.evidence.trim().toUpperCase()
    if (!['A', 'B', 'C'].includes(evidence)) {
      continue
    }

    normalized.push({
      id: entry.id,
      type: type as SourceType,
      url: entry.url.trim(),
      category: entry.category.trim(),
      evidence: evidence as EvidenceLevel,
      frequency: entry.frequency.trim()
    })
  }

  return normalized
}

function buildSourceLookups(sources: SourceConfig[]): SourceLookups {
  const byId = new Map<string, SourceConfig>()
  const byHost = new Map<string, SourceConfig>()

  for (const source of sources) {
    byId.set(source.id, source)

    try {
      const host = new URL(source.url).hostname.replace(/^www\./, '')
      byHost.set(host, source)
    } catch {
      // ignore invalid URLs in config
    }
  }

  return { byId, byHost }
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

function decodeCdata(value: string | undefined): string | undefined {
  if (!value) return undefined
  return value.replace(/<!\[CDATA\([\s\S]*?\)\]\]>/gi, '$1').trim()
}

function decodeEntities(value: string | undefined): string | undefined {
  if (!value) return undefined
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

function cleanTitle(title: string, sourceName?: string, host?: string): string {
  let normalized = decodeEntities(decodeCdata(title)) ?? title
  normalized = normalized.replace(/<[^>]+>/g, ' ')
  normalized = normalized.replace(/\s+/g, ' ').trim()

  const separators = [' | ', ' – ', ' - ', ' — ']
  for (const separator of separators) {
    const parts = normalized.split(separator)
    if (parts.length !== 2) continue

    const tail = parts[1].toLowerCase()
    const sourceMatch = [sourceName, host]
      .filter(Boolean)
      .map(value => value!.toLowerCase())
      .some(value => tail === value || tail === `${value} blog`)

    if (sourceMatch) {
      normalized = parts[0]
      break
    }
  }

  return normalized
}

function canonicalizeUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl)
    const params = new URLSearchParams()
    const sortedKeys = Array.from(url.searchParams.keys()).sort()
    for (const key of sortedKeys) {
      if (key.toLowerCase().startsWith('utm_')) continue
      if (key.toLowerCase() === 'fbclid') continue
      const values = url.searchParams.getAll(key)
      for (const value of values) {
        params.append(key, value)
      }
    }

    url.search = params.toString()

    if (url.pathname !== '/' && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1)
    }

    url.hash = ''
    return url.toString()
  } catch {
    return rawUrl
  }
}

function sanitizeSummary(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const decoded = decodeEntities(decodeCdata(value)) ?? value
  const stripped = decoded
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return stripped || null
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map(item => (typeof item === 'string' ? item : String(item)))
      .map(item => item.trim())
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

function parseDateCandidates(raw: Record<string, any>): string | null {
  const candidates: Array<string | undefined> = [
    raw.pubDate,
    raw.published,
    raw.published_at,
    raw.date,
    raw.updated,
    raw.lastBuildDate
  ]

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'string') continue
    const parsed = new Date(candidate)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString()
    }
  }

  return null
}

function ensureIsoString(value: string | null): string | null {
  if (!value) return null
  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString()
  }
  return null
}

function buildContentHash(sourceId: string, url: string, guid: string | null, title: string): string {
  const base = `${sourceId || 'unknown'}::${url || ''}::${guid || ''}::${title || ''}`
  return createHash('sha256').update(base).digest('hex')
}

function isPostgrestError(error: unknown): error is PostgrestError {
  return Boolean(error && typeof error === 'object' && 'code' in error && 'message' in error)
}

function isUniqueViolation(error: unknown): error is PostgrestError {
  return isPostgrestError(error) && error.code === '23505'
}

function normalizeTags(
  item: NewsItemRow,
  source: SourceConfig | undefined,
  urlHost: string | null,
  raw: Record<string, any>
): string[] {
  const tags = new Set<string>()
  const add = (value: unknown) => {
    if (!value || typeof value !== 'string') return
    const trimmed = value.trim()
    if (trimmed.length > 0) {
      tags.add(trimmed)
    }
  }

  item.tags?.forEach(add)
  if (item.source_category) add(item.source_category)
  if (source?.category) add(source.category)
  if (item.source_id) add(item.source_id)
  if (source?.id) add(source.id)
  if (urlHost) add(urlHost)

  const rawCategories = toStringArray(raw.categories)
  rawCategories.forEach(add)

  return Array.from(tags).sort((a, b) => a.localeCompare(b))
}

function inferSource(
  item: NewsItemRow,
  lookups: SourceLookups,
  urlHost: string | null
): { sourceId: string; category: string; evidence: EvidenceLevel | null; type: SourceType } {
  const fallbackCategory = item.source_category?.trim() || 'unknown'
  const fallbackEvidence = item.evidence_level ?? null
  const fallbackType = (item.source_type as SourceType | undefined) ?? 'rss'

  if (item.source_id && lookups.byId.has(item.source_id)) {
    const config = lookups.byId.get(item.source_id)!
    return {
      sourceId: config.id,
      category: config.category,
      evidence: config.evidence,
      type: config.type
    }
  }

  if (item.source_id) {
    const trimmedId = item.source_id.trim()
    if (trimmedId.length > 0) {
      return {
        sourceId: trimmedId,
        category: fallbackCategory,
        evidence: fallbackEvidence,
        type: fallbackType
      }
    }
  }

  if (urlHost && lookups.byHost.has(urlHost)) {
    const config = lookups.byHost.get(urlHost)!
    return {
      sourceId: config.id,
      category: config.category,
      evidence: config.evidence,
      type: config.type
    }
  }

  if (urlHost) {
    return {
      sourceId: urlHost,
      category: fallbackCategory,
      evidence: fallbackEvidence,
      type: fallbackType
    }
  }

  return {
    sourceId: item.source_id?.trim() || 'unknown',
    category: fallbackCategory,
    evidence: fallbackEvidence,
    type: fallbackType
  }
}

function parseRawField<T>(raw: Record<string, any>, keys: string[], fallback: T): T {
  for (const key of keys) {
    if (key in raw) {
      return raw[key] as T
    }
  }
  return fallback
}

async function fetchBatch(client: SupabaseAdminClient): Promise<NewsItemRow[]> {
  const { data, error } = await client
    .from('news_items')
    .select('*')
    .eq('processed', false)
    .order('created_at', { ascending: true })
    .limit(BATCH_SIZE)

  if (error) {
    throw new Error(`Failed to fetch news_items: ${error.message}`)
  }

  return (data ?? []) as NewsItemRow[]
}

async function findConflict(
  client: SupabaseAdminClient,
  hash: string,
  url: string
): Promise<NewsItemRow | null> {
  const { data: hashMatch } = await client
    .from('news_items')
    .select('*')
    .eq('content_hash', hash)
    .limit(1)
    .maybeSingle()

  if (hashMatch) {
    return hashMatch as NewsItemRow
  }

  const { data: urlMatch } = await client
    .from('news_items')
    .select('*')
    .eq('url', url)
    .limit(1)
    .maybeSingle()

  if (urlMatch) {
    return urlMatch as NewsItemRow
  }

  return null
}

async function markAsDuplicate(
  client: SupabaseAdminClient,
  item: NewsItemRow,
  normalized: {
    title: string
    summary: string | null
    published_at: string | null
    tags: string[]
    sourceId: string
    sourceCategory: string
    sourceType: SourceType
    evidence: EvidenceLevel | null
  },
  duplicateOfId: string
): Promise<void> {
  const { error } = await client
    .from('news_items')
    .update({
      title: normalized.title,
      summary: normalized.summary,
      published_at: normalized.published_at,
      tags: normalized.tags,
      source_id: normalized.sourceId,
      source_category: normalized.sourceCategory,
      source_type: normalized.sourceType,
      evidence_level: normalized.evidence,
      processed: true,
      is_duplicate: true,
      duplicate_of: duplicateOfId
    })
    .eq('id', item.id)

  if (error) {
    throw new Error(`Failed to mark ${item.id} as duplicate: ${error.message}`)
  }
}

async function updateNormalized(
  client: SupabaseAdminClient,
  item: NewsItemRow,
  payload: Partial<NewsItemRow>
): Promise<void> {
  const { error } = await client
    .from('news_items')
    .update(payload)
    .eq('id', item.id)

  if (error) {
    throw error
  }
}

async function processItem(
  client: SupabaseAdminClient,
  item: NewsItemRow,
  lookups: SourceLookups
): Promise<'normalized' | 'duplicate' | 'skipped'> {
  const raw = (item.raw as Record<string, any>) || {}
  const canonicalUrl = canonicalizeUrl(item.url)
  let urlHost: string | null = null
  try {
    urlHost = new URL(canonicalUrl).hostname.replace(/^www\./, '')
  } catch {
    urlHost = null
  }

  const inferred = inferSource(item, lookups, urlHost)
  const sourceConfig =
    lookups.byId.get(inferred.sourceId) ?? (item.source_id ? lookups.byId.get(item.source_id) : undefined)
  const sourceName = sourceConfig?.id ?? inferred.sourceId
  const title = cleanTitle(item.title, sourceName, urlHost)
  const summary =
    sanitizeSummary(parseRawField(raw, ['summary', 'content', 'description'], item.summary)) ??
    (item.summary ?? null)
  const publishedAt = ensureIsoString(item.published_at) ?? parseDateCandidates(raw)
  const tags = normalizeTags(item, sourceConfig, urlHost, raw)
  const guid = typeof raw.guid === 'string' ? raw.guid : null
  const hash = buildContentHash(inferred.sourceId, canonicalUrl, guid, title)

  const normalizedPayload: Partial<NewsItemRow> = {
    title,
    url: canonicalUrl,
    summary,
    published_at: publishedAt,
    tags,
    source_id: inferred.sourceId,
    source_category: inferred.sourceCategory,
    source_type: inferred.sourceType,
    evidence_level: inferred.evidence ?? item.evidence_level,
    content_hash: hash,
    is_duplicate: false,
    duplicate_of: null
  }

  try {
    await updateNormalized(client, item, normalizedPayload)
    return 'normalized'
  } catch (error) {
    if (!isUniqueViolation(error)) {
      console.error(`   ⚠️  Failed to normalize ${item.id}: ${(error as Error).message}`)
      return 'skipped'
    }

    const conflict = await findConflict(client, hash, canonicalUrl)
    if (!conflict || conflict.id === item.id) {
      console.error(`   ⚠️  Unique violation for ${item.id} but no conflict row found.`)
      return 'skipped'
    }

    await markAsDuplicate(client, item, {
      title,
      summary,
      published_at: publishedAt,
      tags,
      sourceId: inferred.sourceId,
      sourceCategory: inferred.sourceCategory,
      sourceType: inferred.sourceType,
      evidence: inferred.evidence ?? item.evidence_level
    }, conflict.id)

    return 'duplicate'
  }
}

async function main(): Promise<void> {
  loadDotEnv()

  const sources = readConfig()
  const lookups = buildSourceLookups(sources)
  const supabase = createSupabaseClient()

  console.log('🧹 Starting normalization pipeline for news_items…')

  let processed = 0
  let normalized = 0
  let duplicates = 0
  let skipped = 0

  while (true) {
    const batch = await fetchBatch(supabase)
    if (batch.length === 0) break

    for (const item of batch) {
      processed += 1
      console.log(`\n🔧 Normalizing ${item.id} (${item.title.slice(0, 80)}${item.title.length > 80 ? '…' : ''})`)
      const result = await processItem(supabase, item, lookups)
      switch (result) {
        case 'normalized':
          normalized += 1
          console.log('   ✅ Normalized')
          break
        case 'duplicate':
          duplicates += 1
          console.log('   ↪️ Marked as duplicate')
          break
        case 'skipped':
          skipped += 1
          console.log('   ⚠️ Skipped due to error')
          break
      }
    }

  }

  console.log('\n📊 Normalizer summary:')
  console.log(`   Total processed:   ${processed}`)
  console.log(`   Normalized:        ${normalized}`)
  console.log(`   Duplicates:        ${duplicates}`)
  console.log(`   Skipped (errors):  ${skipped}`)
}

main().catch(error => {
  console.error('❌ Fatal error in normalize-news-items script:', error)
  process.exit(1)
})
