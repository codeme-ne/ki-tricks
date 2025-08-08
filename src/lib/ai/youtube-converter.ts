import { KITrick, Category, Difficulty, Impact } from '../types/types'

// Interface für YouTube-Skript Struktur
interface YouTubeScript {
  text: string
  subtitles?: Array<{
    srtUrl?: string
    type?: string
    language?: string
    plaintext: string
  }>
  [key: string]: any
}

// Interface für extrahierte Tipps mit zusätzlicher Psychologie
interface ExtractedTip extends KITrick {
  psychologie: string
}

// Hilfsfunktion um Titel aus Transkript zu extrahieren
function extractTitleFromTranscript(content: string): string {
  // Suche nach wichtigen Aussagen im Transkript
  const keyPhrases = content.match(/(?:I call this|this is called|the trick is|my favorite|the secret|what I do is|the key is|here's how)[^.]+/gi)
  if (keyPhrases && keyPhrases.length > 0) {
    return keyPhrases[0].replace(/^(I call this|this is called|the trick is|my favorite|the secret|what I do is|the key is|here's how)\s*/i, '').trim()
  }
  
  // Fallback: Suche nach interessanten Zahlen/Fakten
  const facts = content.match(/\d+%|\d+x faster|\d+ hours?|\d+ minutes?|saves? \d+/gi)
  if (facts && facts.length > 0) {
    return `Der ${facts[0]} Trick`
  }
  
  return ''
}

// Extrahiere mehrere Tipps aus einem einzigen Transkript
function extractMultipleTipsFromTranscript(content: string, maxTipsPerVideo: number = 6): string[] {
  const tips: string[] = []
  
  // Teile Content in Absätze/Themen
  const sections = content.split(/\n\n|\. (?=[A-Z])/g)
  
  // Keywords die auf einen neuen Tipp hindeuten
  const tipIndicators = [
    'another thing', 'also', 'the next', 'secondly', 'thirdly',
    'one more', 'additionally', 'furthermore', 'moreover',
    'tip number', 'my advice', 'what I do', 'the trick',
    'the key', 'the secret', 'pro tip', 'best practice'
  ]
  
  let currentTip = ''
  sections.forEach(section => {
    const hasIndicator = tipIndicators.some(indicator => 
      section.toLowerCase().includes(indicator)
    )
    
    if (hasIndicator && currentTip.length > 200) {
      tips.push(currentTip)
      currentTip = section
    } else {
      currentTip += ' ' + section
    }
    
    // Wenn der aktuelle Tipp lang genug ist, speichere ihn
    if (currentTip.length > 500 && tips.length < maxTipsPerVideo) {
      tips.push(currentTip)
      currentTip = ''
    }
  })
  
  // Füge den letzten Tipp hinzu
  if (currentTip.length > 200) {
    tips.push(currentTip)
  }
  
  return tips.slice(0, maxTipsPerVideo)
}

// Hilfsfunktion zur Generierung einer eindeutigen ID
function generateId(title: string, index: number): string {
  const slug = title
    .toLowerCase()
    .replace(/[äöüß]/g, (char) => {
      const map: Record<string, string> = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }
      return map[char] || char
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  return `yt-${slug}-${index}`
}

// Hilfsfunktion zur Kategorisierung basierend auf Inhalt
function determineCategory(content: string): Category {
  const categoryKeywords: Record<Category, string[]> = {
    'productivity': ['produktivität', 'effizienz', 'zeitmanagement', 'automatisierung', 'workflow'],
    'content-creation': ['content', 'schreiben', 'video', 'social media', 'blog', 'artikel'],
    'programming': ['code', 'programmierung', 'entwicklung', 'api', 'script', 'software'],
    'design': ['design', 'ui', 'ux', 'grafik', 'visuell', 'layout'],
    'data-analysis': ['daten', 'analyse', 'statistik', 'dashboard', 'reporting', 'metrics'],
    'learning': ['lernen', 'bildung', 'training', 'wissen', 'studium', 'kurs'],
    'business': ['business', 'geschäft', 'strategie', 'management', 'führung', 'kunden'],
    'marketing': ['marketing', 'werbung', 'kampagne', 'brand', 'seo', 'conversion']
  }

  const lowerContent = content.toLowerCase()
  let bestMatch: Category = 'productivity'
  let highestScore = 0

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const score = keywords.filter(keyword => lowerContent.includes(keyword)).length
    if (score > highestScore) {
      highestScore = score
      bestMatch = category as Category
    }
  }

  return bestMatch
}

// Hilfsfunktion zur Bestimmung des Schwierigkeitsgrads
function determineDifficulty(steps: string[]): Difficulty {
  if (steps.length <= 3) return 'beginner'
  if (steps.length <= 5) return 'intermediate'
  return 'advanced'
}

// Hilfsfunktion zur Bestimmung des Impacts
function determineImpact(content: string): Impact {
  const highImpactKeywords = ['revolutionär', 'game-changer', 'massiv', 'erheblich', 'dramatisch']
  const mediumImpactKeywords = ['verbessern', 'optimieren', 'steigern', 'effizienter']
  
  const lowerContent = content.toLowerCase()
  
  if (highImpactKeywords.some(keyword => lowerContent.includes(keyword))) return 'high'
  if (mediumImpactKeywords.some(keyword => lowerContent.includes(keyword))) return 'medium'
  return 'low'
}

// Hilfsfunktion zur Bestimmung der benötigten Tools
function determineTools(content: string): string[] {
  const toolKeywords: Record<string, string[]> = {
    'Claude': ['claude', 'anthropic'],
    'ChatGPT': ['chatgpt', 'gpt', 'openai'],
    'Gemini': ['gemini', 'bard', 'google'],
    'Midjourney': ['midjourney', 'mj'],
    'DALL-E': ['dall-e', 'dalle'],
    'Stable Diffusion': ['stable diffusion', 'sd'],
    'GitHub Copilot': ['copilot', 'github'],
    'Perplexity': ['perplexity'],
    'Claude Code': ['claude code', 'coding assistant']
  }

  const lowerContent = content.toLowerCase()
  const tools: string[] = []

  for (const [tool, keywords] of Object.entries(toolKeywords)) {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      tools.push(tool)
    }
  }

  // Fallback zu Claude wenn keine Tools gefunden
  return tools.length > 0 ? tools : ['Claude']
}

// Hauptfunktion zur Extraktion von KI-Tipps aus einem Skript
function extractTipFromScript(script: YouTubeScript, index: number): ExtractedTip | null {
  try {
    // Extrahiere Content aus Transkript
    const content = script.subtitles?.[0]?.plaintext || script.text || ''
    if (!content) {
      console.warn(`Kein Content für Video ${index + 1} gefunden`)
      return null
    }
    
    // Extrahiere Titel aus dem Transkript oder verwende Fallback
    const title = extractTitleFromTranscript(content) || `KI-Tipp #${index + 1}`
    const id = generateId(title, index)
    const slug = id
    
    // Hook erstellen (erste 1-2 Sätze die neugierig machen)
    const sentences = content.split('.').filter(s => s.trim())
    const hook = sentences.slice(0, 2).join('.') + '.'
    
    // Psychologie extrahieren oder generieren
    const psychologie = generatePsychologie(content)
    
    // Schritte extrahieren oder generieren
    const steps = generateSteps(content)
    
    // Beispiele generieren
    const examples = generateExamples(content, title)
    
    // Metadaten bestimmen
    const category = determineCategory(content)
    const difficulty = determineDifficulty(steps)
    const impact = determineImpact(content)
    const tools = determineTools(content)
    const timeToImplement = `${steps.length * 5}-${steps.length * 10} Minuten`
    
    return {
      id,
      title,
      description: hook,
      category,
      difficulty,
      tools,
      timeToImplement,
      impact,
      steps,
      examples,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
      'Warum es funktioniert': psychologie,
      psychologie
    }
  } catch (error) {
    console.error(`Fehler beim Extrahieren von Tipp ${index}:`, error)
    return null
  }
}

// Generiere psychologische Begründung
function generatePsychologie(content: string): string {
  const psychologyPatterns = [
    'Dieser Tipp funktioniert, weil er die kognitive Last reduziert',
    'Die Methode nutzt das Prinzip der Automatisierung',
    'Durch die Strukturierung wird das Gehirn entlastet',
    'Die Technik basiert auf dem Prinzip der Mustererkennung',
    'Der Ansatz nutzt die Stärken der KI optimal aus'
  ]
  
  // Versuche spezifische Psychologie aus dem Inhalt zu extrahieren
  if (content.includes('spart Zeit')) {
    return 'Dieser Tipp funktioniert, weil er repetitive Aufgaben automatisiert und dadurch mentale Energie für kreative Arbeit freisetzt.'
  }
  if (content.includes('Qualität')) {
    return 'Die Methode verbessert die Konsistenz und reduziert menschliche Fehler durch systematische KI-Unterstützung.'
  }
  
  // Fallback zu einem zufälligen Pattern
  return psychologyPatterns[Math.floor(Math.random() * psychologyPatterns.length)]
}

// Generiere Schritte aus dem Inhalt
function generateSteps(content: string): string[] {
  const steps: string[] = []
  
  // Versuche nummerierte Schritte zu finden
  const numberedSteps = content.match(/\d+\.\s*[^.]+\./g)
  if (numberedSteps && numberedSteps.length > 0) {
    return numberedSteps.map(step => step.replace(/^\d+\.\s*/, 'Schritt: '))
  }
  
  // Fallback: Generiere generische Schritte basierend auf Schlüsselwörtern
  if (content.includes('prompt') || content.includes('Prompt')) {
    steps.push('Schritt 1: Öffne deine bevorzugte KI-Anwendung (Claude, ChatGPT, etc.)')
    steps.push('Schritt 2: Formuliere einen klaren und spezifischen Prompt')
    steps.push('Schritt 3: Gib relevanten Kontext und Beispiele an')
    steps.push('Schritt 4: Iteriere und verfeinere basierend auf den Ergebnissen')
  } else {
    steps.push('Schritt 1: Analysiere deine aktuelle Arbeitsweise')
    steps.push('Schritt 2: Identifiziere repetitive oder zeitaufwändige Aufgaben')
    steps.push('Schritt 3: Implementiere die KI-Lösung schrittweise')
    steps.push('Schritt 4: Teste und optimiere den Workflow')
  }
  
  return steps
}

// Neue Funktion: Erstelle strukturierten Tipp aus Content-Segment
function createTipFromContent(
  content: string, 
  globalIndex: number, 
  videoIndex: number, 
  segmentIndex: number
): ExtractedTip | null {
  try {
    // Extrahiere intelligenten Titel
    let title = extractSmartTitle(content)
    if (!title) {
      title = `KI-Power-Trick #${globalIndex + 1}`
    }
    
    const id = generateId(title, globalIndex)
    const slug = id
    
    // Erstelle packenden Hook
    const hook = generateSmartHook(content)
    
    // Generiere überzeugende Psychologie
    const psychologie = generateSmartPsychologie(content)
    
    // Erstelle konkrete Schritte
    const steps = generateSmartSteps(content)
    
    // Generiere relevante Beispiele
    const examples = generateSmartExamples(content, title)
    
    // Intelligente Metadaten
    const category = determineSmartCategory(content, videoIndex)
    const difficulty = determineSmartDifficulty(content, steps)
    const impact = determineSmartImpact(content)
    const tools = determineSmartTools(content)
    const timeToImplement = calculateSmartTime(steps, difficulty)
    
    return {
      id,
      title,
      description: hook,
      category,
      difficulty,
      tools,
      timeToImplement,
      impact,
      steps,
      examples,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
      'Warum es funktioniert': psychologie,
      psychologie
    }
  } catch (error) {
    console.error(`Fehler beim Erstellen von Tipp ${globalIndex}:`, error)
    return null
  }
}

// Intelligente Titel-Extraktion
function extractSmartTitle(content: string): string {
  // Suche nach konkreten Techniken/Methoden
  const techniques = content.match(/(?:technique|method|approach|strategy|framework|system|process|workflow|hack|trick)\s+(?:is|called|I call)\s+([^.]+)/i)
  if (techniques) {
    return techniques[1].trim().substring(0, 80)
  }
  
  // Suche nach Zahlen-basierten Aussagen
  const numbers = content.match(/(\d+%\s+of\s+[^.]+|saves?\s+\d+\s+[^.]+|\d+x\s+(?:faster|better|more)[^.]+)/i)
  if (numbers) {
    return `Der ${numbers[0]}-Trick`
  }
  
  // Suche nach Superlativen
  const superlatives = content.match(/(?:the\s+)?(?:best|biggest|most\s+important|key|secret|main)\s+([^.]+)/i)
  if (superlatives) {
    return superlatives[1].trim().substring(0, 80)
  }
  
  return ''
}

// Generiere packenden Hook
function generateSmartHook(content: string): string {
  // Suche nach überraschenden Fakten
  const surprisingFacts = [
    /we\s+(?:recently\s+)?merged?\s+(\d+[^.]+)/i,
    /(\d+%\s+of\s+[^.]+don't\s+know[^.]+)/i,
    /saves?\s+(\d+\s+hours?[^.]+)/i,
    /(\d+x\s+(?:faster|better)[^.]+)/i
  ]
  
  for (const pattern of surprisingFacts) {
    const match = content.match(pattern)
    if (match) {
      return match[0].trim() + ' - und du kannst das auch!'
    }
  }
  
  // Erstelle Hook aus erstem interessanten Satz
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
  if (sentences.length > 0) {
    const firstSentence = sentences[0].trim()
    if (firstSentence.length > 150) {
      return firstSentence.substring(0, 147) + '...'
    }
    return firstSentence
  }
  
  return 'Entdecke einen revolutionären KI-Trick, der deine Arbeitsweise transformiert'
}

// Generiere überzeugende Psychologie
function generateSmartPsychologie(content: string): string {
  // Analysiere Content für psychologische Muster
  if (content.includes('save') && content.includes('time')) {
    return 'Dieser Trick funktioniert, weil er repetitive mentale Prozesse automatisiert und damit kognitive Ressourcen für kreative und strategische Aufgaben freisetzt.'
  }
  
  if (content.includes('trust') || content.includes('confidence')) {
    return 'Die Methode nutzt das psychologische Prinzip der schrittweisen Vertrauensbildung - durch kleine, verifizierbare Erfolge baut sich Kompetenz und Selbstvertrauen auf.'
  }
  
  if (content.includes('exponential') || content.includes('scale')) {
    return 'Dieser Ansatz nutzt das Prinzip der exponentiellen Skalierung - kleine Optimierungen führen zu überproportional großen Zeitersparnissen.'
  }
  
  if (content.includes('pattern') || content.includes('framework')) {
    return 'Das Gehirn liebt Muster und Strukturen. Diese Methode reduziert die kognitive Last durch klare, wiederholbare Prozesse.'
  }
  
  // Fallback mit Content-Analyse
  const hasNumbers = /\d+/.test(content)
  if (hasNumbers) {
    return 'Konkrete Zahlen und messbare Ergebnisse aktivieren das Belohnungszentrum im Gehirn und motivieren zur sofortigen Umsetzung.'
  }
  
  return 'Diese Technik funktioniert durch die Aktivierung mehrerer kognitiver Systeme gleichzeitig, was zu tieferem Verständnis und besseren Ergebnissen führt.'
}

// Generiere konkrete Schritte
function generateSmartSteps(content: string): string[] {
  const steps: string[] = []
  
  // Suche nach expliziten Schritten im Content
  const explicitSteps = content.match(/(?:step\s+\d+|first|second|third|then|next|finally)[:\s]+([^.]+)/gi)
  if (explicitSteps && explicitSteps.length >= 3) {
    return explicitSteps.map((step, index) => {
      const cleaned = step.replace(/^(step\s+\d+|first|second|third|then|next|finally)[:\s]+/i, '')
      return `Schritt ${index + 1}: ${cleaned.trim()}`
    }).slice(0, 6)
  }
  
  // Analysiere Content-Typ und erstelle passende Schritte
  if (content.includes('vibe cod') || content.includes('programming')) {
    steps.push('Schritt 1: Sammle alle relevanten Kontext-Informationen und Requirements in einem Dokument')
    steps.push('Schritt 2: Erstelle gemeinsam mit der KI einen detaillierten Implementierungsplan')
    steps.push('Schritt 3: Lasse die KI den Code generieren und fokussiere dich auf die Verifikation')
    steps.push('Schritt 4: Teste die kritischen Pfade und Edge Cases gründlich')
  } else if (content.includes('prompt') || content.includes('Claude')) {
    steps.push('Schritt 1: Definiere dein Ziel kristallklar in einem Satz')
    steps.push('Schritt 2: Gib der KI relevanten Kontext und Beispiele')
    steps.push('Schritt 3: Nutze iterative Verfeinerung statt einmaliger Prompts')
    steps.push('Schritt 4: Verifiziere und optimiere das Ergebnis')
  } else if (content.includes('learn') || content.includes('student')) {
    steps.push('Schritt 1: Identifiziere deine Wissenslücken mit KI-Hilfe')
    steps.push('Schritt 2: Lasse dir komplexe Konzepte in einfachen Worten erklären')
    steps.push('Schritt 3: Erstelle interaktive Übungen und Beispiele')
    steps.push('Schritt 4: Nutze die Feynman-Technik: Erkläre es der KI zurück')
  } else {
    // Generische aber nützliche Schritte
    steps.push('Schritt 1: Analysiere deinen aktuellen Workflow und identifiziere Zeitfresser')
    steps.push('Schritt 2: Definiere klare Erfolgskriterien für die KI-Integration')
    steps.push('Schritt 3: Starte mit einem kleinen Pilotprojekt zum Testen')
    steps.push('Schritt 4: Skaliere schrittweise basierend auf den Ergebnissen')
  }
  
  return steps
}

// Generiere relevante Beispiele
function generateSmartExamples(content: string, title: string): string[] {
  const examples: string[] = []
  
  // Suche nach konkreten Beispielen im Content
  const realExamples = content.match(/(?:for example|for instance|like when|such as)[:\s]+([^.]+)/gi)
  if (realExamples && realExamples.length > 0) {
    realExamples.forEach((ex, index) => {
      const cleaned = ex.replace(/^(for example|for instance|like when|such as)[:\s]+/i, '')
      examples.push(`Beispiel ${index + 1}: ${cleaned.trim()}`)
    })
    return examples.slice(0, 3)
  }
  
  // Generiere Beispiele basierend auf Content-Typ
  if (content.includes('22,000') || content.includes('22000')) {
    examples.push('Beispiel 1: Anthropic mergte 22.000 Zeilen KI-generierten Code erfolgreich in Production')
    examples.push('Beispiel 2: Refactoring eines Legacy-Systems mit 80% Zeitersparnis')
  } else if (content.includes('startup')) {
    examples.push('Beispiel 1: MVP in 48 Stunden statt 2 Wochen entwickelt')
    examples.push('Beispiel 2: Automatisierung des Customer Onboardings spart 5 Stunden pro Woche')
  } else if (content.includes('student')) {
    examples.push('Beispiel 1: Komplexe Mathematik-Konzepte in 30 Minuten statt 3 Stunden verstehen')
    examples.push('Beispiel 2: Research Paper in 2 Tagen statt 2 Wochen fertigstellen')
  } else {
    // Generische aber realistische Beispiele
    examples.push(`Beispiel 1: ${title} reduziert Bearbeitungszeit um 70%`)
    examples.push(`Beispiel 2: Team-Produktivität steigt durch ${title} um 40%`)
  }
  
  return examples.slice(0, 2)
}

// Intelligente Kategorie-Bestimmung
function determineSmartCategory(content: string, videoIndex: number): Category {
  // Video-spezifische Kategorisierung
  const videoCategories: Record<number, Category> = {
    0: 'programming', // Vibe Coding
    1: 'productivity', // Claude Code Best Practices
    2: 'business', // Startup Innovation
    3: 'learning', // KI Essentials
    4: 'learning', // Student Innovation
    5: 'productivity', // 50% Workload
    6: 'content-creation' // Emotional KI
  }
  
  if (videoCategories[videoIndex]) {
    return videoCategories[videoIndex]
  }
  
  // Fallback zur Content-Analyse
  return determineCategory(content)
}

// Intelligente Schwierigkeits-Bestimmung
function determineSmartDifficulty(content: string, steps: string[]): Difficulty {
  if (content.includes('beginner') || content.includes('basics') || content.includes('getting started')) {
    return 'beginner'
  }
  
  if (content.includes('advanced') || content.includes('expert') || content.includes('complex')) {
    return 'advanced'
  }
  
  // Basierend auf Schritt-Komplexität
  if (steps.length <= 3) return 'beginner'
  if (steps.length <= 5) return 'intermediate'
  return 'advanced'
}

// Intelligente Impact-Bestimmung
function determineSmartImpact(content: string): Impact {
  // Suche nach Impact-Indikatoren
  const highImpactPatterns = [
    /\d{3,}%/,  // 100%+ Verbesserung
    /\d+x\s+(?:faster|better)/i,
    /game.?changer/i,
    /revolutionary/i,
    /transform/i,
    /exponential/i
  ]
  
  const mediumImpactPatterns = [
    /\d{2}%/,  // 10-99% Verbesserung
    /save.+hours?/i,
    /improve/i,
    /optimize/i,
    /enhance/i
  ]
  
  for (const pattern of highImpactPatterns) {
    if (pattern.test(content)) return 'high'
  }
  
  for (const pattern of mediumImpactPatterns) {
    if (pattern.test(content)) return 'medium'
  }
  
  return 'low'
}

// Intelligente Tool-Erkennung
function determineSmartTools(content: string): string[] {
  const tools: string[] = []
  
  // Erweiterte Tool-Erkennung
  const toolPatterns: Record<string, RegExp[]> = {
    'Claude': [/claude/i, /anthropic/i, /claude.ai/i],
    'Claude Code': [/claude code/i, /clawed code/i, /cloud code/i],
    'ChatGPT': [/chatgpt/i, /gpt/i, /openai/i],
    'Cursor': [/cursor/i],
    'GitHub Copilot': [/copilot/i, /github/i],
    'VS Code': [/vs code/i, /visual studio code/i],
    'Gemini': [/gemini/i, /bard/i, /google ai/i]
  }
  
  for (const [tool, patterns] of Object.entries(toolPatterns)) {
    if (patterns.some(pattern => pattern.test(content))) {
      tools.push(tool)
    }
  }
  
  // Fallback basierend auf Video-Kontext
  if (tools.length === 0) {
    if (content.includes('code') || content.includes('programming')) {
      tools.push('Claude Code')
    } else {
      tools.push('Claude')
    }
  }
  
  return [...new Set(tools)] // Entferne Duplikate
}

// Berechne realistische Zeit
function calculateSmartTime(steps: string[], difficulty: Difficulty): string {
  const baseTime = steps.length * 5
  const difficultyMultiplier = {
    'beginner': 1,
    'intermediate': 1.5,
    'advanced': 2
  }
  
  const minTime = Math.round(baseTime * difficultyMultiplier[difficulty])
  const maxTime = Math.round(minTime * 1.5)
  
  return `${minTime}-${maxTime} Minuten`
}

// Generiere Beispiele
function generateExamples(content: string, title: string): string[] {
  const examples: string[] = []
  
  // Versuche spezifische Beispiele basierend auf Kategorie zu generieren
  if (content.includes('E-Mail') || content.includes('email')) {
    examples.push('Beispiel 1: Automatische Zusammenfassung von langen E-Mail-Threads')
    examples.push('Beispiel 2: Generierung professioneller Antworten auf Kundenanfragen')
  } else if (content.includes('Code') || content.includes('Programmierung')) {
    examples.push('Beispiel 1: Generierung von Unit-Tests für bestehenden Code')
    examples.push('Beispiel 2: Refactoring von Legacy-Code mit KI-Unterstützung')
  } else if (content.includes('Content') || content.includes('Artikel')) {
    examples.push('Beispiel 1: Erstellung von SEO-optimierten Blogartikeln')
    examples.push('Beispiel 2: Generierung von Social-Media-Posts aus längeren Texten')
  } else {
    // Generische Beispiele
    examples.push(`Beispiel 1: Anwendung für ${title.toLowerCase()}`)
    examples.push(`Beispiel 2: Integration in bestehende Workflows`)
  }
  
  return examples
}

// Hauptfunktion zur Konvertierung von YouTube-Skripten zu KI-Tipps
export async function convertYouTubeScriptsToTips(
  scripts: YouTubeScript[],
  maxTips: number = 40
): Promise<ExtractedTip[]> {
  const allTips: ExtractedTip[] = []
  let globalTipIndex = 0
  
  // Verarbeite jedes Skript und extrahiere mehrere Tipps
  for (let scriptIndex = 0; scriptIndex < scripts.length && allTips.length < maxTips; scriptIndex++) {
    const script = scripts[scriptIndex]
    const content = script.subtitles?.[0]?.plaintext || script.text || ''
    
    if (!content) continue
    
    // Extrahiere mehrere Tipp-Segmente aus dem Transkript
    const tipSegments = extractMultipleTipsFromTranscript(content)
    
    // Erstelle aus jedem Segment einen strukturierten Tipp
    for (let segmentIndex = 0; segmentIndex < tipSegments.length && allTips.length < maxTips; segmentIndex++) {
      const tipContent = tipSegments[segmentIndex]
      const tip = createTipFromContent(tipContent, globalTipIndex, scriptIndex, segmentIndex)
      
      if (tip) {
        allTips.push(tip)
        globalTipIndex++
      }
    }
  }
  
  // Sortiere nach Impact und Schwierigkeit
  allTips.sort((a, b) => {
    const impactOrder = { high: 3, medium: 2, low: 1 }
    const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 }
    
    // Erst nach Impact, dann nach Schwierigkeit
    const impactDiff = impactOrder[b.impact] - impactOrder[a.impact]
    if (impactDiff !== 0) return impactDiff
    
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
  })
  
  // Begrenze auf maxTips
  return allTips.slice(0, maxTips)
}

// Hilfsfunktion zum Lesen der YouTube-Skripte JSON
export async function loadYouTubeScripts(filePath: string): Promise<YouTubeScript[]> {
  try {
    const fs = await import('fs/promises')
    const content = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(content)
    
    // Handle verschiedene JSON-Strukturen
    if (Array.isArray(data)) {
      return data
    } else if (data.scripts && Array.isArray(data.scripts)) {
      return data.scripts
    } else if (data.videos && Array.isArray(data.videos)) {
      return data.videos
    }
    
    // Fallback: Versuche das Objekt in ein Array zu konvertieren
    return Object.values(data)
  } catch (error) {
    console.error('Fehler beim Laden der YouTube-Skripte:', error)
    throw error
  }
}

// Funktion zum Speichern der generierten Tipps
export async function saveTipsToFile(tips: ExtractedTip[], outputPath: string): Promise<void> {
  try {
    const fs = await import('fs/promises')
    
    // Entferne die psychologie-Eigenschaft für die finale Ausgabe
    const cleanTips = tips.map(({ psychologie, ...tip }) => ({
      ...tip,
      // Füge die Psychologie als ersten Punkt in die Beschreibung ein
      description: `${tip.description}\n\n**Warum es funktioniert:** ${psychologie}`
    }))
    
    await fs.writeFile(outputPath, JSON.stringify(cleanTips, null, 2))
    console.log(`${tips.length} Tipps erfolgreich gespeichert in ${outputPath}`)
  } catch (error) {
    console.error('Fehler beim Speichern der Tipps:', error)
    throw error
  }
}

// Export für die Verwendung im Admin-Interface
export type { ExtractedTip }