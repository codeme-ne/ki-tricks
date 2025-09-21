#!/usr/bin/env tsx

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

type EvidenceLevel = 'A' | 'B' | 'C'

type SourceType = 'rss' | 'json'

type SourceCategory = 'vendor' | 'regulatory' | 'media' | 'integration' | string

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

interface RssFeedItem {
  title?: string
  link?: string
  description?: string
  content?: string
  pubDate?: string
  updated?: string
  guid?: string
  categories?: string[]
}

interface NormalizedNewsItem {
  source_id: string
  source_type: string
  source_category: string
  evidence_level: EvidenceLevel
  title: string
  url: string
  published_at: string | null
  content_hash: string
  summary: string | null
  tags: string[]
  raw: Record<string, unknown>
  processed: boolean
  created_at?: string
  updated_at?: string
}

interface SupabaseNewsItemRow extends NormalizedNewsItem {}

const PROJECT_ROOT = process.cwd()
const DEFAULT_CONFIG_PATH = path.join(PROJECT_ROOT, 'config', 'sources.json')
const FALLBACK_CONFIG_PATH = path.join(PROJECT_ROOT, 'config', 'sources.example.json')
const CLI_ARGS = process.argv.slice(2)

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
    throw new Error(
      `No sources configuration found. Looked for ${resolvedPath} and fallback ${FALLBACK_CONFIG_PATH}.`
    )
  }

  const rawContent = fs.readFileSync(pathToUse, 'utf-8')
  let parsed: { sources?: RawSourceConfig[] }
  try {
    parsed = JSON.parse(rawContent)
  } catch (error) {
    throw new Error(`Unable to parse ${pathToUse}: ${(error as Error).message}`)
  }

  if (!parsed.sources || !Array.isArray(parsed.sources)) {
    throw new Error('The sources configuration must contain a "sources" array.')
  }

  const normalized: SourceConfig[] = []
  for (const entry of parsed.sources) {
    if (!entry.id || !entry.type || !entry.url || !entry.category || !entry.evidence || !entry.frequency) {
      console.warn(`Skipping invalid source entry: ${JSON.stringify(entry)}`)
      continue
    }

    const type = entry.type.trim().toLowerCase()
    if (type !== 'rss' && type !== 'json') {
      console.warn(`Unsupported source type "${entry.type}" for id ${entry.id}. Skipping.`)
      continue
    }

    const evidence = entry.evidence.trim().toUpperCase()
    if (!['A', 'B', 'C'].includes(evidence)) {
      console.warn(`Unsupported evidence level "${entry.evidence}" for id ${entry.id}. Skipping.`)
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

async function fetchWithRetry(url: string, maxAttempts = 3, backoffMs = 750): Promise<string> {
  if (url.startsWith('file://')) {
    const filePath = fileURLToPath(url)
    return fs.readFileSync(filePath, 'utf-8')
  }

  if (url.startsWith('file:')) {
    const relativePath = url.replace(/^file:/, '')
    const filePath = path.isAbsolute(relativePath)
      ? relativePath
      : path.join(PROJECT_ROOT, relativePath)
    return fs.readFileSync(filePath, 'utf-8')
  }

  let lastError: unknown
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { 'user-agent': 'ai-platform-fetcher/1.0 (+https://ki-tricks.com)' }
      })
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }
      return await response.text()
    } catch (error) {
      lastError = error
      const wait = backoffMs * attempt
      console.warn(`Fetch attempt ${attempt} for ${url} failed: ${(error as Error).message}. Retrying in ${wait}ms`)
      await new Promise(resolve => setTimeout(resolve, wait))
    }
  }
  throw new Error(`Failed to fetch ${url} after ${maxAttempts} attempts: ${(lastError as Error)?.message ?? lastError}`)
}

function decodeCdata(value: string | undefined): string | undefined {
  if (!value) return undefined
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1').trim()
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

function extractTag(block: string, tag: string): string | undefined {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i')
  const match = block.match(regex)
  if (!match) return undefined
  return decodeEntities(decodeCdata(match[1]))
}

function extractMultipleTags(block: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'gi')
  const values: string[] = []
  let match: RegExpExecArray | null
  while ((match = regex.exec(block)) !== null) {
    const decoded = decodeEntities(decodeCdata(match[1]))
    if (decoded) {
      values.push(decoded)
    }
  }
  return values
}

