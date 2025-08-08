# Tricks Page - CLAUDE.md

Die `/tricks` Route ist die Hauptseite für die KI-Tricks-Übersicht mit vollständiger Filter-Funktionalität.

## Architektur

### Server/Client Split (Next.js 15)
```
app/tricks/
├── page.tsx         # Server Component mit Suspense
└── TricksClient.tsx # Client Component mit useSearchParams
```

Diese Aufteilung ist **KRITISCH** für Next.js 15:
- `useSearchParams` erfordert eine Suspense Boundary
- Server Component lädt Metadaten und Layout
- Client Component handled interaktive Filter

## page.tsx - Server Component

### Struktur
```typescript
export default function TricksPage() {
  return (
    <>
      <Header />
      <PageContainer>
        <div className="py-8">
          <h1>Entdecke KI-Tricks</h1>
          <p>Praktische Anleitungen...</p>
          
          <Suspense fallback={<TricksLoading />}>
            <TricksClient />
          </Suspense>
        </div>
      </PageContainer>
      <Footer />
    </>
  )
}
```

### Wichtige Punkte
1. **Suspense Boundary**: MUSS TricksClient wrappen
2. **Header/Footer**: Werden hier eingebunden (nicht in layout.tsx)
3. **SEO Metadata**: Kann hier statisch definiert werden
4. **Loading State**: TricksLoading Komponente oder Skeleton

## TricksClient.tsx - Client Component

### Haupt-Features
```typescript
'use client'

export function TricksClient() {
  const { filters, updateFilters, resetFilters, activeFilterCount } = useFilters()
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  
  // Filter anwenden
  const filteredTricks = useMemo(
    () => filterTricks(mockTricks, filters),
    [filters]
  )
  
  return (
    <div className="flex gap-8">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64">
        <FilterSidebar ... />
      </aside>
      
      {/* Mobile Filter Button */}
      <button className="lg:hidden" onClick={() => setIsMobileFilterOpen(true)}>
        Filter ({activeFilterCount})
      </button>
      
      {/* Tricks Grid */}
      <main className="flex-1">
        <TrickGrid tricks={filteredTricks} isLoading={false} />
      </main>
      
      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <MobileFilterDrawer ... />
      )}
    </div>
  )
}
```

### State Management
- **filters**: Von useFilters Hook (URL-sync)
- **isMobileFilterOpen**: Lokaler UI State
- **filteredTricks**: Memoized für Performance

## Layout & Responsive Design

### Desktop (≥1024px)
```
┌─────────────────────────────────────┐
│ Header                              │
├─────────────────────────────────────┤
│ ┌─────────┬───────────────────────┐ │
│ │ Filter  │ TrickGrid (3 Spalten) │ │
│ │ Sidebar │ ┌─────┐┌─────┐┌─────┐│ │
│ │         │ │Card ││Card ││Card ││ │
│ │         │ └─────┘└─────┘└─────┘│ │
│ └─────────┴───────────────────────┘ │
└─────────────────────────────────────┘
```

### Tablet (640px - 1023px)
- Filter als Dropdown/Accordion
- TrickGrid: 2 Spalten

### Mobile (<640px)
- Filter als Full-Screen Drawer
- TrickGrid: 1 Spalte
- Sticky Filter Button

## Filter-System Integration

### URL-Parameter Beispiele
- `/tricks` - Alle Tricks
- `/tricks?categories=programming` - Nur Programming
- `/tricks?q=claude&difficulty=beginner` - Suche + Filter
- `/tricks?categories=productivity,business&impact=high` - Multi-Filter

### Filter-Update Flow
```
User klickt Filter
    ↓
updateFilters() called
    ↓
URL updated
    ↓
useFilters Hook reagiert
    ↓
filteredTricks neu berechnet
    ↓
UI updated
```

## Performance-Optimierungen

### 1. Memoization
```typescript
const filteredTricks = useMemo(
  () => filterTricks(allTricks, filters),
  [filters] // Nur bei Filter-Änderung neu berechnen
)
```

### 2. Lazy Loading (zukünftig)
```typescript
const [displayCount, setDisplayCount] = useState(12)

const displayedTricks = filteredTricks.slice(0, displayCount)

// "Mehr laden" Button
<button onClick={() => setDisplayCount(prev => prev + 12)}>
  Mehr laden
</button>
```

