import { KITrick } from '@/lib/types/types'

/**
 * Calculate Levenshtein distance between two strings
 * Used to determine similarity between trick titles and descriptions
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []
  const len1 = str1.length
  const len2 = str2.length

  // Initialize first row and column
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j
  }

  // Fill the matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      )
    }
  }

  return matrix[len1][len2]
}

/**
 * Calculate similarity percentage between two strings
 * Returns a value between 0 and 100
 */
export function calculateSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0
  
  const normalizedStr1 = str1.toLowerCase().trim()
  const normalizedStr2 = str2.toLowerCase().trim()
  
  if (normalizedStr1 === normalizedStr2) return 100
  
  const maxLength = Math.max(normalizedStr1.length, normalizedStr2.length)
  if (maxLength === 0) return 100
  
  const distance = levenshteinDistance(normalizedStr1, normalizedStr2)
  return Math.round(((maxLength - distance) / maxLength) * 100)
}

/**
 * Extract keywords from text for comparison
 */
export function extractKeywords(text: string): string[] {
  if (!text) return []
  
  // Remove common German stop words and clean the text
  const stopWords = new Set([
    'der', 'die', 'das', 'und', 'oder', 'aber', 'mit', 'ohne', 'für', 'von', 'zu', 'bei', 
    'nach', 'vor', 'über', 'unter', 'durch', 'gegen', 'ein', 'eine', 'einer', 'einem',
    'ist', 'sind', 'war', 'waren', 'hat', 'haben', 'wird', 'werden', 'kann', 'können',
    'wie', 'was', 'wo', 'wann', 'warum', 'wer', 'als', 'wenn', 'dass', 'weil', 'da',
    'so', 'auch', 'noch', 'nur', 'schon', 'dann', 'doch', 'aber', 'nicht', 'kein',
    'auf', 'an', 'in', 'im', 'am', 'um', 'es', 'sie', 'er', 'ich', 'du', 'wir', 'ihr'
  ])
  
  return text
    .toLowerCase()
    .replace(/[^a-zäöüß\s]/g, ' ') // Remove special characters except German umlauts
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .slice(0, 10) // Limit to 10 most relevant keywords
}

/**
 * Calculate keyword similarity between two texts
 */
export function calculateKeywordSimilarity(text1: string, text2: string): number {
  const keywords1 = extractKeywords(text1)
  const keywords2 = extractKeywords(text2)
  
  if (keywords1.length === 0 && keywords2.length === 0) return 100
  if (keywords1.length === 0 || keywords2.length === 0) return 0
  
  const commonKeywords = keywords1.filter(keyword => keywords2.includes(keyword))
  const uniqueKeywords = new Set([...keywords1, ...keywords2])
  
  return Math.round((commonKeywords.length / uniqueKeywords.size) * 100)
}

/**
 * Check for duplicate tricks based on multiple criteria
 */
export interface DuplicateCheckResult {
  isDuplicate: boolean
  similarTricks: Array<{
    trick: KITrick
    titleSimilarity: number
    descriptionSimilarity: number
    keywordSimilarity: number
    overallSimilarity: number
  }>
  highestSimilarity: number
}

export function checkForDuplicates(
  newTrick: Partial<KITrick>,
  existingTricks: KITrick[],
  thresholds = {
    title: 80,          // Title similarity threshold
    description: 70,    // Description similarity threshold
    keyword: 60,        // Keyword similarity threshold
    overall: 75         // Overall similarity threshold
  }
): DuplicateCheckResult {
  if (!newTrick.title || !newTrick.description) {
    return {
      isDuplicate: false,
      similarTricks: [],
      highestSimilarity: 0
    }
  }

  const similarTricks = existingTricks
    .map(trick => {
      const titleSimilarity = calculateSimilarity(newTrick.title!, trick.title)
      const descriptionSimilarity = calculateSimilarity(newTrick.description!, trick.description)
      const keywordSimilarity = calculateKeywordSimilarity(newTrick.description!, trick.description)
      
      // Weighted overall similarity (title has more weight)
      const overallSimilarity = Math.round(
        (titleSimilarity * 0.5) + (descriptionSimilarity * 0.3) + (keywordSimilarity * 0.2)
      )

      return {
        trick,
        titleSimilarity,
        descriptionSimilarity,
        keywordSimilarity,
        overallSimilarity
      }
    })
    .filter(result => 
      result.titleSimilarity >= thresholds.title ||
      result.descriptionSimilarity >= thresholds.description ||
      result.keywordSimilarity >= thresholds.keyword ||
      result.overallSimilarity >= thresholds.overall
    )
    .sort((a, b) => b.overallSimilarity - a.overallSimilarity)

  const highestSimilarity = similarTricks.length > 0 ? similarTricks[0].overallSimilarity : 0
  const isDuplicate = highestSimilarity >= thresholds.overall

  return {
    isDuplicate,
    similarTricks: similarTricks.slice(0, 5), // Return top 5 similar tricks
    highestSimilarity
  }
}

/**
 * Check for duplicates in pending tricks (same category)
 */
export function checkPendingDuplicates(
  newTrick: Partial<KITrick>,
  pendingTricks: any[]
): DuplicateCheckResult {
  // Convert pending tricks to KITrick format for consistency
  const formattedPendingTricks = pendingTricks
    .filter(trick => trick.category === newTrick.category) // Same category only
    .map(trick => ({
      ...trick,
      created_at: trick.created_at,
      updated_at: trick.updated_at,
      why_it_works: trick.why_it_works,
      status: trick.status || 'published',
      quality_score: trick.quality_score || null,
      view_count: trick.view_count || 0,
      published_at: trick.published_at || null
    })) as KITrick[]

  return checkForDuplicates(newTrick, formattedPendingTricks, {
    title: 85,          // Stricter for pending tricks
    description: 75,
    keyword: 65,
    overall: 80
  })
}

/**
 * Format duplicate check results for display to user
 */
export function formatDuplicateWarning(result: DuplicateCheckResult): string {
  if (!result.isDuplicate || result.similarTricks.length === 0) {
    return ''
  }

  const topSimilar = result.similarTricks[0]
  
  return `⚠️ Ähnlicher Trick gefunden: "${topSimilar.trick.title}" (${topSimilar.overallSimilarity}% Ähnlichkeit). Möchtest du trotzdem fortfahren?`
}

/**
 * Get suggestions to make trick more unique
 */
export function getUniquenessRecommendations(result: DuplicateCheckResult): string[] {
  if (!result.isDuplicate) return []

  const recommendations: string[] = []
  const topSimilar = result.similarTricks[0]

  if (topSimilar.titleSimilarity > 80) {
    recommendations.push('Versuche einen spezifischeren oder anderen Titel zu wählen')
  }

  if (topSimilar.descriptionSimilarity > 70) {
    recommendations.push('Ergänze die Beschreibung um einzigartige Details oder einen anderen Ansatz')
  }

  if (topSimilar.keywordSimilarity > 60) {
    recommendations.push('Verwende andere Schlüsselwörter oder betone unterschiedliche Aspekte')
  }

  if (recommendations.length === 0) {
    recommendations.push('Hebe die Unterschiede zu ähnlichen Tricks deutlicher hervor')
  }

  return recommendations
}