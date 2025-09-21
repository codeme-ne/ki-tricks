#!/usr/bin/env tsx

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import path from 'node:path'
import fs from 'node:fs'

interface NewsItem {
  id: string
  source_id: string
  source_category: string
  evidence_level: 'A' | 'B' | 'C'
  title: string
  url: string
  published_at: string | null
  summary: string | null
  tags: string[]
  processed: boolean
}

interface CuratedGuide {
  title: string
  slug: string
  summary: string
  role?: string
  industries: string[]
  tools: string[]
  sources: { url: string; title: string; date: string }[]
  risk_level: 'low' | 'medium' | 'high'
  evidence_level: 'A' | 'B' | 'C'
  status: 'pending'
  quality_score?: number
}

interface EvaluationResult {
  relevance: number // 1-10
  quality: number // 1-10
  practicality: number // 1-10
  dsgvoRelevance: boolean
  recommendation: 'guide' | 'skip'
  suggestedRole?: string
  suggestedTools: string[]
  suggestedIndustries: string[]
  riskLevel: 'low' | 'medium' | 'high'
}

const PROJECT_ROOT = process.cwd()
const BATCH_SIZE = 5 // Process 5 items at once for efficiency

// Load environment variables
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

function createSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.'
    )
  }

  return createClient(supabaseUrl, supabaseKey)
}

// Mock AI evaluation for now - replace with actual Claude API
async function evaluateContent(item: NewsItem): Promise<EvaluationResult> {
  // This is a placeholder - integrate with Claude API
  // For now, apply heuristic-based evaluation

  const relevance = calculateRelevance(item)
  const quality = calculateQuality(item)
  const practicality = calculatePracticality(item)
  const dsgvoRelevance = checkDsgvoRelevance(item)

  // Determine recommendation based on scores
  const avgScore = (relevance + quality + practicality) / 3
  const recommendation = avgScore >= 7 ? 'guide' : 'skip'

  // Extract tools from content
  const suggestedTools = extractTools(item)

  // Determine role and industries
  const { role, industries } = determineRoleAndIndustries(item)

  // Assess risk level
  const riskLevel = assessRiskLevel(item)

  return {
    relevance,
    quality,
    practicality,
    dsgvoRelevance,
    recommendation,
    suggestedRole: role,
    suggestedTools,
    suggestedIndustries: industries,
    riskLevel
  }
}

function calculateRelevance(item: NewsItem): number {
  let score = 5 // Base score

  // Higher score for vendor sources
  if (item.source_category === 'vendor') score += 2

  // Higher score for regulatory sources
  if (item.source_category === 'regulatory') score += 1

  // Check for AI-related keywords
  const aiKeywords = ['KI', 'AI', 'ChatGPT', 'Claude', 'GPT', 'Machine Learning', 'Deep Learning', 'Neural']
  const titleLower = item.title.toLowerCase()
  const summaryLower = (item.summary || '').toLowerCase()

  for (const keyword of aiKeywords) {
    if (titleLower.includes(keyword.toLowerCase()) || summaryLower.includes(keyword.toLowerCase())) {
      score += 0.5
    }
  }

  // Evidence level bonus
  if (item.evidence_level === 'A') score += 1

  return Math.min(10, Math.round(score))
}

