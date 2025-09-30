import fs from 'fs'
import path from 'path'

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

function createSlug(title: string, index: number): string {
  return `${title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)}-${index}`
}

async function translateBatchWithZen(notes: Note[], batchNum: number): Promise<KITrick[]> {
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

OUTPUT: Antworte NUR mit einem validen JSON-Array ohne Markdown-Formatierung.`

  // Write prompt to temp file for MCP call
  const tempPromptFile = path.join(process.cwd(), 'data', `translate-batch-${batchNum}.txt`)
  fs.writeFileSync(tempPromptFile, prompt)

  console.log(`  📝 Prompt geschrieben: ${tempPromptFile}`)
  console.log(`  ⚠️  MANUELLER SCHRITT ERFORDERLICH:`)
  console.log(`  👉 Führe aus: mcp__zen-global__chat mit diesem Prompt`)
  console.log(`  👉 Modell: gemini-2.5-flash`)
  console.log(`  👉 Speichere Antwort in: data/translate-batch-${batchNum}-result.json`)
  console.log()

  // For now, return empty array - manual process needed
  return []
}

async function main() {
  const inputPath = path.join(process.cwd(), 'data', 'anthropic-notes-deduplicated.json')

  console.log('📖 Lade deduplizierte Notes...')
  const notes: Note[] = JSON.parse(fs.readFileSync(inputPath, 'utf-8'))
  console.log(`✅ ${notes.length} Notes geladen`)

  const batchSize = 5
  const totalBatches = Math.ceil(notes.length / batchSize)

  console.log(`\n🌍 Bereite ${totalBatches} Batches vor (je ${batchSize} Notes)...\n`)

  // Create prompt files for each batch
  for (let i = 0; i < notes.length; i += batchSize) {
    const batch = notes.slice(i, i + batchSize)
    const batchNum = Math.floor(i / batchSize) + 1

    console.log(`📦 Batch ${batchNum}/${totalBatches}`)
    await translateBatchWithZen(batch, batchNum)
  }

  console.log(`\n✅ Alle ${totalBatches} Batch-Prompts erstellt in data/`)
  console.log(`\n📋 NÄCHSTE SCHRITTE:`)
  console.log(`1. Für jeden Batch: Nutze mcp__zen-global__chat mit dem Prompt aus translate-batch-X.txt`)
  console.log(`2. Speichere jede Antwort als translate-batch-X-result.json`)
  console.log(`3. Führe dann aus: npx tsx scripts/merge-translated-batches.ts`)
}

main()