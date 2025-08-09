# Components - CLAUDE.md

Dieses Verzeichnis enthält alle React-Komponenten der KI Tricks Platform, organisiert nach dem **Atomic Design Pattern**.

## Struktur-Überblick

```
components/
├── atoms/          # Basis-UI-Komponenten
├── molecules/      # Zusammengesetzte Komponenten
├── organisms/      # Komplexe Komponenten
└── layout/         # Layout-Komponenten
```

## Atoms (Basis-Komponenten)

### BackButton
- **Zweck**: Navigiert IMMER zu `/tricks` (nicht Browser-History)
- **Props**: Keine
- **Verwendung**: `<BackButton />`

### Badge
- **Zweck**: Zeigt Kategorien, Schwierigkeitsgrade, Impact-Level
- **Props**: `variant` (default, primary, secondary, success, warning, danger)
- **Beispiel**: `<Badge variant="primary">Produktivität</Badge>`

### Button
- **Zweck**: Primäre und sekundäre Actions
- **Props**: `variant` (default, primary, secondary, ghost, danger), `size` (sm, md, lg)
- **Beispiel**: `<Button variant="primary" size="lg">KI Kurs</Button>`

### Checkbox
- **Zweck**: Multi-Select Filter in der Sidebar
- **Props**: `checked`, `onChange`, `label`
- **Wichtig**: Verwendet für Kategorien, Tools, Difficulty, Impact Filter

### FilterSection
- **Zweck**: Gruppiert Filter-Checkboxen mit Überschrift
- **Props**: `title`, `children`
- **Verwendung**: Wrapper für Filter-Gruppen in FilterSidebar

## Molecules (Zusammengesetzte Komponenten)

### TrickCard
- **Zweck**: Karten-Darstellung einzelner KI-Tricks
- **Props**: `trick` (KITrick Objekt)
- **Features**: 
  - Hover-Animation (translateY)
  - Zeigt Badge für Kategorie
  - Zeigt Metadaten (Zeit, Schwierigkeit, Impact)
- **Performance**: Wrapped in `React.memo`

### SearchBar
- **Zweck**: Live-Suche mit Clear-Button
- **Props**: `value`, `onChange?`, `placeholder`
- **Features**:
  - Search Icon (Lucide)
  - X-Button zum Löschen
  - Debounced für Performance

### SkeletonCard
- **Zweck**: Loading-State für TrickCard
- **Props**: Keine
- **Verwendung**: Zeigt animierte Platzhalter während Daten laden

### StepCard
- **Zweck**: Einzelner Schritt in der Trick-Anleitung
- **Props**: `step`, `stepNumber`
- **Design**: Nummerierter Kreis + Text

### ExampleCard
- **Zweck**: Zeigt konkrete Beispiele für KI-Tricks
- **Props**: `example`, `exampleNumber`
- **Design**: Icon + formatierter Text

### BreadcrumbNav
- **Zweck**: Navigation-Pfad (Home > Tricks > Trick-Name)
- **Props**: `items` (Array von {label, href})
- **Features**: Responsive, mit Chevron-Trenner

### TrickMeta
- **Zweck**: Metadaten-Anzeige (Zeit, Tools, Impact)
- **Props**: `timeToImplement`, `tools`, `impact`, `difficulty`
- **Layout**: Flexbox mit Icons

## Organisms (Komplexe Komponenten)

### FilterSidebar
- **Zweck**: Haupt-Filter-Interface
- **Props**: `filters`, `onFilterChange`, `trickCount`
- **Features**:
  - Desktop: Fixierte Sidebar
  - Mobile: Drawer mit Overlay
  - Aktive Filter Counter
  - Reset-Button
- **State**: Managed by `useFilters` Hook

### TrickGrid
- **Zweck**: Responsive Grid für TrickCards
- **Props**: `tricks`, `isLoading`
- **Layout**:
  - Mobile: 1 Spalte
  - Tablet: 2 Spalten  
  - Desktop: 3 Spalten
- **Loading**: Zeigt 6 SkeletonCards

### TrickForm
- **Zweck**: Admin-Formular für neue Tricks
- **Props**: `onSubmit`
- **Features**:
  - Alle Felder mit Validation
  - Dynamische Steps/Examples Arrays
  - localStorage Speicherung
- **Zugriff**: Nur über `/admin/tricks/new`

### TrickContent
- **Zweck**: Detailansicht eines Tricks
- **Props**: `trick`
- **Sections**:
  - Hook-Text mit Psychologie-Erklärung
  - Schritte (StepCard)
  - Beispiele (ExampleCard)

### TrickHeader
- **Zweck**: Hero-Section auf Trick-Detail-Seite
- **Props**: `trick`
- **Features**: Title, Description, Category Badge

### RelatedTricks
- **Zweck**: Zeigt ähnliche Tricks
- **Props**: `currentTrickId`, `category`
- **Logic**: Filtert nach gleicher Kategorie, max 3 Tricks

## Layout-Komponenten

### Header
- **Zweck**: Globale Navigation
- **Features**:
  - KI Logo (klickbar → Home)
  - Navigation Links
  - "KI Kurs" Button (prominent, blau)
- **Links**: Home, Tricks, Über uns, KI Kurs

### Footer
- **Zweck**: Footer mit Links und Copyright
- **Sections**:
  - Rechtliches (Impressum, Datenschutz)
  - Ressourcen (Claude Code Tutorial)
  - Copyright mit aktuellem Jahr

### PageContainer
- **Zweck**: Konsistentes Layout-Wrapper
- **Props**: `children`, `className?`
- **Features**: 
  - Max-width Container
  - Responsive Padding
  - Min-height für kurze Seiten

## Best Practices

### Neue Komponente erstellen

1. **Bestimme die richtige Kategorie**:
   - Atom: Keine Abhängigkeiten zu anderen Components
   - Molecule: Nutzt 1-2 Atoms
   - Organism: Nutzt mehrere Molecules/Atoms

2. **TypeScript First**:
   ```typescript
   interface MyComponentProps {
     title: string
     variant?: 'primary' | 'secondary'
   }
   ```

3. **Export via index.ts**:
   ```typescript
   // In atoms/index.ts
   export { MyComponent } from './MyComponent'
   ```

4. **Nutze bestehende Styles**:
   - Tailwind Classes verwenden
   - Design System Colors: primary (#2299dd), neutral-*
   - Consistent Spacing: p-4, gap-4, etc.

### Performance-Tipps

- `React.memo` für Listen-Items (z.B. TrickCard)
- `useMemo` für teure Berechnungen
- Lazy Loading für große Komponenten
- Optimistic Updates für bessere UX

### Testing-Fokus

Wichtige Test-Szenarien:
- Filter-Logik in FilterSidebar
- URL-Sync in SearchBar/Filters
- Responsive Verhalten (Mobile Drawer)
- Form Validation in TrickForm

## Häufige Aufgaben

### Filter hinzufügen
1. Type in `lib/types.ts` erweitern
2. FilterSection in FilterSidebar hinzufügen
3. useFilters Hook anpassen
4. URL-Parameter definieren

### Neue Card-Variante
1. TrickCard als Basis nehmen
2. Props interface definieren
3. Badge/Meta-Komponenten wiederverwenden
4. Hover-States nicht vergessen

### Layout anpassen
1. PageContainer für konsistente Breite
2. Header/Footer in layout.tsx einbinden
3. Mobile-First entwickeln
4. Breakpoints: sm:640px, md:768px, lg:1024px