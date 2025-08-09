# Trick Detail Page - Design Specification

## Projekt Übersicht

Diese Spezifikation definiert das Design und die Implementierung für individuelle Trick-Detail-Seiten (`/trick/[slug]`) der AI Tricks Platform. Das Design folgt dem minimalistischen Ansatz von thegrowthlist.co mit viel Whitespace und sauberen Komponenten.

## Technology Stack

- **Framework**: Next.js 15.4.5 mit App Router
- **Styling**: Tailwind CSS v3.4.16
- **Komponenten**: Bestehende Atomic Design Komponenten
- **Primärfarbe**: #2299dd (primary-500)
- **Schrift**: Inter Font Family

## Design System Foundation

### Color Palette (aus bestehender Basis)
```css
Primary: #2299dd (primary-500)
Text: #171717 (neutral-900)
Borders: #e5e5e5 (neutral-200)
Background: #fafafa (neutral-50)
Cards: #ffffff (white)
```

### Typography Scale
```css
Headline (H1): text-3xl font-bold (30px, bold)
Section Headers (H2): text-xl font-semibold (20px, semibold)
Subsection (H3): text-lg font-medium (18px, medium)
Body Text: text-base (16px)
Small Text: text-sm (14px)
Meta Text: text-xs (12px)
```

### Spacing System
```css
Container Padding: px-4 sm:px-6 lg:px-8
Vertical Rhythm: space-y-6 (24px)
Section Gaps: space-y-8 (32px)
Card Padding: p-6 (24px)
```

## Page Layout Structure

### 1. Breadcrumb Navigation
```
AI Tricks > [Kategorie Label] > [Trick Titel (gekürzt)]
```

### 2. Header Section
- Trick Titel (H1)
- Kategorie Badge + Schwierigkeit Badge + Impact Badge
- Meta-Informationen (Zeitaufwand, Tools, Datum)
- Back Button

### 3. Main Content
- Beschreibung (Einführung)
- Tools & Voraussetzungen
- Schritt-für-Schritt Anleitung
- Beispiele & Use Cases
- Tipps & Hinweise (falls vorhanden)

### 4. Related Tricks Section
- 3 ähnliche Tricks aus derselben Kategorie
- Als Karten im bestehenden TrickCard Design

### 5. Call-to-Action Footer
- "Zurück zu allen Tricks" Button
- Social Share Buttons (optional)

## Detaillierte Component Specifications

### TrickDetailPage (Organism)

**Purpose**: Haupt-Container für die gesamte Trick-Detail-Seite

**Layout Struktur**:
```jsx
<PageContainer>
  <BreadcrumbNav />
  <TrickHeader />
  <TrickContent />
  <RelatedTricks />
  <TrickFooter />
</PageContainer>
```

**Responsive Verhalten**:
- Mobile: Einspaltig, gestackte Elemente
- Tablet: Einspaltig mit größeren Abständen  
- Desktop: Einspaltig mit maximaler Breite von 768px (prose-Breite)

---

### BreadcrumbNav (Molecule)

**Purpose**: Navigation und Seitenkontext

**Props Interface**:
```typescript
interface BreadcrumbNavProps {
  category: Category
  title: string
  className?: string
}
```

**Visual Specifications**:
- Höhe: py-4
- Farbe: text-neutral-500
- Separator: "/" oder ">"
- Hover States für Links
- Mobile: Titel nach 30 Zeichen kürzen

**Implementation**:
```jsx
<nav className="py-4 text-sm text-neutral-500">
  <Link href="/" className="hover:text-neutral-700">AI Tricks</Link>
  <span className="mx-2">/</span>
  <Link href="/tricks" className="hover:text-neutral-700">
    {categoryMetadata[category].label}
  </Link>
  <span className="mx-2">/</span>
  <span className="text-neutral-900">{truncatedTitle}</span>
</nav>
```

---

### TrickHeader (Molecule)

**Purpose**: Titel, Badges und Meta-Informationen

**Props Interface**:
```typescript
interface TrickHeaderProps {
  trick: AITrick
  className?: string
}
```

**Visual Specifications**:
- Titel: text-3xl font-bold text-neutral-900 mb-4
- Badge-Gruppe: flex flex-wrap gap-2 mb-6
- Meta-Grid: 2-spaltig auf Desktop, 1-spaltig auf Mobile
- Back Button: links oben, primary Farbe

**Implementation**:
```jsx
<header className="mb-8">
  <div className="flex items-start justify-between mb-4">
    <BackButton />
  </div>
  
  <h1 className="text-3xl font-bold text-neutral-900 mb-4">
    {trick.title}
  </h1>
  
  <div className="flex flex-wrap gap-2 mb-6">
    <Badge className={categoryMetadata[trick.category].color}>
      {categoryMetadata[trick.category].icon} {categoryMetadata[trick.category].label}
    </Badge>
    <Badge className={difficultyMetadata[trick.difficulty].color}>
      {difficultyMetadata[trick.difficulty].label}
    </Badge>
    <Badge className={impactMetadata[trick.impact].color}>
      {impactMetadata[trick.impact].label}
    </Badge>
  </div>
  
  <TrickMeta trick={trick} />
</header>
```

