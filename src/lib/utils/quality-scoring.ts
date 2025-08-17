import { KITrick } from '@/lib/types/types'

export interface QualityScore {
  total: number
  breakdown: {
    textLength: number
    hasSteps: number
    hasExamples: number
    toolsSpecified: number
    formatting: number
    descriptionQuality: number
    titleQuality: number
  }
  category: 'excellent' | 'good' | 'fair' | 'poor'
  suggestions: string[]
}

/**
 * Comprehensive quality scoring algorithm for KI-Tricks
 * Scores range from 0-100 with detailed breakdown
 */
export function calculateQualityScore(trick: Partial<KITrick>): QualityScore {
  const scores = {
    textLength: 0,
    hasSteps: 0,
    hasExamples: 0,
    toolsSpecified: 0,
    formatting: 0,
    descriptionQuality: 0,
    titleQuality: 0
  }
  
  const suggestions: string[] = []

  // 1. Text Length Score (0-20 points)
  const titleLength = trick.title?.length || 0
  const descriptionLength = trick.description?.length || 0
  const totalTextLength = titleLength + descriptionLength

  if (totalTextLength >= 300) {
    scores.textLength = 20
  } else if (totalTextLength >= 200) {
    scores.textLength = 15
  } else if (totalTextLength >= 100) {
    scores.textLength = 10
  } else if (totalTextLength >= 50) {
    scores.textLength = 5
  } else {
    scores.textLength = 0
    suggestions.push('Erweitere die Beschreibung für mehr Details (mindestens 200 Zeichen empfohlen)')
  }

  // 2. Steps Score (0-25 points)
  const steps = trick.steps || []
  if (steps.length >= 4) {
    scores.hasSteps = 25
  } else if (steps.length >= 3) {
    scores.hasSteps = 20
  } else if (steps.length >= 2) {
    scores.hasSteps = 15
  } else if (steps.length >= 1) {
    scores.hasSteps = 10
  } else {
    scores.hasSteps = 0
    suggestions.push('Füge eine Schritt-für-Schritt-Anleitung hinzu (mindestens 3 Schritte empfohlen)')
  }

  // 3. Examples Score (0-20 points)
  const examples = trick.examples || []
  if (examples.length >= 3) {
    scores.hasExamples = 20
  } else if (examples.length >= 2) {
    scores.hasExamples = 15
  } else if (examples.length >= 1) {
    scores.hasExamples = 10
  } else {
    scores.hasExamples = 0
    suggestions.push('Ergänze praktische Beispiele für bessere Verständlichkeit')
  }

  // 4. Tools Specified Score (0-10 points)
  const tools = trick.tools || []
  if (tools.length >= 3) {
    scores.toolsSpecified = 10
  } else if (tools.length >= 2) {
    scores.toolsSpecified = 8
  } else if (tools.length >= 1) {
    scores.toolsSpecified = 5
  } else {
    scores.toolsSpecified = 0
    suggestions.push('Gib die verwendeten KI-Tools an')
  }

  // 5. Formatting Score (0-10 points)
  let formatScore = 0
  
  // Check title formatting
  if (trick.title) {
    if (trick.title.length >= 10 && trick.title.length <= 80) {
      formatScore += 3
    } else if (trick.title.length < 10) {
      suggestions.push('Titel sollte mindestens 10 Zeichen lang sein')
    } else {
      suggestions.push('Titel sollte nicht länger als 80 Zeichen sein')
    }
  }

  // Check if description has proper structure
  if (trick.description) {
    const sentences = trick.description.split(/[.!?]+/).filter(s => s.trim().length > 0)
    if (sentences.length >= 2) {
      formatScore += 3
    } else {
      suggestions.push('Verwende vollständige Sätze in der Beschreibung')
    }
    
    // Check for proper punctuation
    if (/[.!?]$/.test(trick.description.trim())) {
      formatScore += 2
    }
    
    // Bonus for paragraph structure
    if (trick.description.includes('\n') || sentences.length >= 3) {
      formatScore += 2
    }
  }

  scores.formatting = Math.min(formatScore, 10)

  // 6. Description Quality Score (0-10 points)
  if (trick.description) {
    let qualityScore = 0
    
    // Check for specific keywords that indicate quality
    const qualityKeywords = [
      'warum', 'weil', 'dadurch', 'beispiel', 'anwendung', 'praxis', 'ergebnis',
      'vorteil', 'nutzen', 'effektiv', 'effizient', 'optimier', 'verbesser',
      'automatisier', 'zeit', 'produktiv', 'quali'
    ]
    
    const description = trick.description.toLowerCase()
    const keywordMatches = qualityKeywords.filter(keyword => 
      description.includes(keyword)
    ).length
    
    qualityScore += Math.min(keywordMatches * 2, 6)
    
    // Check for explanatory content
    if (description.includes('funktioniert') || description.includes('prinzip')) {
      qualityScore += 2
    }
    
    // Check for actionable language
    if (/\b(schritt|anleitung|vorgehen|methode|strategie)\b/.test(description)) {
      qualityScore += 2
    }
    
    scores.descriptionQuality = Math.min(qualityScore, 10)
  } else {
    suggestions.push('Beschreibung fehlt komplett')
  }

  // 7. Title Quality Score (0-5 points)
  if (trick.title) {
    let titleScore = 0
    
    // Check for descriptive title
    const titleWords = trick.title.split(' ').filter(w => w.length > 2)
    if (titleWords.length >= 4) {
      titleScore += 2
    }
    
    // Check for action words
    const actionWords = ['trick', 'methode', 'strategie', 'anleitung', 'guide', 'tipp']
    if (actionWords.some(word => trick.title?.toLowerCase().includes(word))) {
      titleScore += 2
    }
    
    // Avoid generic titles
    const genericWords = ['ki', 'ai', 'chatgpt', 'claude']
    const nonGenericWords = titleWords.filter(word => 
      !genericWords.includes(word.toLowerCase())
    )
    if (nonGenericWords.length >= titleWords.length * 0.7) {
      titleScore += 1
    } else {
      suggestions.push('Verwende einen spezifischeren Titel')
    }
    
    scores.titleQuality = Math.min(titleScore, 5)
  } else {
    suggestions.push('Titel fehlt')
  }

  // Calculate total score
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0)

  // Determine category
  let category: QualityScore['category']
  if (total >= 85) {
    category = 'excellent'
  } else if (total >= 70) {
    category = 'good'
  } else if (total >= 50) {
    category = 'fair'
  } else {
    category = 'poor'
  }

  // Add category-specific suggestions
  if (category === 'poor') {
    suggestions.unshift('Dieser Trick benötigt deutliche Verbesserungen vor der Veröffentlichung')
  } else if (category === 'fair') {
    suggestions.unshift('Guter Grundlagen-Trick, kann aber mit einigen Verbesserungen noch besser werden')
  } else if (category === 'good') {
    suggestions.unshift('Sehr guter Trick! Nur kleine Verbesserungen nötig')
  } else {
    suggestions.unshift('Exzellenter Trick! Bereit für die Veröffentlichung')
  }

  return {
    total,
    breakdown: scores,
    category,
    suggestions: suggestions.slice(0, 5) // Limit to 5 most important suggestions
  }
}

