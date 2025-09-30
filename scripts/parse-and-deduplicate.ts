import fs from 'fs'
import path from 'path'

interface Note {
  title: string
  content: string
  lessonTitle: string
  lessonId: string
}

interface GroupedNote {
  groupKey: string
  notes: Note[]
  bestNote: Note
}

function parseMarkdownFile(filePath: string): Note[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const notes: Note[] = []

  // Split by lesson headers
  const lessonBlocks = content.split(/^## Lesson /gm).filter(Boolean)

  for (const block of lessonBlocks) {
    const lines = block.split('\n')
    const firstLine = lines[0]
    const match = firstLine.match(/^(\d+): (.+)$/)
    if (!match) continue

    const [, lessonId, lessonTitle] = match

    // Extract notes
    const noteRegex = /<note title="([^"]+)">([\s\S]*?)<\/note>/g
    let noteMatch

    while ((noteMatch = noteRegex.exec(block)) !== null) {
      notes.push({
        title: noteMatch[1],
        content: noteMatch[2].trim(),
        lessonTitle,
        lessonId
      })
    }
  }

  return notes
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function getKeywords(text: string): Set<string> {
  const keywords = text
    .toLowerCase()
    .match(/\b[a-z]{4,}\b/g) || []

  return new Set(keywords)
}

function calculateSimilarity(title1: string, title2: string, content1: string, content2: string): number {
  const norm1 = normalizeTitle(title1)
  const norm2 = normalizeTitle(title2)

  // Exact title match
  if (norm1 === norm2) return 1.0

  // Title contains other
  if (norm1.includes(norm2) || norm2.includes(norm1)) return 0.8

  // Keyword overlap
  const keywords1 = getKeywords(title1 + ' ' + content1.substring(0, 500))
  const keywords2 = getKeywords(title2 + ' ' + content2.substring(0, 500))

  const intersection = new Set([...keywords1].filter(k => keywords2.has(k)))
  const union = new Set([...keywords1, ...keywords2])

  return intersection.size / union.size
}

function groupSimilarNotes(notes: Note[], threshold: number = 0.5): GroupedNote[] {
  const groups: Map<string, Note[]> = new Map()
  const processed = new Set<number>()

  for (let i = 0; i < notes.length; i++) {
    if (processed.has(i)) continue

    const currentNote = notes[i]
    const groupKey = normalizeTitle(currentNote.title)
    const group: Note[] = [currentNote]
    processed.add(i)

    // Find similar notes
    for (let j = i + 1; j < notes.length; j++) {
      if (processed.has(j)) continue

      const similarity = calculateSimilarity(
        currentNote.title,
        notes[j].title,
        currentNote.content,
        notes[j].content
      )

      if (similarity >= threshold) {
        group.push(notes[j])
        processed.add(j)
      }
    }

    groups.set(groupKey, group)
  }

  // Select best note from each group (longest content = most detailed)
  const groupedNotes: GroupedNote[] = []

  for (const [groupKey, groupNotes] of groups) {
    const bestNote = groupNotes.reduce((best, current) =>
      current.content.length > best.content.length ? current : best
    )

    groupedNotes.push({
      groupKey,
      notes: groupNotes,
      bestNote
    })
  }

  return groupedNotes
}

function scoreNoteQuality(note: Note): number {
  let score = 0

  // Length score (longer = more detailed)
  if (note.content.length > 1000) score += 3
  else if (note.content.length > 500) score += 2
  else if (note.content.length > 200) score += 1

  // Has structured content
  if (note.content.match(/\d+[.):]/)) score += 2 // Numbered lists
  if (note.content.match(/^[-*]/m)) score += 1 // Bullet points
  if (note.content.match(/Example|e\.g\./i)) score += 2 // Examples

  // Practical vs theoretical
  if (note.content.match(/\b(code|api|function|script|command)\b/i)) score += 2
  if (note.content.match(/\b(workflow|process|step|implement)\b/i)) score += 1

  return score
}

function selectTopNotes(groupedNotes: GroupedNote[], targetCount: number): Note[] {
  // Calculate quality score for each group's best note
  const scored = groupedNotes.map(group => ({
    note: group.bestNote,
    score: scoreNoteQuality(group.bestNote),
    groupSize: group.notes.length
  }))

  // Sort by score (descending)
  scored.sort((a, b) => b.score - a.score)

  // Take top N
  return scored.slice(0, targetCount).map(s => s.note)
}

async function main() {
  const inputPath = path.join(process.cwd(), 'docs', 'anthropic_course_lessons_COMPLETE_20250929_225000.md')
  const outputPath = path.join(process.cwd(), 'data', 'anthropic-notes-deduplicated.json')

  console.log('📖 Parse Markdown...')
  const allNotes = parseMarkdownFile(inputPath)
  console.log(`✅ ${allNotes.length} Notes gefunden`)

  console.log('\n🔍 Gruppiere ähnliche Notes...')
  const grouped = groupSimilarNotes(allNotes, 0.5)
  console.log(`✅ ${grouped.length} einzigartige Themen-Gruppen`)

  console.log('\n⭐ Wähle beste Notes aus...')
  const topNotes = selectTopNotes(grouped, 70)
  console.log(`✅ ${topNotes.length} hochwertige Notes ausgewählt`)

  console.log('\n💾 Speichere...')
  fs.writeFileSync(outputPath, JSON.stringify(topNotes, null, 2))
  console.log(`✅ Gespeichert: ${outputPath}`)

  console.log('\n📊 Statistik:')
  console.log(`  Original: ${allNotes.length} Notes`)
  console.log(`  Gruppiert: ${grouped.length} Themen`)
  console.log(`  Ausgewählt: ${topNotes.length} Top-Notes`)
  console.log(`  Reduktion: ${Math.round((1 - topNotes.length / allNotes.length) * 100)}%`)

  // Preview first 5 titles
  console.log('\n📝 Beispiel Titel:')
  topNotes.slice(0, 5).forEach((note, i) => {
    console.log(`  ${i + 1}. ${note.title}`)
  })
}

main()