function calculateQuality(item: NewsItem): number {
  let score = 5

  // Check content length
  if (item.summary && item.summary.length > 200) score += 2

  // Recent content scores higher
  if (item.published_at) {
    const daysAgo = (Date.now() - new Date(item.published_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysAgo < 7) score += 2
    else if (daysAgo < 30) score += 1
  }

  // Trusted sources
  const trustedSources = ['openai', 'anthropic', 'google', 'microsoft', 'eu_digital', 'bsi']
  if (trustedSources.some(source => item.source_id.includes(source))) {
    score += 1
  }

  return Math.min(10, Math.round(score))
}

function calculatePracticality(item: NewsItem): number {
  let score = 6

  // Check for practical keywords
  const practicalKeywords = ['tutorial', 'guide', 'how to', 'anleitung', 'beispiel', 'example', 'implementation', 'praktisch']
  const contentLower = (item.title + ' ' + (item.summary || '')).toLowerCase()

  for (const keyword of practicalKeywords) {
    if (contentLower.includes(keyword)) {
      score += 1
    }
  }

  return Math.min(10, Math.round(score))
}

function checkDsgvoRelevance(item: NewsItem): boolean {
  const dsgvoKeywords = ['dsgvo', 'gdpr', 'datenschutz', 'privacy', 'compliance', 'eu ai act', 'regulation']
  const content = (item.title + ' ' + (item.summary || '')).toLowerCase()

  return dsgvoKeywords.some(keyword => content.includes(keyword))
}

function extractTools(item: NewsItem): string[] {
  const tools = new Set<string>()
  const content = (item.title + ' ' + (item.summary || '')).toLowerCase()

  const toolPatterns = [
    { pattern: /chatgpt/i, tool: 'ChatGPT' },
    { pattern: /claude/i, tool: 'Claude' },
    { pattern: /gpt-?4/i, tool: 'GPT-4' },
    { pattern: /copilot/i, tool: 'GitHub Copilot' },
    { pattern: /midjourney/i, tool: 'Midjourney' },
    { pattern: /dall-?e/i, tool: 'DALL-E' },
    { pattern: /stable diffusion/i, tool: 'Stable Diffusion' },
    { pattern: /gemini/i, tool: 'Google Gemini' },
    { pattern: /llama/i, tool: 'Llama' },
    { pattern: /perplexity/i, tool: 'Perplexity' }
  ]

  for (const { pattern, tool } of toolPatterns) {
    if (pattern.test(content)) {
      tools.add(tool)
    }
  }

  return Array.from(tools)
}

function determineRoleAndIndustries(item: NewsItem): { role?: string; industries: string[] } {
  const content = (item.title + ' ' + (item.summary || '')).toLowerCase()
  const industries = new Set<string>()
  let role: string | undefined

  // Role detection
  if (content.includes('develop') || content.includes('programming') || content.includes('code')) {
    role = 'it'
  } else if (content.includes('marketing') || content.includes('content')) {
    role = 'marketing'
  } else if (content.includes('sales') || content.includes('vertrieb')) {
    role = 'sales'
  } else if (content.includes('hr') || content.includes('personal')) {
    role = 'hr'
  } else if (content.includes('finance') || content.includes('finanzen')) {
    role = 'finance'
  } else {
    role = 'general'
  }

  // Industry detection
  if (content.includes('tech') || content.includes('software')) industries.add('technology')
  if (content.includes('finance') || content.includes('bank')) industries.add('finance')
  if (content.includes('health') || content.includes('gesundheit')) industries.add('healthcare')
  if (content.includes('retail') || content.includes('handel')) industries.add('retail')
  if (content.includes('education') || content.includes('bildung')) industries.add('education')

  return { role, industries: Array.from(industries) }
}

function assessRiskLevel(item: NewsItem): 'low' | 'medium' | 'high' {
  const content = (item.title + ' ' + (item.summary || '')).toLowerCase()

  // High risk keywords
  if (content.includes('security') || content.includes('vulnerability') || content.includes('breach')) {
    return 'high'
  }

  // Medium risk keywords
  if (content.includes('compliance') || content.includes('regulation') || content.includes('dsgvo')) {
    return 'medium'
  }

  return 'low'
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[äöüß]/g, char => {
      const replacements: Record<string, string> = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }
      return replacements[char] || char
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100)
}

async function createGuideFromItem(item: NewsItem, evaluation: EvaluationResult): Promise<CuratedGuide> {
  const slug = generateSlug(item.title)

  return {
    title: item.title,
    slug,
    summary: item.summary || '',
    role: evaluation.suggestedRole,
    industries: evaluation.suggestedIndustries,
    tools: evaluation.suggestedTools,
    sources: [{
      url: item.url,
      title: item.title,
      date: item.published_at || new Date().toISOString()
    }],
    risk_level: evaluation.riskLevel,
    evidence_level: item.evidence_level,
    status: 'pending',
    quality_score: Math.round((evaluation.relevance + evaluation.quality + evaluation.practicality) / 3 * 10)
  }
}

async function processNewsItems(supabase: SupabaseClient) {
  console.log('Starting AI Curator...')

  // Fetch unprocessed news items
  const { data: items, error } = await supabase
    .from('news_items')
    .select('*')
    .eq('processed', false)
    .limit(BATCH_SIZE)

  if (error) {
    console.error('Error fetching news items:', error)
    return
  }

  if (!items || items.length === 0) {
    console.log('No unprocessed items found')
    return
  }

  console.log(`Processing ${items.length} items...`)

  for (const item of items) {
    console.log(`\nEvaluating: ${item.title}`)

    try {
      // Evaluate content
      const evaluation = await evaluateContent(item as NewsItem)

      console.log(`  Relevance: ${evaluation.relevance}/10`)
      console.log(`  Quality: ${evaluation.quality}/10`)
      console.log(`  Practicality: ${evaluation.practicality}/10`)
      console.log(`  Recommendation: ${evaluation.recommendation}`)

      if (evaluation.recommendation === 'guide') {
        // Create guide entry
        const guide = await createGuideFromItem(item as NewsItem, evaluation)

        // Check if guide already exists
        const { data: existing } = await supabase
          .from('guides')
          .select('id')
          .eq('slug', guide.slug)
          .single()

        if (!existing) {
          // Insert new guide
          const { error: insertError } = await supabase
            .from('guides')
            .insert(guide)

          if (insertError) {
            console.error(`  Error creating guide: ${insertError.message}`)
          } else {
            console.log(`  ✓ Guide created: ${guide.slug}`)
          }
        } else {
          console.log(`  Guide already exists: ${guide.slug}`)
        }
      } else {
        console.log(`  Skipping item (low scores)`)
      }

      // Mark item as processed
      const { error: updateError } = await supabase
        .from('news_items')
        .update({ processed: true })
        .eq('id', item.id)

      if (updateError) {
        console.error(`  Error updating processed status: ${updateError.message}`)
      }

    } catch (error) {
      console.error(`  Error processing item: ${error}`)
    }
  }

  console.log('\nCuration complete!')
}

async function main() {
  try {
    loadDotEnv()
    const supabase = createSupabaseClient()
    await processNewsItems(supabase)
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { evaluateContent, createGuideFromItem }