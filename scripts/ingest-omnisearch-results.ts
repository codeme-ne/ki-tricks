#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

type OmniItem = {
  title: string
  url: string
  snippet?: string
  tags?: string[]
  role?: string
  tool_vendor?: string
  category?: string
  estimated_time_minutes?: number
  estimated_savings_minutes?: number
  risk_level?: 'low'|'medium'|'high'
  evidence_level?: 'A'|'B'|'C'
  privacy_notes?: string
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf-8')
  env.split('\n').forEach(line => {
    const [k, ...rest] = line.split('=')
    if (k && rest.length) process.env[k.trim()] = process.env[k.trim()] || rest.join('=').trim()
  })
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const service = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !service) {
  console.error('Missing Supabase env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}
const supabase = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } })

async function main() {
  const file = process.argv[2]
  if (!file) {
    console.log('Usage: npm run ingest:omni -- <path-to-curated.json>')
    process.exit(0)
  }
  const full = path.resolve(process.cwd(), file)
  if (!fs.existsSync(full)) {
    console.error('File not found:', full)
    process.exit(1)
  }

  const raw = fs.readFileSync(full, 'utf-8')
  let items: OmniItem[]
  try { items = JSON.parse(raw) } catch (e) {
    console.error('Invalid JSON'); process.exit(1)
  }

  const upserts = [] as any[]
  for (const it of items) {
    const title = it.title?.trim()
    if (!title) continue
    const category = (it.category || 'productivity') as any
    const slug = slugify(title)
    const description = it.snippet || title

    const record: any = {
      title,
      description,
      category,
      tools: [],
      steps: [],
      examples: [],
      slug,
      why_it_works: 'Basierend auf verifizierten Quellen und bewährten Mustern.',
      status: 'published',
      sources: [{ title: it.title, url: it.url, type: 'doc' }],
      role: it.role || null,
      tool_vendor: it.tool_vendor || null,
      estimated_time_minutes: it.estimated_time_minutes || null,
      estimated_savings_minutes: it.estimated_savings_minutes || null,
      risk_level: it.risk_level || null,
      evidence_level: it.evidence_level || null,
      privacy_notes: it.privacy_notes || null
    }
    upserts.push(record)
  }

  if (upserts.length === 0) {
    console.log('No valid items to import.')
    return
  }

  console.log(`Upserting ${upserts.length} curated items...`)
  const { data, error } = await supabase.from('ki_tricks').upsert(upserts, { onConflict: 'slug' }).select('slug,title')
  if (error) { console.error(error.message); process.exit(1) }
  (data||[]).forEach(r => console.log('✓', r.slug, '—', r.title))
}

main()