---

### TrickMeta (Molecule)

**Purpose**: Zeit, Tools und weitere Meta-Informationen

**Visual Specifications**:
- Layout: Grid mit 2 Spalten auf Desktop
- Icons: Lucide React Icons (Clock, Wrench, Calendar)
- Text: text-sm text-neutral-600

**Implementation**:
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-lg">
  <div className="flex items-center">
    <Clock className="w-4 h-4 mr-2 text-neutral-500" />
    <span className="text-sm text-neutral-600">
      Zeitaufwand: <strong>{trick.timeToImplement}</strong>
    </span>
  </div>
  
  <div className="flex items-center">
    <Wrench className="w-4 h-4 mr-2 text-neutral-500" />
    <span className="text-sm text-neutral-600">
      Tools: <strong>{trick.tools.join(', ')}</strong>
    </span>
  </div>
</div>
```

---

### TrickContent (Organism)

**Purpose**: Hauptinhalt mit Beschreibung, Schritten und Beispielen

**Visual Specifications**:
- Sections: space-y-8
- Cards: bg-white border border-neutral-200 rounded-lg p-6
- Lists: space-y-3 mit Nummerierung/Bullets

**Section Structure**:

1. **Beschreibung**
   ```jsx
   <section>
     <h2 className="text-xl font-semibold mb-4">Übersicht</h2>
     <p className="text-neutral-700 leading-relaxed">{trick.description}</p>
   </section>
   ```

2. **Schritt-für-Schritt Anleitung**
   ```jsx
   <section>
     <h2 className="text-xl font-semibold mb-4">Schritt-für-Schritt Anleitung</h2>
     <div className="space-y-4">
       {trick.steps?.map((step, index) => (
         <StepCard key={index} step={step} number={index + 1} />
       ))}
     </div>
   </section>
   ```

3. **Beispiele**
   ```jsx
   <section>
     <h2 className="text-xl font-semibold mb-4">Praktische Beispiele</h2>
     <div className="space-y-3">
       {trick.examples?.map((example, index) => (
         <ExampleCard key={index} example={example} />
       ))}
     </div>
   </section>
   ```

---

### StepCard (Molecule)

**Purpose**: Einzelner Schritt in der Anleitung

**Props Interface**:
```typescript
interface StepCardProps {
  step: string
  number: number
  className?: string
}
```

**Visual Specifications**:
- Card: bg-white border rounded-lg p-4
- Number Badge: w-8 h-8 bg-primary-100 text-primary-700 rounded-full
- Layout: flex mit Nummer links, Text rechts

**Implementation**:
```jsx
<div className="flex items-start space-x-4 p-4 bg-white border border-neutral-200 rounded-lg">
  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold">
    {number}
  </div>
  <p className="text-neutral-700 flex-1">{step}</p>
</div>
```

---

### ExampleCard (Molecule)

**Purpose**: Beispiel Use Case

**Implementation**:
```jsx
<div className="p-4 bg-neutral-50 border-l-4 border-primary-500 rounded-r-lg">
  <p className="text-neutral-700 italic">{example}</p>
</div>
```

---

### RelatedTricks (Organism)

**Purpose**: Ähnliche Tricks vorschlagen

**Props Interface**:
```typescript
interface RelatedTricksProps {
  currentTrick: AITrick
  limit?: number
  className?: string
}
```

**Visual Specifications**:
- Verwendet bestehende TrickCard Komponente
- Grid: 1 Spalte Mobile, 2 Spalten Tablet, 3 Spalten Desktop
- Titel: text-2xl font-semibold mb-6

**Implementation**:
```jsx
<section className="mt-12 pt-8 border-t border-neutral-200">
  <h2 className="text-2xl font-semibold mb-6">Ähnliche Tricks</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {relatedTricks.map(trick => (
      <TrickCard key={trick.id} trick={trick} />
    ))}
  </div>
</section>
```

---

### BackButton (Atom)

**Purpose**: Navigation zurück zur Trick-Liste

**Implementation**:
```jsx
<Button 
  variant="text" 
  onClick={() => router.back()}
  className="mb-4"
>
  <ArrowLeft className="w-4 h-4 mr-2" />
  Zurück
