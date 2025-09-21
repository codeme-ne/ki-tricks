import type { Database } from '@/lib/supabase/types'
import {
  calculateKeywordSimilarity,
  calculateSimilarity,
  levenshteinDistance
} from '@/lib/utils/duplicate-detection'

export type NewsItemRow = Database['public']['Tables']['news_items']['Row']
export type GuideRow = Database['public']['Tables']['guides']['Row']

export type EvidenceLevel = Database['public']['Enums']['evidence_level_enum']
export type RiskLevel = Database['public']['Enums']['risk_level_enum']
export type CompanyRole = Database['public']['Enums']['company_role_enum']

export interface GuideFormatterOptions {
  role?: CompanyRole | null
  industries?: string[]
  tools?: string[]
  evidenceLevel?: EvidenceLevel | null
  riskLevel?: RiskLevel | null
}

export interface GuideDraft {
  title: string
  summary: string
  steps: string[]
  examples: string[]
  role: CompanyRole | null
  industries: string[]
  tools: string[]
  evidence_level: EvidenceLevel | null
  risk_level: RiskLevel | null
  sources: Array<Record<string, unknown>>
  quality: GuideQuality
}

export interface GuideQuality {
  score: number
  category: 'excellent' | 'good' | 'fair' | 'poor'
  suggestions: string[]
}

export interface DuplicateGuideMatch {
  id: string
  title: string
  slug: string
  status: GuideRow['status']
  titleSimilarity: number
  summarySimilarity: number
  keywordSimilarity: number
  overallSimilarity: number
}

export interface DuplicateGuideResult {
  matches: DuplicateGuideMatch[]
  highestSimilarity: number
}

const ROLE_LABELS: Record<CompanyRole, string> = {
  general: 'dein Team',
  sales: 'Vertriebsteams',
  marketing: 'Marketingteams',
  hr: 'HR-Teams',
  finance: 'Finance-Abteilungen',
  it: 'IT-Organisationen',
  procurement: 'Einkaufsteams',
  operations: 'Operations-Teams',
  'customer-service': 'Service-Teams',
  legal: 'Legal-Teams',
  product: 'Produktteams',
  consulting: 'Berater:innen'
}

const INDUSTRY_FALLBACK = 'Allgemein'
const TOOL_FALLBACK = 'KI-Assistent'

function ensureArray(value: string[] | undefined, fallback: string): string[] {
  if (!value || value.length === 0) {
    return [fallback]
  }
  return Array.from(new Set(value.map(item => item.trim()).filter(Boolean)))
}

function ensureSummary(summary: string | null, title: string, sourceCategory: string): string {
  const trimmed = summary?.trim()
  if (trimmed && trimmed.length >= 120) {
    return trimmed
  }

  const base = trimmed && trimmed.length > 0 ? trimmed : `${title} – ${sourceCategory}`
  const extended = `${base}. Erfahre, wie du die wichtigsten Punkte auf dein Team überträgst und schnell in die Umsetzung kommst.`
  return extended.length > 260 ? extended.slice(0, 257).trimEnd() + '…' : extended
}

