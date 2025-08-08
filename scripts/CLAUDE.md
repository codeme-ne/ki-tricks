# Scripts - CLAUDE.md

Dieses Verzeichnis enthält Utility-Scripts für die Content-Generierung und -Konvertierung.

## Überblick

```
scripts/
├── convert-youtube-tips.ts    # YouTube → KI-Tricks Konverter
└── README.md                  # Script-Dokumentation
```

## convert-youtube-tips.ts

### Zweck
Konvertiert YouTube-Transkripte und andere Content-Quellen in strukturierte KI-Tricks für die Platform.

### Funktionsweise
```typescript
interface YouTubeTranscript {
  title: string
  transcript: string
  channel: string
  duration: number
  url?: string
}

async function convertYouTubeToTricks(
  transcripts: YouTubeTranscript[]
): Promise<KITrick[]>
```

### Konvertierungs-Pipeline

1. **Title Extraction**
   - Sucht nach Patterns wie "Trick #X", "Tipp Nummer Y"
   - Generiert catchy Titel aus Kontext
   - Max 100 Zeichen, optimiert für Aufmerksamkeit

2. **Category Mapping**
   ```typescript
   const categoryKeywords = {
     programming: ['code', 'entwicklung', 'github', 'api'],
     productivity: ['zeit', 'effizienz', 'workflow', 'automatisierung'],
     learning: ['lernen', 'studium', 'wissen', 'verstehen'],
     // ...
   }
   ```

3. **Psychology Hook Generation**
   - Analysiert Kontext für wissenschaftliche Erklärung
   - Templates:
     - "Nutzt das Prinzip der [Psychologie-Konzept]"
     - "Basiert auf [Wissenschaftliche Studie/Theorie]"
     - "Aktiviert [Gehirnbereich/Kognitive Funktion]"

4. **Steps Extraction**
   - Identifiziert Handlungsanweisungen
   - Konvertiert zu 4 konkrete Schritte
   - Beginnt mit Aktionsverb
   - Zeitangaben wo möglich

5. **Examples Creation**
   - Sucht nach Erfolgsgeschichten
   - Generiert messbare Resultate
   - Format: "Vorher X → Nachher Y"

### Verwendung

```bash
# TypeScript direkt ausführen
npx tsx scripts/convert-youtube-tips.ts

# Mit Node.js (kompiliert)
npm run build:scripts
node scripts/convert-youtube-tips.js
```

### Input-Formate

#### 1. YouTube Transcript JSON
```json
{
  "title": "Die besten KI-Tricks für Entwickler",
  "channel": "TechTalk DE",
  "transcript": "Heute zeige ich euch...",
  "duration": 1234,
  "url": "https://youtube.com/..."
}
```

#### 2. Markdown mit Timestamps
```markdown
00:00 Intro
00:30 Trick 1: Vibe Coding erklärt
02:45 Beispiel: 22.000 Zeilen Code
...
```

#### 3. Plain Text
```
In diesem Video erkläre ich drei revolutionäre KI-Tricks...
```

### Output-Format

Generiert `generated-ki-tips.json`:
```json
[
  {
    "id": "yt-trick-1",
    "title": "Der 5-Minuten KI-Agent Trick",
    "description": "Erstelle komplexe KI-Agenten...\n\n**Warum es funktioniert:** ...",
    "category": "programming",
    "difficulty": "intermediate",
    "tools": ["Claude", "Claude Code"],
    "timeToImplement": "5-10 Minuten",
    "impact": "high",
    "steps": [...],
    "examples": [...],
    "slug": "der-5-minuten-ki-agent-trick",
    "createdAt": "2025-08-01T10:00:00Z",
    "updatedAt": "2025-08-01T10:00:00Z"
  }
]
```

## Content-Qualitäts-Checks

### Automatische Validierung
```typescript
const validateTrick = (trick: Partial<KITrick>): ValidationResult => {
  const issues = []
  
  // Title Check
  if (trick.title.length > 100) {
    issues.push('Title zu lang')
  }
  
  // Psychology Hook Check
  if (!trick.description.includes('**Warum es funktioniert:**')) {
    issues.push('Psychology Hook fehlt')
  }
  
  // Steps Check
  if (trick.steps.length < 3 || trick.steps.length > 6) {
    issues.push('Sollte 3-6 Schritte haben')
  }
  
  // Examples Check
  const hasNumbers = trick.examples.some(e => /\d+/.test(e))
  if (!hasNumbers) {
    issues.push('Beispiele sollten messbare Resultate enthalten')
  }
  
  return { valid: issues.length === 0, issues }
}
```

### Qualitäts-Score
```typescript
const calculateQualityScore = (trick: KITrick): number => {
  let score = 0
  
  // Hat Psychology Hook (+20)
  if (trick.description.includes('**Warum es funktioniert:**')) score += 20
  
  // Konkrete Zeitangabe (+10)
  if (/\d+/.test(trick.timeToImplement)) score += 10
  
  // Alle Steps beginnen mit Verb (+10)
  if (trick.steps.every(s => /^[A-Z][a-z]+e/.test(s))) score += 10
  
  // Beispiele mit Zahlen (+20)
  if (trick.examples.some(e => /\d+%?/.test(e))) score += 20
  
  // Passende Tools (+10)
  if (trick.tools.length > 0 && trick.tools.length <= 3) score += 10
  
  // Gute Länge (+10)
  if (trick.description.length > 200 && trick.description.length < 500) score += 10
  
  // High Impact (+20)
  if (trick.impact === 'high') score += 20
  
  return score // Max: 100
}
```

## Batch-Processing

