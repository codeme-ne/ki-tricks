import fs from 'fs'
import path from 'path'
import { GoogleGenerativeAI } from '@google/generative-ai'

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

interface FilterResult {
  trick: KITrick
  passes: boolean
  reasoning: string
  scores: {
    conceptual_without_code: boolean
    achievable_in_web_ui: boolean
    solves_target_audience_problem: boolean
  }
}

async function evaluateTrick(trick: KITrick, genAI: GoogleGenerativeAI): Promise<FilterResult> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.3, // Lower for more consistent evaluation
    }
  })

  const prompt = `Du bist ein UX-Experte und evaluierst KI-Tricks für eine nicht-technische Zielgruppe (Marketing, Business, Content Creator).

ZIELGRUPPE:
- Deutsche Professionals ohne Programmierkenntnisse
- Nutzen Claude.ai, ChatGPT, Gemini im Web-UI
- Wollen schnelle Ergebnisse ohne Code
- **WICHTIG: Absolute Anfänger - alles muss sofort verständlich sein**

EVALUIERE diesen Trick nach 3 KRITERIEN (SEI STRENG!):

**1. CONCEPTUAL OHNE CODE?**
✅ Pass: Trick erklärt Konzepte, Prompt-Techniken, Workflows. Keine technischen Begriffe wie "API", "JSON", "Tokens", "Parameter"
❌ Fail: Zeigt Python/API Code, erfordert technisches Wissen, nutzt Entwickler-Jargon

**2. IM WEB-UI MACHBAR?**
✅ Pass: Nutzer können es SOFORT in Claude.ai/ChatGPT machen - einfach Copy&Paste oder Konzept anwenden
❌ Fail: Benötigt API-Keys, Entwicklungsumgebung, CLI, technische Setup-Schritte

**3. ZIELGRUPPEN-RELEVANT & EINFACH?**
✅ Pass: Löst echtes Problem der Zielgruppe (Content, Marketing, Business) UND ist für absolute Anfänger verständlich
❌ Fail: Nur für Entwickler interessant ODER zu komplex für Anfänger

**WICHTIG: Sei SEHR streng! Bei Zweifel → FAIL. Wir wollen nur die einfachsten 20-25 Tricks.**

---

**TRICK ZU EVALUIEREN:**

Titel: ${trick.title}
Beschreibung: ${trick.description}
Kategorie: ${trick.category}
Tools: ${trick.tools.join(', ')}

Schritte:
${trick.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

---

**ANTWORTE NUR mit diesem JSON-Format (kein Markdown):**

{
  "passes": true/false,
  "reasoning": "1-2 Sätze warum pass/fail",
  "scores": {
    "conceptual_without_code": true/false,
    "achievable_in_web_ui": true/false,
    "solves_target_audience_problem": true/false
  }
}`

  const result = await model.generateContent(prompt)
  const response = result.response.text().trim()

  // Extract JSON from response
  let jsonText = response
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/```json\n/, '').replace(/\n```$/, '')
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/```\n/, '').replace(/\n```$/, '')
  }

  try {
    const evaluation = JSON.parse(jsonText)
    return {
      trick,
      passes: evaluation.passes,
      reasoning: evaluation.reasoning,
      scores: evaluation.scores
    }
  } catch (error) {
    console.error('❌ JSON Parse Error. Raw response:')
    console.error(response.substring(0, 500))
    throw error
  }
}