function buildSteps(
  newsItem: NewsItemRow,
  role: CompanyRole | null,
  industries: string[]
): string[] {
  const roleLabel = role ? ROLE_LABELS[role] : 'dein Team'
  const primaryIndustry = industries[0] ?? INDUSTRY_FALLBACK

  const steps: string[] = [
    `Quelle analysieren: Öffne ${newsItem.source_id || 'die Quelle'} und fasse die Kernaussage von "${newsItem.title}" für ${roleLabel} zusammen.`,
    `Relevanz prüfen: Bewerte, welche Auswirkungen der Inhalt auf ${roleLabel} in ${primaryIndustry} hat und welche Prozesse betroffen sind.`,
    `Handlungspunkte ableiten: Formuliere 3 konkrete Maßnahmen, die sofort umgesetzt werden können, und weise Verantwortlichkeiten zu.`,
    `Kommunikation vorbereiten: Erstelle ein kompaktes Update (z. B. E-Mail oder Slack-Post) inklusive Nutzenargumentation und Risiken.`,
    `Monitoring etablieren: Lege fest, wann der Fortschritt überprüft wird und wie weitere Updates aus ${newsItem.source_id || 'der Quelle'} verfolgt werden.`
  ]

  if ((newsItem.tags?.some(tag => /update|release|changelog/i.test(tag)) ?? false) && steps.length === 5) {
    steps.splice(2, 0, `Systemcheck durchführen: Prüfe, ob bestehende Workflows oder Tools angepasst werden müssen und informiere technische Stakeholder frühzeitig.`)
  }

  return steps.slice(0, 6)
}

function buildExamples(newsItem: NewsItemRow, industries: string[], tools: string[]): string[] {
  const industry = industries[0] ?? INDUSTRY_FALLBACK
  const tool = tools[0] ?? TOOL_FALLBACK

  return [
    `Nutze ${tool}, um die wichtigsten Aussagen aus "${newsItem.title}" zu extrahieren und als 2-Minuten-Briefing für ${industry} aufzubereiten.`,
    `Baue eine kurze Checklist in deinem Projekt-Tool, die ${industry} nach jeder Veröffentlichung von ${newsItem.source_id || 'der Quelle'} abarbeitet.`
  ]
}

function evaluateQuality(draft: Omit<GuideDraft, 'quality'>): GuideQuality {
  let score = 0
  const suggestions: string[] = []

  // Summary evaluation (max 25)
  if (draft.summary.length >= 160) {
    score += 25
  } else if (draft.summary.length >= 120) {
    score += 22
  } else if (draft.summary.length >= 90) {
    score += 18
  } else {
    score += 12
    suggestions.push('Summary auf 140–180 Zeichen erweitern.')
  }

  // Steps (max 30)
  if (draft.steps.length >= 5 && draft.steps.length <= 7) {
    score += 30
  } else if (draft.steps.length >= 4) {
    score += 24
  } else {
    score += 15
    suggestions.push('Mindestens fünf präzise Schritte formulieren.')
  }

  // Examples (max 15)
  if (draft.examples.length >= 2) {
    score += 15
  } else if (draft.examples.length === 1) {
    score += 10
    suggestions.push('Zweites Beispiel ergänzen.')
  } else {
    score += 5
    suggestions.push('Mindestens zwei konkrete Beispiele hinzufügen.')
  }

  // Tools (max 10)
  if (draft.tools.length >= 2) {
    score += 10
  } else if (draft.tools.length === 1) {
    score += 7
    suggestions.push('Weitere Tools oder Ressourcen nennen.')
  } else {
    score += 4
    suggestions.push('Passende Tools verlinken oder benennen.')
  }

  // Risk & Evidence (max 10)
  if (draft.risk_level && draft.evidence_level) {
    score += 10
  } else if (draft.evidence_level || draft.risk_level) {
    score += 7
    suggestions.push('Risk-Level und Evidenz stimmig befüllen.')
  } else {
    score += 5
    suggestions.push('Risiko- und Evidenz-Level setzen.')
  }

  // Actionability (max 10)
  const actionVerbs = draft.steps.filter(step => /\b(analyse|bewerte|formuliere|erstelle|lege|nutze|prüfe|übertrage|kommuniziere)/i.test(step))
  if (actionVerbs.length >= Math.min(4, draft.steps.length)) {
    score += 10
  } else {
    score += 6
    suggestions.push('Schritte mit handlungsorientierten Verben formulieren.')
  }

  const category = score >= 85 ? 'excellent' : score >= 70 ? 'good' : score >= 55 ? 'fair' : 'poor'

  return {
    score,
    category,
    suggestions
  }
}

