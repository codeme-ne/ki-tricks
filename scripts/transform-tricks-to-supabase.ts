#!/usr/bin/env tsx

import * as fs from 'fs'
import * as path from 'path'

type InputTrick = {
  id?: string
  title: string
  description: string
  category: string
  tools?: string[] | string
  steps?: string[]
  examples?: string[]
  slug?: string
  difficulty?: string
  timeToImplement?: string
  impact?: string
  createdAt?: string
  updatedAt?: string
}

type OutputTrick = {
  title: string
  description: string
  category: string
  tools: string[]
  steps: string[]
  examples: string[]
  slug: string
  why_it_works: string
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

function ensureArray(input?: string[] | string): string[] {
  if (!input) return []
  if (Array.isArray(input)) return input.filter(Boolean)
  return input
    .split(';')
    .map(s => s.trim())
    .filter(Boolean)
}

function extractWhy(description: string): { description: string; why: string } {
  const regex = /\*\*Warum es funktioniert:\*\*\s*(.+)$/s
  const match = description.match(regex)
  if (match) {
    const desc = description.replace(match[0], '').trim()
    const why = match[1].trim()
    return { description: desc, why }
  }
  return { description: description.trim(), why: '' }
}

function transform(trick: InputTrick): OutputTrick {
  const title = (trick.title || '').trim()
  if (!title) throw new Error('Missing title')

  const { description, why } = extractWhy(trick.description || '')

  const category = (trick.category || '').trim()
  if (!validCategories.has(category)) {
    throw new Error(`Invalid category: ${category}. Allowed: ${Array.from(validCategories).join(', ')}`)
  }

  const tools = ensureArray(trick.tools)
  const steps = Array.isArray(trick.steps) ? trick.steps : []
  const examples = Array.isArray(trick.examples) ? trick.examples : []

  const slug = (trick.slug && trick.slug.trim()) || generateSlug(title)

  const why_it_works = why || `Dieser Trick nutzt KI gezielt, um "${title}" effizienter umzusetzen und bessere Ergebnisse zu erzielen.`

  if (!why_it_works.trim()) {
    throw new Error('why_it_works cannot be empty')
  }

  if (!description.trim()) {
    throw new Error('description cannot be empty after extraction')
  }

  return {
    title,
    description,
    category,
    tools,
    steps,
    examples,
    slug,
    why_it_works
  }
}

function main() {
  const inputPath = process.argv[2] || path.join(process.cwd(), 'data', 'generated-ki-tips.json')
  const outputPath = process.argv[3] || path.join(process.cwd(), 'data', 'generated-ki-tips.supabase.json')

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Input file not found: ${inputPath}`)
    process.exit(1)
  }

  const raw = fs.readFileSync(inputPath, 'utf-8')
  const data: unknown = JSON.parse(raw)
  const list: InputTrick[] = Array.isArray(data) ? data : [data as InputTrick]

  const out: OutputTrick[] = []
  const errors: { index: number; error: string; slug?: string; title?: string }[] = []

  list.forEach((item, idx) => {
    try {
      const t = transform(item)
      out.push(t)
    } catch (e: any) {
      errors.push({ index: idx, error: e?.message || String(e), slug: item.slug, title: item.title })
    }
  })

  // Ensure unique slugs
  const seen = new Set<string>()
  out.forEach((t) => {
    if (seen.has(t.slug)) {
      // Disambiguate duplicate slugs by appending a suffix
      let i = 2
      let slug = `${t.slug}-${i}`
      while (seen.has(slug)) { i++; slug = `${t.slug}-${i}` }
      t.slug = slug
    }
    seen.add(t.slug)
  })

  fs.writeFileSync(outputPath, JSON.stringify(out, null, 2))

  console.log(`✅ Wrote ${out.length} transformed tricks to: ${outputPath}`)
  if (errors.length) {
    const errPath = outputPath.replace(/\.json$/, '.errors.json')
    fs.writeFileSync(errPath, JSON.stringify(errors, null, 2))
    console.warn(`⚠️  ${errors.length} items failed transformation. Details: ${errPath}`)
  }

  // Optionally, also overwrite the source file if the CLI flag is provided
  if (process.argv.includes('--in-place')) {
    fs.writeFileSync(inputPath, JSON.stringify(out, null, 2))
    console.log(`✍️  Updated input file in place: ${inputPath}`)
  }
}

main()