async function main() {
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey || apiKey === 'your_google_api_key_here') {
    console.error('❌ Bitte setze GOOGLE_API_KEY in .env.local')
    process.exit(1)
  }

  const genAI = new GoogleGenerativeAI(apiKey)

  const inputPath = path.join(process.cwd(), 'data', 'anthropic-tricks-german.json')
  const outputPath = path.join(process.cwd(), 'data', 'anthropic-tricks-filtered.json')
  const reportPath = path.join(process.cwd(), 'data', 'filter-report.json')

  console.log('📖 Lade 70 Tricks...')
  const tricks: KITrick[] = JSON.parse(fs.readFileSync(inputPath, 'utf-8'))
  console.log(`✅ ${tricks.length} Tricks geladen\n`)

  const results: FilterResult[] = []
  const batchSize = 5 // Process in batches to avoid rate limits

  console.log(`🎯 Evaluiere Tricks in Batches von ${batchSize}...\n`)

  for (let i = 0; i < tricks.length; i += batchSize) {
    const batch = tricks.slice(i, i + batchSize)
    const batchNum = Math.floor(i / batchSize) + 1
    const totalBatches = Math.ceil(tricks.length / batchSize)

    console.log(`📦 Batch ${batchNum}/${totalBatches} (Tricks ${i + 1}-${i + batch.length})`)

    for (const trick of batch) {
      try {
        const result = await evaluateTrick(trick, genAI)
        results.push(result)

        const icon = result.passes ? '✅' : '❌'
        const scores = Object.values(result.scores).filter(Boolean).length
        console.log(`  ${icon} ${trick.title.substring(0, 50)}... (${scores}/3)`)

        // Small delay between individual evaluations
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`  ❌ Fehler bei "${trick.title}":`, error)
        // Continue with next trick
      }
    }

    // Save progress after each batch
    fs.writeFileSync(reportPath + '.partial', JSON.stringify(results, null, 2))

    // Rate limiting between batches
    if (i + batchSize < tricks.length) {
      console.log('  ⏳ Warte 3 Sekunden...\n')
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
  }

  // Filter passed tricks
  const passedTricks = results
    .filter(r => r.passes)
    .map(r => r.trick)

  // Save filtered tricks
  console.log(`\n💾 Speichere ${passedTricks.length} gefilterte Tricks...`)
  fs.writeFileSync(outputPath, JSON.stringify(passedTricks, null, 2))
  console.log(`✅ Gespeichert: ${outputPath}`)

  // Save full evaluation report
  console.log(`💾 Speichere Evaluation Report...`)
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2))
  console.log(`✅ Gespeichert: ${reportPath}`)

  // Statistics
  console.log('\n📊 EVALUATION RESULTS:')
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`Total Tricks:          ${tricks.length}`)
  console.log(`Passed Filter:         ${passedTricks.length} (${Math.round(passedTricks.length / tricks.length * 100)}%)`)
  console.log(`Failed Filter:         ${tricks.length - passedTricks.length}`)

  const criteriaStats = {
    conceptual: results.filter(r => r.scores.conceptual_without_code).length,
    webui: results.filter(r => r.scores.achievable_in_web_ui).length,
    relevant: results.filter(r => r.scores.solves_target_audience_problem).length
  }

  console.log(`\n📈 KRITERIEN-ERFOLG:`)
  console.log(`Conceptual ohne Code:  ${criteriaStats.conceptual}/${tricks.length} (${Math.round(criteriaStats.conceptual / tricks.length * 100)}%)`)
  console.log(`Im Web-UI machbar:     ${criteriaStats.webui}/${tricks.length} (${Math.round(criteriaStats.webui / tricks.length * 100)}%)`)
  console.log(`Zielgruppen-relevant:  ${criteriaStats.relevant}/${tricks.length} (${Math.round(criteriaStats.relevant / tricks.length * 100)}%)`)

  // Category breakdown
  console.log(`\n🏷️  KATEGORIEN (gefiltert):`)
  const categoryCount: Record<string, number> = {}
  passedTricks.forEach(t => {
    categoryCount[t.category] = (categoryCount[t.category] || 0) + 1
  })
  Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`)
    })

  // Show some passed examples
  console.log(`\n✅ BEISPIELE (PASSED):`)
  passedTricks.slice(0, 3).forEach((trick, i) => {
    console.log(`\n${i + 1}. ${trick.title}`)
    console.log(`   Kategorie: ${trick.category}`)
  })

  // Show some failed examples
  const failedTricks = results.filter(r => !r.passes)
  if (failedTricks.length > 0) {
    console.log(`\n❌ BEISPIELE (FAILED):`)
    failedTricks.slice(0, 3).forEach((result, i) => {
      console.log(`\n${i + 1}. ${result.trick.title}`)
      console.log(`   Grund: ${result.reasoning}`)
    })
  }

  console.log('\n✅ Fertig! Nächster Schritt: Transformation der gefilterten Tricks')
}

main()