function parseRss(xml: string): RssFeedItem[] {
  const items: RssFeedItem[] = []
  const itemRegex = /<item[\s\S]*?<\/item>/gi
  const blocks = xml.match(itemRegex)
  if (!blocks) return items

  for (const block of blocks) {
    const title = extractTag(block, 'title')
    const link = extractTag(block, 'link')
    const description = extractTag(block, 'description')
    const content = extractTag(block, 'content:encoded') || extractTag(block, 'content')
    const pubDate = extractTag(block, 'pubDate') || extractTag(block, 'updated')
    const guid = extractTag(block, 'guid')
    const categories = extractMultipleTags(block, 'category')

    items.push({
      title: title ?? undefined,
      link: link ?? undefined,
      description: description ?? undefined,
      content: content ?? undefined,
      pubDate: pubDate ?? undefined,
      updated: extractTag(block, 'updated') ?? undefined,
      guid: guid ?? undefined,
      categories: categories.length ? categories : undefined
    })
  }

  return items
}

function sanitizeSummary(value: string | undefined): string | null {
  if (!value) return null
  const stripped = value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return stripped || null
}

function parsePublishedDate(item: RssFeedItem): string | null {
  const candidates = [item.pubDate, item.updated]
  for (const candidate of candidates) {
    if (!candidate) continue
    const parsed = new Date(candidate)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString()
    }
  }
  return null
}

function buildContentHash(sourceId: string, title?: string, url?: string, guid?: string): string {
  const base = `${sourceId}::${url ?? ''}::${guid ?? ''}::${title ?? ''}`
  return createHash('sha256').update(base).digest('hex')
}

function normalizeRssItems(source: SourceConfig, items: RssFeedItem[]): NormalizedNewsItem[] {
  const normalized: NormalizedNewsItem[] = []
  for (const item of items) {
    if (!item.title || !item.link) continue
    const summary = sanitizeSummary(item.content ?? item.description)
    const publishedAt = parsePublishedDate(item)
    const content_hash = buildContentHash(source.id, item.title, item.link, item.guid)
    const tags = new Set<string>()
    tags.add(source.category)
    if (item.categories) {
      for (const category of item.categories) {
        if (category) tags.add(category)
      }
    }

    normalized.push({
      source_id: source.id,
      source_type: source.type,
      source_category: source.category,
      evidence_level: source.evidence,
      title: item.title.trim(),
      url: item.link.trim(),
      published_at: publishedAt,
      content_hash,
      summary,
      tags: Array.from(tags),
      raw: {
        title: item.title,
        link: item.link,
        description: item.description,
        content: item.content,
        pubDate: item.pubDate,
        updated: item.updated,
        guid: item.guid,
        categories: item.categories
      },
      processed: false
    })
  }
  return normalized
}

function dedupeByContentHash(items: NormalizedNewsItem[]): NormalizedNewsItem[] {
  const map = new Map<string, NormalizedNewsItem>()
  for (const item of items) {
    if (!map.has(item.content_hash)) {
      map.set(item.content_hash, item)
    }
  }
  return Array.from(map.values())
}

function createSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

async function persistNewsItems(client: SupabaseClient, items: NormalizedNewsItem[]): Promise<number> {
  if (items.length === 0) return 0
  const { error, data } = await client
    .from('news_items')
    .upsert(items, { onConflict: 'content_hash', ignoreDuplicates: true })
    .select('id')

  if (error) {
    throw new Error(`Failed to upsert news_items: ${error.message}`)
  }

  return data?.length ?? 0
}

async function processSource(client: SupabaseClient, source: SourceConfig): Promise<NormalizedNewsItem[]> {
  console.log(`\n🔎 Fetching ${source.id} (${source.type}) from ${source.url}`)
  try {
    const payload = await fetchWithRetry(source.url)
    switch (source.type) {
      case 'rss':
        const rssItems = parseRss(payload)
        console.log(`   → Parsed ${rssItems.length} RSS entries`)
        return normalizeRssItems(source, rssItems)
      case 'json':
        console.warn(`   → JSON source type not implemented yet. Skipping ${source.id}.`)
        return []
      default:
        console.warn(`   → Unsupported source type ${source.type}. Skipping.`)
        return []
    }
  } catch (error) {
    console.error(`   ⚠️  Failed to process ${source.id}: ${(error as Error).message}`)
    return []
  }
}

async function main(): Promise<void> {
  loadDotEnv()

  const sources = readConfig()
  if (sources.length === 0) {
    console.log('No valid sources configured. Nothing to do.')
    return
  }

  const supabase = createSupabaseClient()
  const collected: NormalizedNewsItem[] = []

  for (const source of sources) {
    const normalized = await processSource(supabase, source)
    collected.push(...normalized)
  }

  const uniqueItems = dedupeByContentHash(collected)
  console.log(`\n🧮 Collected ${collected.length} items (${uniqueItems.length} unique by content hash)`)

  if (uniqueItems.length === 0) {
    console.log('No new items to persist.')
    return
  }

  const insertedCount = await persistNewsItems(supabase, uniqueItems)
  console.log(`\n✅ Stored ${insertedCount} new items in news_items (duplicates ignored).`)
}

main().catch(error => {
  console.error('❌ Fatal error in fetch-feeds script:', error)
  process.exit(1)
})
