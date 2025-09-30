import fs from 'fs'
import path from 'path'

interface Note {
  title: string
  content: string
}

interface Lesson {
  id: string
  title: string
  url: string
  notes: Note[]
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

function parseMarkdownFile(filePath: string): Lesson[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lessons: Lesson[] = []

  // Split by lesson headers
  const lessonBlocks = content.split(/^## Lesson /gm).filter(Boolean)

  for (const block of lessonBlocks) {
    const lines = block.split('\n')

    // Extract lesson ID and title
    const firstLine = lines[0]
    const match = firstLine.match(/^(\d+): (.+)$/)
    if (!match) continue

    const [, id, title] = match

    // Extract URL
    const urlLine = lines.find(l => l.startsWith('**URL:**'))
    const url = urlLine?.replace('**URL:**', '').trim() || ''

    // Extract notes
    const notes: Note[] = []
    const noteRegex = /<note title="([^"]+)">([\s\S]*?)<\/note>/g
    let noteMatch

    while ((noteMatch = noteRegex.exec(block)) !== null) {
      notes.push({
        title: noteMatch[1],
        content: noteMatch[2].trim()
      })
    }

    if (notes.length > 0) {
      lessons.push({ id, title, url, notes })
    }
  }

  return lessons
}

function categoryMapping(noteTitle: string): string {
  const title = noteTitle.toLowerCase()

  if (title.includes('api') || title.includes('code') || title.includes('tool')) {
    return 'programming'
  }
  if (title.includes('prompt') || title.includes('output') || title.includes('content')) {
    return 'content-creation'
  }
  if (title.includes('eval') || title.includes('test') || title.includes('grading')) {
    return 'data-analysis'
  }
  if (title.includes('learn') || title.includes('overview') || title.includes('introduction')) {
    return 'learning'
  }

  return 'productivity'
}

function createSlug(title: string, index: number): string {
  return `${title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)}-${index}`
}

function extractSteps(content: string): string[] {
  const steps: string[] = []

  // Look for numbered steps
  const stepMatches = content.match(/(?:^|\n)(?:Step )?\d+[.):]\s*(.+)/gm)
  if (stepMatches) {
    steps.push(...stepMatches.map(s => s.replace(/^(?:Step )?\d+[.):]\s*/, '').trim()))
  }

  // Look for bullet points
  if (steps.length === 0) {
    const bulletMatches = content.match(/(?:^|\n)[-*]\s+(.+)/gm)
    if (bulletMatches) {
      steps.push(...bulletMatches.map(s => s.replace(/^[-*]\s+/, '').trim()).slice(0, 5))
    }
  }

  return steps.filter(Boolean)
}

function extractExamples(content: string): string[] {
  const examples: string[] = []

  // Look for example patterns
  const exampleMatches = content.match(/(?:Example|e\.g\.|For example)[:\s]+(.+?)(?:\n|$)/gi)
  if (exampleMatches) {
    examples.push(...exampleMatches.map(e => e.replace(/^(?:Example|e\.g\.|For example)[:\s]+/i, '').trim()))
  }

  return examples.slice(0, 3).filter(Boolean)
}

function extractWhyItWorks(content: string): string {
  // Look for explanatory sentences
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)

  // Find sentences with explanatory keywords
  const explanatory = sentences.find(s =>
    /(?:because|since|due to|allows|enables|helps|improves|optimizes)/i.test(s)
  )

  if (explanatory) {
    return explanatory.trim() + '.'
  }

  // Fallback: use first substantial sentence
  return sentences[0]?.trim() + '.' || 'Optimiert die Arbeit mit Claude API.'
}

function convertNotesToTricks(lessons: Lesson[]): KITrick[] {
  const tricks: KITrick[] = []
  let trickIndex = 0

  for (const lesson of lessons) {
    for (const note of lesson.notes) {
      const category = categoryMapping(note.title)
      const steps = extractSteps(note.content)
      const examples = extractExamples(note.content)
      const whyItWorks = extractWhyItWorks(note.content)

      // Create description from first 500 chars of content
      const description = note.content.substring(0, 500).trim() + '...\n\n**Warum es funktioniert:** ' + whyItWorks

      tricks.push({
        title: note.title,
        description,
        category,
        tools: ['Claude API', 'Anthropic'],
        steps: steps.length > 0 ? steps : ['Siehe Beschreibung für Details'],
        examples: examples.length > 0 ? examples : [],
        slug: createSlug(note.title, trickIndex++),
        why_it_works: whyItWorks
      })
    }
  }

  return tricks
}

async function main() {
  const inputPath = path.join(process.cwd(), 'docs', 'anthropic_course_lessons_COMPLETE_20250929_225000.md')
  const outputPath = path.join(process.cwd(), 'data', 'anthropic-tricks-english.json')

  console.log('📖 Lese Anthropic Course Lessons...')
  const lessons = parseMarkdownFile(inputPath)
  console.log(`✅ ${lessons.length} Lessons gefunden`)

  console.log('🔄 Konvertiere zu KI-Tricks Format...')
  const tricks = convertNotesToTricks(lessons)
  console.log(`✅ ${tricks.length} Tricks erstellt`)

  console.log('💾 Speichere Tricks...')
  fs.writeFileSync(outputPath, JSON.stringify(tricks, null, 2))
  console.log(`✅ Gespeichert: ${outputPath}`)

  console.log('\n📊 Kategorie-Verteilung:')
  const categoryCount: Record<string, number> = {}
  tricks.forEach(t => {
    categoryCount[t.category] = (categoryCount[t.category] || 0) + 1
  })
  Object.entries(categoryCount).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`)
  })
}

main()