export function formatNewsItemToGuide(
  newsItem: NewsItemRow,
  options: GuideFormatterOptions = {}
): GuideDraft {
  const industries = ensureArray(options.industries, INDUSTRY_FALLBACK)
  const tools = ensureArray(options.tools, TOOL_FALLBACK)
  const summary = ensureSummary(newsItem.summary, newsItem.title, newsItem.source_category)
  const steps = buildSteps(newsItem, options.role ?? null, industries)
  const examples = buildExamples(newsItem, industries, tools)

  const draftWithoutQuality: Omit<GuideDraft, 'quality'> = {
    title: newsItem.title,
    summary,
    steps,
    examples,
    role: options.role ?? null,
    industries,
    tools,
    evidence_level: options.evidenceLevel ?? newsItem.evidence_level ?? null,
    risk_level: options.riskLevel ?? 'medium',
    sources: [],
  }

  const quality = evaluateQuality(draftWithoutQuality)

  return {
    ...draftWithoutQuality,
    quality
  }
}

function buildGuideComparisonPayload(draft: GuideDraft) {
  return {
    title: draft.title,
    summary: draft.summary,
    combinedText: `${draft.summary} ${draft.steps.join(' ')} ${draft.examples.join(' ')}`
  }
}

function buildExistingGuidePayload(guide: GuideDuplicateSource) {
  const summaryText = typeof guide.summary === 'string' ? guide.summary : ''
  const stepsText = Array.isArray(guide.steps) ? guide.steps.join(' ') : ''
  const examplesText = Array.isArray(guide.examples) ? guide.examples.join(' ') : ''

  return {
    id: guide.id,
    title: guide.title,
    slug: guide.slug,
    status: guide.status,
    summary: summaryText,
    combinedText: `${summaryText} ${stepsText} ${examplesText}`
  }
}

type GuideDuplicateSource = Pick<GuideRow, 'id' | 'title' | 'slug' | 'summary' | 'steps' | 'examples' | 'status'>

export function detectGuideDuplicates(
  draft: GuideDraft,
  existingGuides: GuideDuplicateSource[],
  thresholds = {
    title: 82,
    summary: 70,
    keywords: 65,
    overall: 78
  }
): DuplicateGuideResult {
  const candidate = buildGuideComparisonPayload(draft)

  const matches = existingGuides
    .map(existing => {
      const payload = buildExistingGuidePayload(existing)
      const titleSimilarity = calculateSimilarity(candidate.title, payload.title)
      const summarySimilarity = calculateSimilarity(candidate.summary, payload.summary)
      const keywordSimilarity = calculateKeywordSimilarity(candidate.combinedText, payload.combinedText)

      const lengthFactor = Math.max(candidate.combinedText.length, payload.combinedText.length)
      const levenshteinSim = lengthFactor === 0
        ? 100
        : Math.round(((lengthFactor - levenshteinDistance(candidate.combinedText, payload.combinedText)) / lengthFactor) * 100)

      const overallSimilarity = Math.round(
        titleSimilarity * 0.45 +
        summarySimilarity * 0.25 +
        keywordSimilarity * 0.2 +
        levenshteinSim * 0.1
      )

      return {
        id: existing.id,
        title: existing.title,
        slug: existing.slug,
        status: existing.status,
        titleSimilarity,
        summarySimilarity,
        keywordSimilarity,
        overallSimilarity
      }
    })
    .filter(match =>
      match.titleSimilarity >= thresholds.title ||
      match.summarySimilarity >= thresholds.summary ||
      match.keywordSimilarity >= thresholds.keywords ||
      match.overallSimilarity >= thresholds.overall
    )
    .sort((a, b) => b.overallSimilarity - a.overallSimilarity)

  const highestSimilarity = matches.length > 0 ? matches[0].overallSimilarity : 0

  return {
    matches: matches.slice(0, 5),
    highestSimilarity
  }
}