### Multiple Quellen
```typescript
const sources = [
  { type: 'youtube', path: './transcripts/youtube/*.json' },
  { type: 'markdown', path: './content/tips/*.md' },
  { type: 'csv', path: './data/tips.csv' }
]

async function processAllSources() {
  const allTricks: KITrick[] = []
  
  for (const source of sources) {
    const tricks = await processSource(source)
    allTricks.push(...tricks)
  }
  
  // Deduplizierung
  const unique = deduplicateTricks(allTricks)
  
  // Qualitäts-Filter
  const highQuality = unique.filter(t => 
    calculateQualityScore(t) >= 70
  )
  
  return highQuality
}
```

### Incremental Updates
```typescript
// Nur neue Tricks hinzufügen
const existingTricks = JSON.parse(
  fs.readFileSync('./generated-ki-tips.json', 'utf-8')
)

const existingIds = new Set(existingTricks.map(t => t.id))

const newTricks = allTricks.filter(t => 
  !existingIds.has(t.id)
)

const updated = [...existingTricks, ...newTricks]
```

## CLI-Interface

### Geplante Features
```bash
# Einzelne Datei konvertieren
npm run convert -- --input transcript.json

# Batch mit Filter
npm run convert -- --dir ./transcripts --category programming

# Quality Check
npm run convert -- --check generated-ki-tips.json

# Merge mit bestehenden
npm run convert -- --merge --output combined-tips.json
```

### Argumente
```typescript
interface CLIArgs {
  input?: string      // Einzelne Input-Datei
  dir?: string       // Verzeichnis für Batch
  output?: string    // Output-Datei
  category?: string  // Nur bestimmte Kategorie
  check?: boolean    // Quality Check Modus
  merge?: boolean    // Mit bestehenden mergen
  dryRun?: boolean   // Nur Preview, kein Schreiben
}
```

## Integration mit Platform

### Auto-Import
```typescript
// In app/lib/mock-data.ts
import generatedTips from '@/generated-ki-tips.json'
import curatedTips from '@/curated-ki-tips.json'

export const mockTricks: KITrick[] = [
  ...generatedTips,
  ...curatedTips,
  // Manuelle Tricks
].sort((a, b) => 
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
)
```

### Build-Time Generation
```json
// package.json
{
  "scripts": {
    "prebuild": "npm run generate:tips",
    "generate:tips": "tsx scripts/convert-youtube-tips.ts",
    "build": "next build"
  }
}
```

## Content-Quellen

### Aktuelle Quellen
1. **YouTube Channels**:
   - Anthropic Official
   - AI Explained
   - Two Minute Papers
   - Deutsche Tech-Channels

2. **Blogs & Artikel**:
   - Anthropic Blog (Vibe Coding)
   - Claude Code Dokumentation
   - Community Tutorials

3. **Repositories**:
   - Awesome Claude Prompts
   - AI Productivity Tools
   - Claude Code Examples

### Quellen-Tracking
```typescript
interface ContentSource {
  id: string
  type: 'youtube' | 'blog' | 'repo' | 'manual'
  url: string
  lastFetched: Date
  trickCount: number
  quality: number // 0-100
}

// Tracking in sources.json
const sources: ContentSource[] = [
  {
    id: 'anthropic-youtube',
    type: 'youtube',
    url: 'https://youtube.com/@anthropic',
    lastFetched: new Date('2025-08-01'),
    trickCount: 15,
    quality: 95
  }
]
```

## Best Practices

### Content-Richtlinien

1. **Titel-Formeln**:
   - "Der X-Y-Z Trick" (Nummer-Feature-Benefit)
   - "Verb + Objekt + in X Minuten"
   - "Problem-Lösung Format"

2. **Hook-Psychologie**:
   - Kognitive Verzerrungen nutzen
   - Wissenschaftliche Prinzipien
   - Neurologie-Bezüge

3. **Schritt-Struktur**:
   - Schritt 1: Vorbereitung/Setup
   - Schritt 2-3: Hauptaktionen
   - Letzter Schritt: Validierung

4. **Beispiel-Patterns**:
   - "Team X: 40% Produktivitätssteigerung"
   - "Entwickler Y: 3 Tage → 3 Stunden"
   - "Startup Z: 10x schnellere Iteration"

### Fehlerbehandlung

```typescript
try {
  const tricks = await convertYouTubeToTricks(transcripts)
  
  // Validierung
  const valid = tricks.filter(t => validateTrick(t).valid)
  const invalid = tricks.filter(t => !validateTrick(t).valid)
  
  if (invalid.length > 0) {
    console.warn(`${invalid.length} Tricks übersprungen:`)
    invalid.forEach(t => {
      const result = validateTrick(t)
      console.warn(`- ${t.title}: ${result.issues.join(', ')}`)
    })
  }
  
  // Speichern
  await fs.writeFile(
    './generated-ki-tips.json',
    JSON.stringify(valid, null, 2)
  )
  
  console.log(`✅ ${valid.length} Tricks erfolgreich generiert`)
  
} catch (error) {
  console.error('❌ Fehler beim Konvertieren:', error)
  process.exit(1)
}
```

## Maintenance

### Regelmäßige Updates
```bash
# Cron Job für wöchentliche Updates
0 0 * * 0 cd /app && npm run generate:tips && npm run build
```

### Qualitäts-Monitoring
```typescript
// Monatlicher Report
const generateQualityReport = () => {
  const tricks = loadAllTricks()
  
  const report = {
    total: tricks.length,
    byCategory: groupBy(tricks, 'category'),
    avgQualityScore: avg(tricks.map(calculateQualityScore)),
    withoutExamples: tricks.filter(t => !t.examples?.length),
    tooShort: tricks.filter(t => t.description.length < 150)
  }
  
  return report
}
```