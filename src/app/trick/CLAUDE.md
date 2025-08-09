# Trick Detail Page - CLAUDE.md

Die `/trick/[slug]` Route zeigt die Detailansicht eines einzelnen KI-Tricks mit allen Schritten, Beispielen und verwandten Tricks.

## Struktur

```
app/trick/
└── [slug]/
    └── page.tsx    # Dynamic Route mit Next.js 15 Pattern
```

## Dynamic Route Pattern (Next.js 15)

### Wichtig: Async Params
```typescript
interface PageProps {
  params: Promise<{ slug: string }>  // Promise in Next.js 15!
}

export default async function TrickDetailPage({ params }: PageProps) {
  const { slug } = await params  // Await erforderlich!
  const trick = getTrickBySlug(slug)
  
  if (!trick) {
    notFound() // Next.js 404
  }
  
  return <TrickDetail trick={trick} />
}
```

## Page Layout

### Struktur-Übersicht
```
┌─────────────────────────────────────┐
│ Header                              │
├─────────────────────────────────────┤
│ Breadcrumb Navigation               │
├─────────────────────────────────────┤
│ < Zurück zu allen Tricks            │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Trick Header                    │ │
│ │ - Title                         │ │
│ │ - Category Badge                │ │
│ │ - Description + Hook            │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Trick Meta (Zeit, Tools, etc)  │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Trick Content                   │ │
│ │ - Schritte (1-4)                │ │
│ │ - Beispiele (1-2)               │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Ähnliche Tricks                 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Komponenten-Aufbau

### 1. Breadcrumb Navigation
```typescript
<BreadcrumbNav 
  items={[
    { label: 'Home', href: '/' },
    { label: 'Tricks', href: '/tricks' },
    { label: trick.title, href: `/trick/${trick.slug}` }
  ]} 
/>
```

### 2. Back Button
```typescript
<BackButton /> // Navigiert IMMER zu /tricks
```

### 3. Trick Header
```typescript
<TrickHeader trick={trick} />
// Zeigt: Titel, Kategorie-Badge, Beschreibung mit Hook
```

### 4. Trick Meta
```typescript
<TrickMeta 
  timeToImplement={trick.timeToImplement}
  tools={trick.tools}
  impact={trick.impact}
  difficulty={trick.difficulty}
/>
```

### 5. Trick Content
```typescript
<TrickContent trick={trick} />
// Rendert Steps und Examples mit StepCard/ExampleCard
```

### 6. Related Tricks
```typescript
<RelatedTricks 
  currentTrickId={trick.id}
  category={trick.category}
/>
```

## SEO & Meta Tags

### Dynamic Metadata
```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const trick = getTrickBySlug(slug)
  
  if (!trick) {
    return { title: 'Trick nicht gefunden' }
  }
  
  return {
    title: `${trick.title} | KI Tricks Platform`,
    description: trick.description.substring(0, 160),
    openGraph: {
      title: trick.title,
      description: trick.description,
      type: 'article',
      publishedTime: trick.createdAt.toISOString(),
      authors: ['KI Tricks Platform']
    }
  }
}
```

### Structured Data
```typescript
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: trick.title,
  description: trick.description,
  step: trick.steps?.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: `Schritt ${index + 1}`,
    text: step
  })),
  totalTime: `PT${trick.timeToImplement}`,
  tool: trick.tools.map(tool => ({
    '@type': 'HowToTool',
    name: tool
  }))
}
```

## Static Generation

### generateStaticParams
```typescript
export async function generateStaticParams() {
  // Alle Tricks pre-rendern für optimale Performance
  return mockTricks.map((trick) => ({
    slug: trick.slug
  }))
}
```

## Error Handling

### 404 - Trick nicht gefunden
```typescript
if (!trick) {
  notFound() // Triggert app/not-found.tsx
}
```

### Invalide Slugs
```typescript
// Slug Validation
const isValidSlug = (slug: string) => /^[a-z0-9-]+$/.test(slug)

