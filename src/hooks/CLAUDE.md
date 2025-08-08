# Hooks - CLAUDE.md

Dieses Verzeichnis enthält Custom React Hooks für die KI Tricks Platform. Aktuell gibt es einen zentralen Hook für das Filter-Management.

## useFilters Hook

Der `useFilters` Hook ist das Herzstück des Filter-Systems und synchronisiert den Filter-State mit der URL.

### Zweck
- **URL als Single Source of Truth**: Filter-State wird in Query-Parametern gespeichert
- **Shareable Links**: Gefilterte Ansichten können geteilt werden
- **Browser Navigation**: Vor/Zurück funktioniert mit Filtern
- **Performance**: Optimiert mit useMemo und useCallback

### Interface
```typescript
interface UseFiltersReturn {
  filters: Filters
  updateFilters: (updates: Partial<Filters>) => void
  resetFilters: () => void
  activeFilterCount: number
}
```

### Filter-Struktur
```typescript
interface Filters {
  search: string
  categories: Category[]
  difficulty: Difficulty[]
  impact: Impact[]
  tools: string[]
}
```

### URL-Mapping

| Filter | URL-Parameter | Beispiel |
|--------|--------------|----------|
| search | `q` | `?q=claude+code` |
| categories | `categories` | `?categories=programming,productivity` |
| difficulty | `difficulty` | `?difficulty=beginner,intermediate` |
| impact | `impact` | `?impact=high` |
| tools | `tools` | `?tools=Claude,ChatGPT` |

### Verwendung

```typescript
// In einer Client Component
'use client'

import { useFilters } from '@/app/hooks/useFilters'

export function MyComponent() {
  const { filters, updateFilters, resetFilters, activeFilterCount } = useFilters()
  
  // Filter anwenden
  const filteredTricks = filterTricks(allTricks, filters)
  
  // Filter updaten
  const handleCategoryChange = (category: Category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    
    updateFilters({ categories: newCategories })
  }
  
  // Alle Filter zurücksetzen
  const handleReset = () => {
    resetFilters()
  }
  
  return (
    <div>
      <Badge>{activeFilterCount} Filter aktiv</Badge>
      {/* ... */}
    </div>
  )
}
```

## Implementierungs-Details

### URL-Parsing
```typescript
const parseUrlFilters = (): Filters => {
  const searchParams = new URLSearchParams(window.location.search)
  
  return {
    search: searchParams.get('q') || '',
    categories: searchParams.get('categories')?.split(',') || [],
    difficulty: searchParams.get('difficulty')?.split(',') || [],
    impact: searchParams.get('impact')?.split(',') || [],
    tools: searchParams.get('tools')?.split(',') || []
  }
}
```

### URL-Update
```typescript
const updateUrl = (filters: Filters) => {
  const params = new URLSearchParams()
  
  if (filters.search) params.set('q', filters.search)
  if (filters.categories.length) params.set('categories', filters.categories.join(','))
  // ... andere Filter
  
  const newUrl = `${window.location.pathname}?${params.toString()}`
  window.history.pushState({}, '', newUrl)
}
```

### Performance-Optimierungen

1. **Debounced Search**: 
   - Search-Updates werden mit 300ms Delay ausgeführt
   - Verhindert zu viele URL-Updates beim Tippen

2. **Memoized Filter Count**:
   ```typescript
   const activeFilterCount = useMemo(() => {
     return (
       (filters.search ? 1 : 0) +
       filters.categories.length +
       filters.difficulty.length +
       filters.impact.length +
       filters.tools.length
     )
   }, [filters])
   ```

3. **Stable Callbacks**:
   ```typescript
   const updateFilters = useCallback((updates: Partial<Filters>) => {
     setFilters(prev => ({ ...prev, ...updates }))
   }, [])
   ```

## Edge Cases & Lösungen

### 1. Ungültige URL-Parameter
**Problem**: User könnte ungültige Kategorien in URL eingeben
**Lösung**: Validierung gegen erlaubte Werte
```typescript
const validCategories = categories.filter(c => 
  ALLOWED_CATEGORIES.includes(c as Category)
)
```

### 2. Leere Arrays in URL
**Problem**: `?categories=` resultiert in `['']` statt `[]`
**Lösung**: Filter für leere Strings
```typescript
.split(',').filter(Boolean)
```