</Button>
```

## Interaction Patterns

### Scroll-to-Top Behavior
- Smooth scroll beim Laden der Seite
- Focus auf H1 für Accessibility

### Loading States
- Skeleton Loading für alle Sections
- Progressive Enhancement

### Error Handling
- 404 wenn Trick nicht existiert
- Fallback für fehlende Daten (steps, examples)

## Responsive Design

### Mobile (< 640px)
- Container: px-4
- Single column layout
- Breadcrumb: Titel nach 20 Zeichen kürzen
- Meta: Stacked layout
- Related tricks: 1 Spalte

### Tablet (640px - 1024px)
- Container: px-6
- Meta: 2-spaltig
- Related tricks: 2 Spalten

### Desktop (> 1024px)
- Container: px-8, max-width: 768px (prose width)
- Related tricks: 3 Spalten
- Optimale Lesbarkeit

## SEO & Accessibility

### Meta Tags
```jsx
export const metadata: Metadata = {
  title: `${trick.title} | AI Tricks`,
  description: trick.description,
  openGraph: {
    title: trick.title,
    description: trick.description,
    type: 'article',
    publishedTime: trick.createdAt.toISOString(),
    modifiedTime: trick.updatedAt.toISOString(),
    tags: [trick.category, ...trick.tools],
  },
  keywords: [trick.category, ...trick.tools, 'AI', 'Tricks', 'Produktivität'].join(', ')
}
```

### Accessibility Requirements
- [ ] H1-H6 Hierarchie einhalten
- [ ] Alt-Texte für alle Icons
- [ ] ARIA Labels für interaktive Elemente
- [ ] Keyboard Navigation Support
- [ ] Screen Reader optimierte Struktur
- [ ] Focus Management
- [ ] Color Contrast >= 4.5:1
- [ ] Skip Links für Navigation

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "trick.title",
  "description": "trick.description",
  "totalTime": "trick.timeToImplement",
  "supply": "trick.tools",
  "step": "trick.steps (als HowToStep Array)"
}
```

## Performance Optimizations

### Code Splitting
- Dynamic Import für Related Tricks
- Lazy Loading für nicht-kritische Komponenten

### Image Optimization
- Next.js Image Komponente für alle Bilder
- WebP Format mit Fallback

### Core Web Vitals
- LCP: < 2.5s (Optimierte Font Loading)
- FID: < 100ms (Minimale JavaScript)
- CLS: < 0.1 (Reservierte Layouts)

## Implementation Roadmap

1. [ ] **Base Components erstellen**
   - BreadcrumbNav
   - TrickMeta
   - StepCard
   - ExampleCard
   - BackButton

2. [ ] **Main Page Component**
   - TrickDetailPage Layout
   - TrickHeader
   - TrickContent
   - RelatedTricks

3. [ ] **Dynamic Route Setup**
   - /trick/[slug]/page.tsx
   - generateStaticParams für SSG
   - Error Boundaries

4. [ ] **SEO Implementation**
   - Dynamic Metadata
   - Structured Data
   - Open Graph Tags

5. [ ] **Accessibility Testing**
   - Screen Reader Tests
   - Keyboard Navigation
   - Color Contrast Validation

6. [ ] **Performance Optimization**
   - Bundle Analysis
   - Loading States
   - Core Web Vitals Messung

## Beispiel-Datenstruktur

Basierend auf den Mock-Daten:

```typescript
// Beispiel Trick: "Automatische Meeting-Zusammenfassungen mit ChatGPT"
{
  id: '1',
  title: 'Automatische Meeting-Zusammenfassungen mit ChatGPT',
  description: 'Nutze ChatGPT, um aus Meeting-Notizen automatisch strukturierte Zusammenfassungen mit Action Items zu erstellen.',
  category: 'productivity',
  difficulty: 'beginner',
  tools: ['ChatGPT', 'GPT-4'],
  timeToImplement: '5 Minuten',
  impact: 'high',
  steps: [
    'Meeting-Notizen in ChatGPT kopieren',
    'Prompt verwenden: "Erstelle eine strukturierte Zusammenfassung mit Action Items"',
    'Ergebnis formatieren und teilen'
  ],
  examples: [
    'Meeting-Notizen → Strukturierte Zusammenfassung mit Aufgaben',
    'Brainstorming-Session → Kategorisierte Ideenliste'
  ],
  slug: 'automatische-meeting-zusammenfassungen-mit-chatgpt'
}
```

## Feedback & Iteration

### Phase 1: MVP Implementation
- Basic Layout und Content Display
- Responsive Design
- Navigation

### Phase 2: Enhancement
- Animations und Transitions
- Social Sharing
- Print Styles

### Phase 3: Advanced Features
- Dark Mode Support
- Favorites Functionality
- Comments System (future)

---

Diese Spezifikation bietet eine vollständige Grundlage für die Implementierung der Trick-Detail-Seiten unter Beibehaltung der bestehenden Design-Sprache und Komponenten-Architektur der AI Tricks Platform.