if (!isValidSlug(slug)) {
  notFound()
}
```

## Content Sections

### Schritte-Darstellung
```typescript
{trick.steps && trick.steps.length > 0 && (
  <section>
    <h2 className="text-2xl font-bold mb-6">
      So funktioniert's
    </h2>
    <div className="space-y-4">
      {trick.steps.map((step, index) => (
        <StepCard 
          key={index}
          step={step}
          stepNumber={index + 1}
        />
      ))}
    </div>
  </section>
)}
```

### Beispiele-Darstellung
```typescript
{trick.examples && trick.examples.length > 0 && (
  <section className="mt-12">
    <h2 className="text-2xl font-bold mb-6">
      Konkrete Beispiele
    </h2>
    <div className="space-y-4">
      {trick.examples.map((example, index) => (
        <ExampleCard 
          key={index}
          example={example}
          exampleNumber={index + 1}
        />
      ))}
    </div>
  </section>
)}
```

## Responsive Design

### Desktop
- Maximale Breite: 4xl (896px)
- Großzügige Abstände
- Side-by-side Meta-Informationen

### Mobile
- Full-width Content
- Gestackte Meta-Informationen
- Kleinere Schriftgrößen
- Touch-optimierte Buttons

## Performance Optimierungen

### 1. Static Pre-rendering
```typescript
// Alle Tricks werden zur Build-Zeit gerendert
export const dynamic = 'force-static'
```

### 2. Image Optimization (zukünftig)
```typescript
import Image from 'next/image'

{trick.image && (
  <Image
    src={trick.image}
    alt={trick.title}
    width={1200}
    height={630}
    priority
    className="rounded-lg"
  />
)}
```

### 3. Related Tricks Lazy Loading
```typescript
const RelatedTricks = dynamic(
  () => import('@/app/components/organisms/RelatedTricks'),
  { ssr: false }
)
```

## Interaktive Features (Zukünftig)

### 1. Favoriten
```typescript
const [isFavorite, setIsFavorite] = useState(false)

<button 
  onClick={() => toggleFavorite(trick.id)}
  className="flex items-center gap-2"
>
  <Heart className={isFavorite ? 'fill-red-500' : ''} />
  Speichern
</button>
```

### 2. Teilen
```typescript
const shareUrl = `${process.env.NEXT_PUBLIC_URL}/trick/${trick.slug}`

<button onClick={() => {
  navigator.share({
    title: trick.title,
    text: trick.description,
    url: shareUrl
  })
}}>
  <Share2 /> Teilen
</button>
```

### 3. Fortschritt Tracking
```typescript
const [completedSteps, setCompletedSteps] = useState<number[]>([])

<Checkbox
  checked={completedSteps.includes(index)}
  onChange={() => toggleStep(index)}
  label={`Schritt ${index + 1} erledigt`}
/>
```

### 4. Kommentare/Feedback
```typescript
<section className="mt-16 border-t pt-8">
  <h3>War dieser Trick hilfreich?</h3>
  <div className="flex gap-4">
    <Button variant="ghost" onClick={() => submitFeedback('helpful')}>
      👍 Ja
    </Button>
    <Button variant="ghost" onClick={() => submitFeedback('not-helpful')}>
      👎 Nein
    </Button>
  </div>
</section>
```

## Navigation Flow

### User Journey
```
Homepage → Tricks Liste → Trick Detail
    ↓           ↓              ↓
  Filter    Kategorie      Ähnliche
  Suche      Filter         Tricks
```

### Back Navigation
- Back Button → Immer zu `/tricks`
- Browser Back → Vorherige Seite (mit Filtern)
- Breadcrumb → Spezifische Navigation

## Testing Scenarios

1. **Direct Access**: `/trick/der-22000-zeilen-production-code-trick`
2. **Invalid Slug**: `/trick/nicht-existierend` → 404
3. **Special Chars**: `/trick/trick-mit-ä-ö-ü` → Slug Conversion
4. **Related Tricks**: Gleiche Kategorie, max 3
5. **Empty Content**: Tricks ohne Steps/Examples
6. **Long Content**: Performance bei langen Texten

## Debugging

### Slug Issues
```typescript
console.log({
  requestedSlug: slug,
  availableSlugs: mockTricks.map(t => t.slug),
  found: !!trick
})
```

### Render Performance
```typescript
if (process.env.NODE_ENV === 'development') {
  console.time('TrickDetailRender')
  // ... render
  console.timeEnd('TrickDetailRender')
}
```