### 3. Server/Client Mismatch
**Problem**: useSearchParams nur in Client Components
**Lösung**: Suspense Boundary in Parent Component
```typescript
// app/tricks/page.tsx
<Suspense fallback={<TricksLoading />}>
  <TricksClient />
</Suspense>
```

### 4. Initial Load Performance
**Problem**: Filter-Parsing bei jedem Render
**Lösung**: Einmaliges Parsing im useEffect
```typescript
useEffect(() => {
  const parsed = parseUrlFilters()
  setFilters(parsed)
}, []) // Nur beim Mount
```

## Erweiterungen

### Neue Filter hinzufügen

1. **Type Definition** erweitern:
```typescript
interface Filters {
  // existing...
  dateRange?: [Date, Date]
  hasExamples?: boolean
}
```

2. **URL-Mapping** definieren:
```typescript
// In parseUrlFilters
dateRange: searchParams.get('from') && searchParams.get('to') 
  ? [new Date(searchParams.get('from')), new Date(searchParams.get('to'))]
  : undefined
```

3. **Update-Logik** anpassen:
```typescript
// In updateUrl
if (filters.dateRange) {
  params.set('from', filters.dateRange[0].toISOString())
  params.set('to', filters.dateRange[1].toISOString())
}
```

### Filter-Presets

Vordefinierte Filter-Kombinationen:
```typescript
const FILTER_PRESETS = {
  quickWins: {
    difficulty: ['beginner'],
    impact: ['high'],
    timeToImplement: ['5-15 min']
  },
  advanced: {
    difficulty: ['advanced'],
    categories: ['programming']
  }
}

const applyPreset = (preset: keyof typeof FILTER_PRESETS) => {
  updateFilters(FILTER_PRESETS[preset])
}
```

### Filter-Historie

Browser-History nutzen:
```typescript
window.addEventListener('popstate', () => {
  const filters = parseUrlFilters()
  setFilters(filters)
})
```

## Testing

### Unit Tests
```typescript
describe('useFilters', () => {
  it('should parse URL parameters correctly', () => {
    // Mock window.location
    delete window.location
    window.location = { search: '?categories=programming,design' }
    
    const { result } = renderHook(() => useFilters())
    expect(result.current.filters.categories).toEqual(['programming', 'design'])
  })
  
  it('should update URL when filters change', () => {
    const { result } = renderHook(() => useFilters())
    
    act(() => {
      result.current.updateFilters({ search: 'claude' })
    })
    
    expect(window.location.search).toContain('q=claude')
  })
})
```

### E2E Tests
```typescript
test('filters should persist across navigation', async ({ page }) => {
  await page.goto('/tricks')
  await page.click('[data-category="programming"]')
  await page.click('[data-difficulty="beginner"]')
  
  // Navigate away and back
  await page.goto('/')
  await page.goBack()
  
  // Filters should still be active
  await expect(page.locator('[data-category="programming"]')).toBeChecked()
  await expect(page.locator('[data-difficulty="beginner"]')).toBeChecked()
})
```

## Best Practices

1. **Immer URL als Source of Truth**: State niemals ohne URL-Update ändern
2. **Validierung**: Alle URL-Parameter validieren
3. **Performance**: Updates batchen wo möglich
4. **UX**: Loading-States während Filter-Updates zeigen
5. **Accessibility**: ARIA-Labels für Filter-Controls

## Debugging

### Console Helpers
```typescript
// In Development
if (process.env.NODE_ENV === 'development') {
  window.debugFilters = () => {
    console.log('Current Filters:', filters)
    console.log('URL:', window.location.search)
    console.log('Active Count:', activeFilterCount)
  }
}
```

### Common Issues

1. **Filter werden nicht angewendet**
   - Check: Ist die Component mit 'use client' markiert?
   - Check: Wird useFilters in Suspense Boundary verwendet?

2. **URL wird nicht aktualisiert**
   - Check: Wird updateFilters statt setFilters direkt verwendet?
   - Check: Sind die Filter-Werte serialisierbar?

3. **Performance-Probleme**
   - Check: Wird filterTricks bei jedem Render aufgerufen?
   - Lösung: useMemo für gefilterte Results verwenden