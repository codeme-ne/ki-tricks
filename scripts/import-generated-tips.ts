#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

type RawTip = {
  id?: string
  title: string
  description: string
  category?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  tools?: string[]
  timeToImplement?: string
  impact?: 'low' | 'medium' | 'high'
  departmentTags?: string[]
  industryTags?: string[]
  steps?: string[]
  examples?: string[]
  slug?: string
  createdAt?: string
  updatedAt?: string
}

// Load environment variables from .env.local like other scripts
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim()
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = value
      }
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const ALLOWED_CATEGORIES = new Set([
  'productivity', 'content-creation', 'programming', 'design', 'data-analysis', 'learning', 'business', 'marketing'
])

function sanitizeCategory(cat?: string): string {
  if (!cat) return 'productivity'
  const c = cat.toLowerCase()
  return ALLOWED_CATEGORIES.has(c) ? c : 'productivity'
}

function extractWarumEsFunktioniert(desc: string): { description: string; why: string } {
  if (!desc) return { description: '', why: defaultWarum() }
  const markerRegex = /(\*\*)?warum es funktioniert(\*\*)?\s*:\s*/i
  const idx = desc.search(markerRegex)
  if (idx === -1) return { description: desc.trim(), why: defaultWarum() }

  const before = desc.slice(0, idx).trim()
  const after = desc.slice(idx).replace(markerRegex, '').trim()

  // Heuristic: take up to the next double newline as the why-section, else entire remainder
  const nextBreak = after.indexOf('\n\n')
  const why = (nextBreak >= 0 ? after.slice(0, nextBreak) : after).trim()
  return { description: before, why: why || defaultWarum() }
}

function defaultWarum() {
  return 'Dieser Trick nutzt bewährte KI-Prinzipien und wurde von der Community erprobt.'
}

function coerceDifficulty(d?: string): 'beginner' | 'intermediate' | 'advanced' {
  const v = (d || 'beginner').toLowerCase()
  return (['beginner', 'intermediate', 'advanced'] as const).includes(v as any)
    ? (v as any)
    : 'beginner'
}

function coerceImpact(i?: string): 'low' | 'medium' | 'high' {
  const v = (i || 'medium').toLowerCase()
  return (['low', 'medium', 'high'] as const).includes(v as any) ? (v as any) : 'medium'
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[äöüß]/g, (m) => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }[m] || m))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function importGeneratedTips() {
  const argPath = process.argv[2]
  const jsonPath = argPath && argPath.endsWith('.json') ? argPath : path.join(process.cwd(), 'data', 'generated-ki-tips.json')
  const csvPath = argPath && argPath.endsWith('.csv') ? argPath : ''

  let raw: RawTip[] = []
  if (csvPath) {
    if (!fs.existsSync(csvPath)) {
      console.error('❌ CSV file not found:', csvPath)
      process.exit(1)
    }
    const csv = fs.readFileSync(csvPath, 'utf-8')
    raw = parseCSV(csv)
  } else {
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ File not found:', jsonPath)
      process.exit(1)
    }
    raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as RawTip[]
  }
  if (!Array.isArray(raw)) {
    console.error('❌ Invalid JSON format. Expected an array.')
    process.exit(1)
  }

  console.log(`📦 Found ${raw.length} generated tips. Preparing upsert...`)

  // Transform and sanitize
  const rows = raw.map((t): any => {
    const { description, why } = extractWarumEsFunktioniert((t.description || '').toString())
    const title = (t.title || '').toString().trim()
    const slug = (t.slug && t.slug.trim()) || slugify(title).slice(0, 160) || `tip-${Date.now()}`
    const tools = Array.isArray(t.tools) ? t.tools.filter(Boolean) : []
    const steps = Array.isArray(t.steps) ? t.steps.filter(Boolean) : []
    const examples = Array.isArray(t.examples) ? t.examples.filter(Boolean) : []
    const department_tags = Array.isArray(t.departmentTags) ? t.departmentTags.filter(Boolean) : []
    const industry_tags = Array.isArray(t.industryTags) ? t.industryTags.filter(Boolean) : []

    return {
      title,
      description,
      category: sanitizeCategory(t.category),
      difficulty: coerceDifficulty(t.difficulty),
      tools,
      time_to_implement: (t.timeToImplement || '10-30 Minuten').toString(),
      impact: coerceImpact(t.impact),
      department_tags,
      industry_tags,
      steps,
      examples,
      slug,
      why_it_works: why,
      status: 'published' as const,
      published_at: new Date().toISOString()
    }
  })

  // Upsert in batches by slug
  const batchSize = 10
  let success = 0
  let failed = 0

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    const { data, error } = await supabase
      .from('ki_tricks')
      .upsert(batch, { onConflict: 'slug' })
      .select()

    if (error) {
      console.error(`❌ Batch ${i / batchSize + 1} failed:`, error.message)
      failed += batch.length
    } else {
      success += (data?.length ?? 0)
      console.log(`✅ Batch ${i / batchSize + 1} upserted (${data?.length ?? 0})`)
    }
  }

  console.log('\n📊 Import Summary:')
  console.log(`   ✅ Upserted: ${success}`)
  if (failed > 0) console.log(`   ❌ Failed:  ${failed}`)
  console.log('\nDone.')
}

// Simple CSV parser assuming headers; columns: title,description,category,difficulty,timeToImplement,impact,tools,departmentTags,industryTags,steps,examples,slug
function parseCSV(csv: string): RawTip[] {
  const lines = csv.split(/\r?\n/).filter(l => l.trim().length > 0)
  if (lines.length === 0) return []
  const headers = lines[0].split(',').map(h => h.trim())
  const arr: RawTip[] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i])
    const row: any = {}
    headers.forEach((h, idx) => {
      row[h] = cols[idx]
    })
    // Parse list-like fields (semicolon-separated)
    const parseList = (v: string | undefined) => (v ? v.split(';').map(s => s.trim()).filter(Boolean) : [])
    row.tools = parseList(row.tools)
    row.departmentTags = parseList(row.departmentTags)
    row.industryTags = parseList(row.industryTags)
    row.steps = parseList(row.steps)
    row.examples = parseList(row.examples)
    arr.push(row as RawTip)
  }
  return arr
}

function splitCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current)
  return result.map(s => s.trim())
}

importGeneratedTips().catch((e) => {
  console.error('❌ Import failed:', e)
  process.exit(1)
})