/**
 * Get a human-readable quality assessment
 */
export function getQualityAssessment(score: QualityScore): {
  label: string
  color: string
  description: string
  recommendation: 'auto_approve' | 'manual_review' | 'needs_improvement' | 'reject'
} {
  switch (score.category) {
    case 'excellent':
      return {
        label: 'Exzellent',
        color: 'green',
        description: 'Hochwertige Einreichung mit umfassenden Details',
        recommendation: 'auto_approve'
      }
    case 'good':
      return {
        label: 'Gut',
        color: 'blue',
        description: 'Gute Qualität, kleine Verbesserungen möglich',
        recommendation: 'manual_review'
      }
    case 'fair':
      return {
        label: 'Ausreichend',
        color: 'yellow',
        description: 'Grundsolide, aber verbesserungswürdig',
        recommendation: 'needs_improvement'
      }
    case 'poor':
      return {
        label: 'Mangelhaft',
        color: 'red',
        description: 'Erhebliche Verbesserungen erforderlich',
        recommendation: 'reject'
      }
  }
}

/**
 * Generate improvement recommendations based on score breakdown
 */
export function generateImprovementPlan(score: QualityScore): {
  priority: 'high' | 'medium' | 'low'
  area: string
  action: string
  impact: string
}[] {
  const improvements: any[] = []
  
  // High priority improvements (low scores in important areas)
  if (score.breakdown.hasSteps < 15) {
    improvements.push({
      priority: 'high',
      area: 'Struktur',
      action: 'Füge eine detaillierte Schritt-für-Schritt-Anleitung hinzu',
      impact: 'Macht den Trick nachvollziehbar und umsetzbar'
    })
  }
  
  if (score.breakdown.textLength < 10) {
    improvements.push({
      priority: 'high',
      area: 'Inhalt',
      action: 'Erweitere die Beschreibung erheblich',
      impact: 'Bietet notwendigen Kontext und Details'
    })
  }
  
  // Medium priority improvements
  if (score.breakdown.hasExamples < 10) {
    improvements.push({
      priority: 'medium',
      area: 'Praxisbezug',
      action: 'Ergänze konkrete Anwendungsbeispiele',
      impact: 'Hilft Nutzern bei der praktischen Umsetzung'
    })
  }
  
  if (score.breakdown.descriptionQuality < 6) {
    improvements.push({
      priority: 'medium',
      area: 'Qualität',
      action: 'Erkläre das "Warum" hinter dem Trick',
      impact: 'Verbessert das Verständnis und die Glaubwürdigkeit'
    })
  }
  
  // Low priority improvements
  if (score.breakdown.toolsSpecified < 8) {
    improvements.push({
      priority: 'low',
      area: 'Metadaten',
      action: 'Spezifiziere alle verwendeten Tools',
      impact: 'Hilft bei der Kategorisierung und Auffindbarkeit'
    })
  }
  
  if (score.breakdown.formatting < 8) {
    improvements.push({
      priority: 'low',
      area: 'Format',
      action: 'Verbessere die Formatierung und Struktur',
      impact: 'Erhöht die Lesbarkeit und Professionalität'
    })
  }
  
  return improvements.slice(0, 4) // Return top 4 improvements
}

/**
 * Batch quality scoring for multiple tricks
 */
export function batchQualityScore(tricks: Partial<KITrick>[]): {
  average: number
  distribution: Record<QualityScore['category'], number>
  poorQuality: Partial<KITrick>[]
  excellentQuality: Partial<KITrick>[]
} {
  const scores = tricks.map(calculateQualityScore)
  
  const average = scores.reduce((sum, score) => sum + score.total, 0) / scores.length
  
  const distribution = {
    excellent: scores.filter(s => s.category === 'excellent').length,
    good: scores.filter(s => s.category === 'good').length,
    fair: scores.filter(s => s.category === 'fair').length,
    poor: scores.filter(s => s.category === 'poor').length
  }
  
  const poorQuality = tricks.filter((_, index) => scores[index].category === 'poor')
  const excellentQuality = tricks.filter((_, index) => scores[index].category === 'excellent')
  
  return {
    average: Math.round(average * 10) / 10,
    distribution,
    poorQuality,
    excellentQuality
  }
}