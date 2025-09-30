import fs from 'fs'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'

interface Note {
  title: string
  content: string
  lessonTitle: string
  lessonId: string
}

interface KITrick {
  title: string
  description: string
  category: string
  tools: string[]
  steps: string[]
  examples: string[]
  slug: string
  why_it_works: string
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const CATEGORIES = [
  'productivity', 'content-creation', 'programming',
  'design', 'data-analysis', 'learning', 'business', 'marketing'
]

async function translateBatch(notes: Note[]): Promise<KITrick[]> {
  const systemPrompt = `Du bist ein Experte für KI-Tools und übersetzt englische Anleitungen zu Claude API in strukturierte deutsche "KI-Tricks".

AUFGABE:
- Übersetze jeden Note ins Deutsche
- Erstelle strukturierte KI-Tricks im JSON-Format
- Behalte technische Begriffe (API, JSON, prompt, etc.) bei
- Passe Formulierungen für deutsche Zielgruppe an
- Extrahiere konkrete Schritte und Beispiele

KATEGORIEN (wähle die passendste):
- programming: Code, API, technische Integration
- content-creation: Prompts, Text-Generation, Output-Kontrolle
- learning: Grundlagen, Konzepte, Best Practices
- productivity: Workflows, Optimierung, Effizienz
- data-analysis: Evaluierung, Testing, Datenverarbeitung
- business: Business-Anwendungen
- marketing: Marketing-Anwendungen
- design: UI/UX relevante Themen

OUTPUT-FORMAT:
Gib ein JSON-Array mit KI-Tricks zurück. Jeder Trick hat:
{
  "title": "Deutscher Titel (prägnant)",
  "description": "Deutsche Beschreibung (300-500 Zeichen) + \n\n**Warum es funktioniert:** Erklärung",
  "category": "passende Kategorie",
  "tools": ["Claude API", "weitere relevante Tools"],
  "steps": ["Schritt 1", "Schritt 2", ...],
  "examples": ["Beispiel 1", "Beispiel 2"],
  "slug": "deutscher-slug",
  "why_it_works": "Kurze Erklärung warum dieser Ansatz funktioniert"
}`

  const userPrompt = `Übersetze diese ${notes.length} englischen Notes zu deutschen KI-Tricks:

${JSON.stringify(notes, null, 2)}

Antworte NUR mit einem validen JSON-Array.`

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 16000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type')
  }

  // Extract JSON from markdown code blocks if present
  let jsonText = content.text.trim()
  const jsonMatch = jsonText.match(/```json\n([\s\S]+?)\n```/)
  if (jsonMatch) {
    jsonText = jsonMatch[1]
  }

  return JSON.parse(jsonText)
}

function createSlug(title: string, index: number): string {
  return `${title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)}-${index}`
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY nicht gesetzt')
    process.exit(1)
  }

  const inputPath = path.join(process.cwd(), 'data', 'anthropic-notes-deduplicated.json')
  const outputPath = path.join(process.cwd(), 'data', 'anthropic-tricks-german.json')

  console.log('📖 Lade deduplizierte Notes...')
  const notes: Note[] = JSON.parse(fs.readFileSync(inputPath, 'utf-8'))
  console.log(`✅ ${notes.length} Notes geladen`)

  const allTricks: KITrick[] = []
  const batchSize = 5 // Process 5 notes at a time

  console.log(`\n🌍 Übersetze in Batches von ${batchSize}...`)

  for (let i = 0; i < notes.length; i += batchSize) {
    const batch = notes.slice(i, i + batchSize)
    const batchNum = Math.floor(i / batchSize) + 1
    const totalBatches = Math.ceil(notes.length / batchSize)

    console.log(`\n📦 Batch ${batchNum}/${totalBatches} (${batch.length} Notes)...`)

    try {
      const tricks = await translateBatch(batch)

      // Add proper slugs
      tricks.forEach((trick, idx) => {
        trick.slug = createSlug(trick.title, i + idx)
      })

      allTricks.push(...tricks)
      console.log(`✅ ${tricks.length} Tricks übersetzt`)

      // Rate limiting: wait 2s between batches
      if (i + batchSize < notes.length) {
        console.log('⏳ Warte 2 Sekunden...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    } catch (error) {
      console.error(`❌ Fehler in Batch ${batchNum}:`, error)
      // Save progress so far
      fs.writeFileSync(outputPath + '.partial', JSON.stringify(allTricks, null, 2))
      console.log(`💾 Fortschritt gespeichert: ${outputPath}.partial`)
      throw error
    }
  }

  console.log(`\n💾 Speichere finale ${allTricks.length} Tricks...`)
  fs.writeFileSync(outputPath, JSON.stringify(allTricks, null, 2))
  console.log(`✅ Gespeichert: ${outputPath}`)

  console.log('\n📊 Kategorie-Verteilung:')
  const categoryCount: Record<string, number> = {}
  allTricks.forEach(t => {
    categoryCount[t.category] = (categoryCount[t.category] || 0) + 1
  })
  Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`)
    })

  console.log('\n📝 Beispiel Tricks:')
  allTricks.slice(0, 3).forEach((trick, i) => {
    console.log(`\n  ${i + 1}. ${trick.title}`)
    console.log(`     Kategorie: ${trick.category}`)
    console.log(`     Tools: ${trick.tools.join(', ')}`)
  })
}

main()