### 3. Virtual Scrolling (bei 100+ Tricks)
```typescript
import { FixedSizeGrid } from 'react-window'

<FixedSizeGrid
  columnCount={3}
  rowCount={Math.ceil(tricks.length / 3)}
  height={800}
  width={1200}
>
  {({ columnIndex, rowIndex, style }) => (
    <TrickCard 
      trick={tricks[rowIndex * 3 + columnIndex]} 
      style={style}
    />
  )}
</FixedSizeGrid>
```

## Loading States

### Initial Load
```typescript
function TricksLoading() {
  return (
    <div className="flex gap-8">
      <div className="hidden lg:block w-64">
        <Skeleton height={400} /> {/* Filter Skeleton */}
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}
```

### Filter Updates
- Optimistic Updates (Filter sofort aktiv)
- Subtle Loading Indicator
- Keine Layout Shifts

## Mobile-Spezifische Features

### Filter Drawer
```typescript
function MobileFilterDrawer({ isOpen, onClose, ... }) {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-80 bg-white">
        <div className="flex justify-between p-4">
          <h2>Filter</h2>
          <button onClick={onClose}>×</button>
        </div>
        
        <FilterSidebar ... />
        
        <div className="p-4">
          <Button onClick={onClose} className="w-full">
            Anwenden ({filteredCount} Tricks)
          </Button>
        </div>
      </div>
    </div>
  )
}
```

### Touch-Optimierungen
- Größere Touch-Targets (min 44px)
- Swipe-to-Close für Drawer
- Haptic Feedback bei Filter-Änderungen

## SEO & Accessibility

### Meta Tags
```typescript
export const metadata: Metadata = {
  title: 'KI-Tricks entdecken | KI Tricks Platform',
  description: 'Entdecke über 40 praktische KI-Tricks...',
  openGraph: {
    title: 'KI-Tricks für jeden Tag',
    description: '...',
    images: ['/og-tricks.png']
  }
}
```

### Structured Data
```typescript
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: tricks.map((trick, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'HowTo',
      name: trick.title,
      description: trick.description
    }
  }))
}
```

### Accessibility
- Keyboard Navigation für Filter
- ARIA Labels für interaktive Elemente
- Focus Management im Mobile Drawer
- Announce Filter Results

## Error Handling

### Keine Ergebnisse
```typescript
{filteredTricks.length === 0 && (
  <div className="text-center py-12">
    <p className="text-gray-500 mb-4">
      Keine Tricks gefunden für deine Filterauswahl.
    </p>
    <Button onClick={resetFilters} variant="secondary">
      Filter zurücksetzen
    </Button>
  </div>
)}
```

### Filter-Fehler
```typescript
try {
  const filtered = filterTricks(tricks, filters)
  return filtered
} catch (error) {
  console.error('Filter error:', error)
  return tricks // Fallback zu ungefilterten Tricks
}
```

## Erweiterungsmöglichkeiten

### 1. Sortierung
```typescript
const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'impact'>('newest')

const sortedTricks = useMemo(() => {
  const sorted = [...filteredTricks]
  switch(sortBy) {
    case 'newest': return sorted.sort((a, b) => b.createdAt - a.createdAt)
    case 'popular': return sorted.sort((a, b) => b.views - a.views)
    case 'impact': return sorted.sort((a, b) => IMPACT_ORDER[b.impact] - IMPACT_ORDER[a.impact])
  }
}, [filteredTricks, sortBy])
```

### 2. Ansicht-Toggle
```typescript
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

{viewMode === 'grid' ? (
  <TrickGrid tricks={tricks} />
) : (
  <TrickList tricks={tricks} />
)}
```

### 3. Favoriten
```typescript
const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', [])

const toggleFavorite = (trickId: string) => {
  setFavorites(prev => 
    prev.includes(trickId) 
      ? prev.filter(id => id !== trickId)
      : [...prev, trickId]
  )
}
```

## Testing Checklist

- [ ] Filter funktionieren korrekt
- [ ] URL wird bei Filter-Änderung aktualisiert
- [ ] Browser Vor/Zurück funktioniert
- [ ] Mobile Drawer öffnet/schließt
- [ ] Keine Tricks → Hilfevoller Empty State
- [ ] Performance bei 50+ Tricks ok
- [ ] SEO Tags korrekt gesetzt
- [ ] Accessibility mit Screen Reader