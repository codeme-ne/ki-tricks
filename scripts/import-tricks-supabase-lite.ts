#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

type Trick = {
  title: string
  description: string
  category: string
  tools?: string[]
  steps?: string[]
  examples?: string[]
  slug?: string
  why_it_works?: string
  ['Warum es funktioniert']?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  prompt_template?: string
  steps_structured?: Array<{
    step: string
    description?: string
    image_url?: string | null
    code_snippet?: string | null
    warning?: string | null
  }>
}

const validCategories = new Set([
  'productivity',
  'content-creation',
  'programming',
  'design',
  'data-analysis',
  'learning',
  'business',
  'marketing'
])

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/["'`]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function extractWhy(description: string): { description: string; why: string } {
  const regex = /\*\*Warum es funktioniert:\*\*\s*(.+)$/s
  const match = description?.match(regex)
  if (match) {
    const desc = description.replace(match[0], '').trim()
    const why = match[1].trim()
    return { description: desc, why }
  }
  return { description: description?.trim() || '', why: '' }
}

function normalize(input: Trick, idx: number) {
  const errors: string[] = []
  const title = (input.title || '').trim()
  if (!title) errors.push('Missing title')

  let { description, why } = extractWhy(input.description || '')
  if (!description) errors.push('Missing description')

  const category = (input.category || '').trim()
  if (!validCategories.has(category)) errors.push(`Invalid category: ${category}`)

  const tools = Array.isArray(input.tools) ? input.tools.filter(Boolean) : []
  const steps = Array.isArray(input.steps) ? input.steps : []
  const examples = Array.isArray(input.examples) ? input.examples : []
  const slug = (input.slug && input.slug.trim()) || generateSlug(title)

  const why_it_works =
    (input.why_it_works && input.why_it_works.trim()) ||
    (input['Warum es funktioniert'] && String(input['Warum es funktioniert']).trim()) ||
    why || `Dieser Trick nutzt KI gezielt, um "${title}" effizienter umzusetzen.`

  // New fields from schema migration
  const difficulty = input.difficulty || 'beginner'
  const prompt_template = input.prompt_template || null
  const steps_structured = input.steps_structured || null

  if (errors.length) return { ok: false as const, errors, idx }

  return {
    ok: true as const,
    data: {
      title,
      description,
      category,
      tools,
      // Note: 'steps' column was renamed to '_steps_deprecated' in migration
      // We now use 'steps_structured' instead
      examples,
      slug,
      why_it_works,
      difficulty,
      prompt_template,
      steps_structured
    }
  }
}

async function main() {
  const args = process.argv.slice(2)
  const validateOnly = args.includes('--validate')
  const fileArg = args.find(a => a !== '--' && !a.startsWith('-'))
  if (!fileArg) {
    console.log('Usage:\n  npm run import-tricks:file -- <path-to-json> [--validate]\n  npm run import-tricks:validate-file -- <path-to-json>')
    process.exit(0)
  }
  const filePath = path.resolve(process.cwd(), fileArg)

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`)
    process.exit(1)
  }

  // Load .env.local if present
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8')
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        let value = valueParts.join('=')?.trim()
        // Remove surrounding quotes if present
        if (value && ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))) {
          value = value.slice(1, -1)
        }
        if (!process.env[key.trim()] && value) process.env[key.trim()] = value
      }
    })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const raw = fs.readFileSync(filePath, 'utf-8')
  let json: any
  try {
    json = JSON.parse(raw)
  } catch (e: any) {
    console.error('❌ Invalid JSON:', e?.message || e)
    console.error('   Tip: Ensure arrays/objects are properly closed and quotes are balanced.')
    process.exit(1)
  }
  const items: Trick[] = Array.isArray(json) ? json : [json]

  const normalized: ReturnType<typeof normalize>[] = items.map(normalize as any)
  const invalid = normalized.filter(r => !r.ok)
  const valid = normalized.filter(r => r.ok).map(r => (r as any).data)

  // Detect duplicate slugs within the same batch
  const slugCounts: Record<string, number> = {}
  for (const v of valid as any[]) {
    slugCounts[v.slug] = (slugCounts[v.slug] || 0) + 1
  }
  const dupSlugs = Object.entries(slugCounts).filter(([, c]) => c > 1).map(([s]) => s)

  console.log(`🔎 Found ${items.length} items; valid: ${valid.length}, invalid: ${invalid.length}`)
  if (invalid.length) {
    invalid.forEach((r: any) => console.warn(`   ❌ Row ${r.idx + 1}: ${r.errors.join(', ')}`))
  }
  if (dupSlugs.length) {
    console.warn(`   ❌ Duplicate slugs detected in batch: ${dupSlugs.join(', ')}`)
  }

  if (validateOnly) {
    console.log('✅ Validation-only complete.')
    process.exit(invalid.length || dupSlugs.length ? 1 : 0)
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('❌ Missing Supabase env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  if (valid.length === 0) {
    console.log('⚠️  No valid records to import.')
    process.exit(1)
  }

  console.log(`📤 Upserting ${valid.length} records into ki_tricks (conflict: slug)...`)
  const { data, error } = await supabase
    .from('ki_tricks')
    .upsert(valid, { onConflict: 'slug' })
    .select('slug, title')

  if (error) {
    console.error('❌ Import error:', error.message)
    process.exit(1)
  }

  console.log(`✅ Imported/updated ${data?.length || 0} records.`)
  ;(data || []).forEach((r: any) => console.log(`   ✓ ${r.slug} — ${r.title}`))

  // Trigger cache revalidation on Vercel
  await triggerRevalidation()
}

async function triggerRevalidation() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const revalidationSecret = process.env.REVALIDATION_SECRET
  
  if (!revalidationSecret) {
    console.warn('⚠️  REVALIDATION_SECRET not set - skipping cache revalidation')
    return
  }

  console.log('
🔄 Triggering cache revalidation...')
  
  try {
    const response = await fetch(`${siteUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${revalidationSecret}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ path: '/tricks' })
    })

    if (response.ok) {
      const result = await response.json()
      console.log('✅ Cache revalidated successfully')
      console.log(`   Timestamp: ${new Date(result.now).toLocaleString('de-DE')}`)
    } else {
      console.warn(`⚠️  Revalidation failed: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.warn('⚠️  Failed to trigger revalidation:', error instanceof Error ? error.message : error)
    console.log('   Tricks are imported but cache will update after 60 seconds (ISR)')
  }
}

main()
