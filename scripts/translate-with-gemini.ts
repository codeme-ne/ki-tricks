import fs from 'fs'
import path from 'path'
import { GoogleGenerativeAI } from '@google/generative-ai'

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

async function translateBatch(notes: Note[], genAI: GoogleGenerativeAI): Promise<KITrick[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

  const prompt = `Du bist ein Experte für KI-Tools und übersetzt englische Anleitungen zu Claude API in strukturierte deutsche "KI-Tricks".

KATEGORIEN (wähle die passendste):
- programming: Code, API, technische Integration
- content-creation: Prompts, Text-Generation, Output-Kontrolle
- learning: Grundlagen, Konzepte, Best Practices
- productivity: Workflows, Optimierung, Effizienz
- data-analysis: Evaluierung, Testing, Datenverarbeitung
- business: Business-Anwendungen
- marketing: Marketing-Anwendungen
- design: UI/UX relevante Themen

AUFGABE: Übersetze diese ${notes.length} englischen Notes zu deutschen KI-Tricks.

Für jede Note erstelle ein JSON-Objekt mit:
- title: Deutscher Titel (prägnant, 5-10 Wörter)
- description: Deutsche Beschreibung (300-500 Zeichen) + "\\n\\n**Warum es funktioniert:** Erklärung"
- category: passende Kategorie aus obiger Liste
- tools: Array mit ["Claude API", "weitere relevante Tools"]
- steps: Array mit konkreten Schritten (3-7 Schritte)
- examples: Array mit Beispielen (0-3 Beispiele)
- why_it_works: Kurze Erklärung (1-2 Sätze) warum dieser Ansatz funktioniert

WICHTIG:
- Behalte technische Begriffe (API, JSON, prompt, token, etc.) bei
- Formuliere für deutsche Zielgruppe
- Extrahiere konkrete, umsetzbare Schritte

INPUT NOTES:
${JSON.stringify(notes, null, 2)}

OUTPUT: Antworte NUR mit einem validen JSON-Array. Keine Markdown-Formatierung, keine Erklärungen, nur das JSON-Array.`

  const result = await model.generateContent(prompt)
  const response = result.response
  const text = response.text()

  // Extract JSON from response
  let jsonText = text.trim()

  // Remove markdown code blocks if present
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/```json\n/, '').replace(/\n```$/, '')
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/```\n/, '').replace(/\n```$/, '')
  }

  try {
    return JSON.parse(jsonText)
  } catch (error) {
    console.error('❌ JSON Parse Error. Raw response:')
    console.error(text.substring(0, 500))
    throw error
  }
}

function createSlug(title: string, index: number): string {
  return `${title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)}-${index}`
}

async function main() {
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey || apiKey === 'your_google_api_key_here') {
    console.error('❌ Bitte setze GOOGLE_API_KEY in .env.local')
    process.exit(1)
  }

  const genAI = new GoogleGenerativeAI(apiKey)

  const inputPath = path.join(process.cwd(), 'data', 'anthropic-notes-deduplicated.json')
  const outputPath = path.join(process.cwd(), 'data', 'anthropic-tricks-german.json')

  console.log('📖 Lade deduplizierte Notes...')
  const notes: Note[] = JSON.parse(fs.readFileSync(inputPath, 'utf-8'))
  console.log(`✅ ${notes.length} Notes geladen`)

  const allTricks: KITrick[] = []
  const batchSize = 3 // Smaller batches for more reliable parsing

  console.log(`\n🌍 Übersetze in Batches von ${batchSize}...`)

  for (let i = 0; i < notes.length; i += batchSize) {
    const batch = notes.slice(i, i + batchSize)
    const batchNum = Math.floor(i / batchSize) + 1
    const totalBatches = Math.ceil(notes.length / batchSize)

    console.log(`\n📦 Batch ${batchNum}/${totalBatches} (${batch.length} Notes)...`)

    try {
      const tricks = await translateBatch(batch, genAI)

      // Add proper slugs
      tricks.forEach((trick, idx) => {
        trick.slug = createSlug(trick.title, i + idx)
      })

      allTricks.push(...tricks)
      console.log(`✅ ${tricks.length} Tricks übersetzt`)

      // Save progress after each batch
      fs.writeFileSync(outputPath + '.partial', JSON.stringify(allTricks, null, 2))

      // Rate limiting
      if (i + batchSize < notes.length) {
        console.log('⏳ Warte 3 Sekunden...')
        await new Promise(resolve => setTimeout(resolve, 3000))
      }
    } catch (error) {
      console.error(`❌ Fehler in Batch ${batchNum}:`, error)
      console.log(`💾 Fortschritt gespeichert: ${outputPath}.partial (${allTricks.length} Tricks)`)
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
    console.log(`     Schritte: ${trick.steps.length}`)
  })
}

main()