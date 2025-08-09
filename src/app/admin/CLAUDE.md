# Admin - CLAUDE.md

Der Admin-Bereich ermöglicht das Hinzufügen neuer KI-Tricks über ein geschütztes Interface. Die Tricks werden in localStorage gespeichert.

## Struktur

```
app/admin/
└── tricks/
    └── new/
        └── page.tsx    # Formular für neue Tricks
```

## Authentifizierung

### Basic Auth via Middleware
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !verifyAuth(authHeader)) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"'
        }
      })
    }
  }
}
```

### Environment Variables
```bash
# .env.local (Lokal)
ADMIN_PASSWORD=dein-sicheres-passwort

# Vercel Dashboard (Production)
ADMIN_PASSWORD=[production-password]
```

### Login-Prozess
1. Browser zeigt Auth-Popup
2. Username: beliebig (z.B. "admin")
3. Password: ADMIN_PASSWORD aus .env
4. Session bleibt bis Browser geschlossen wird

## TrickForm Component

### Formular-Felder
```typescript
interface FormData {
  title: string              // Max 100 Zeichen
  description: string        // Mit Psychology Hook
  category: Category         // Select aus 8 Kategorien
  difficulty: Difficulty     // Beginner/Intermediate/Advanced
  tools: string[]           // Multi-Select (nur Claude/Claude Code)
  timeToImplement: string    // z.B. "15-30 Minuten"
  impact: Impact            // Low/Medium/High
  steps: string[]           // Dynamisches Array (1-10)
  examples: string[]        // Dynamisches Array (0-5)
}
```

### Validierung
```typescript
const validateForm = (data: FormData): ValidationErrors => {
  const errors: ValidationErrors = {}
  
  if (!data.title || data.title.length < 5) {
    errors.title = 'Titel muss mindestens 5 Zeichen haben'
  }
  
  if (!data.description || !data.description.includes('**Warum es funktioniert:**')) {
    errors.description = 'Beschreibung muss Psychology Hook enthalten'
  }
  
  if (data.steps.length === 0) {
    errors.steps = 'Mindestens ein Schritt erforderlich'
  }
  
  return errors
}
```

## localStorage Integration

### Speicher-Schema
```typescript
interface StoredTricks {
  version: number
  tricks: KITrick[]
  lastUpdated: string
}

const STORAGE_KEY = 'adminTricks'
const CURRENT_VERSION = 1
```

### Speicher-Funktionen
```typescript
// Tricks laden
const loadStoredTricks = (): KITrick[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const data: StoredTricks = JSON.parse(stored)
    
    // Version Check
    if (data.version !== CURRENT_VERSION) {
      console.warn('Stored tricks version mismatch')
      return []
    }
    
    return data.tricks
  } catch (error) {
    console.error('Error loading tricks:', error)
    return []
  }
}

// Trick speichern
const saveTrick = (trick: KITrick) => {
  const existing = loadStoredTricks()
  const updated = [...existing, trick]
  
  const data: StoredTricks = {
    version: CURRENT_VERSION,
    tricks: updated,
    lastUpdated: new Date().toISOString()
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
```

### Merge mit Mock Data
```typescript
// In der Anwendung
const getAllTricks = (): KITrick[] => {
  const mockData = mockTricks
  const storedData = loadStoredTricks()
  
  // Duplikate vermeiden (nach ID)
  const merged = [...mockData]
  
  storedData.forEach(stored => {
    if (!merged.some(m => m.id === stored.id)) {
      merged.push(stored)
    }
  })
  
  return merged
}
```

## UI/UX Design

### Form Layout
```
┌─────────────────────────────────────┐
│ Neuen KI-Trick erstellen           │
├─────────────────────────────────────┤
│ Titel *                             │
│ [____________________________]      │
│                                     │
│ Beschreibung *                      │
│ [____________________________]      │
│ [____________________________]      │
│ Vergiss nicht den Psychology Hook!  │
│                                     │
│ Kategorie *        Schwierigkeit *  │
│ [Dropdown ▼]       [Dropdown ▼]     │
│                                     │
│ Tools *                             │
│ ☐ Claude  ☐ Claude Code             │
│                                     │
│ Zeit *             Impact *         │
│ [________]         [Dropdown ▼]     │
│                                     │
│ Schritte                            │
│ 1. [________________________] [X]   │
│ 2. [________________________] [X]   │
│ [+ Schritt hinzufügen]              │
│                                     │
│ Beispiele (optional)                │
│ 1. [________________________] [X]   │
│ [+ Beispiel hinzufügen]             │
│                                     │
│ [Speichern] [Zurücksetzen]          │
└─────────────────────────────────────┘
```

### Dynamische Arrays
```typescript
// Schritte hinzufügen/entfernen
const [steps, setSteps] = useState<string[]>([''])

const addStep = () => {
  if (steps.length < 10) {
    setSteps([...steps, ''])
  }
}

const removeStep = (index: number) => {
  setSteps(steps.filter((_, i) => i !== index))
}

const updateStep = (index: number, value: string) => {
  const updated = [...steps]
  updated[index] = value
  setSteps(updated)
}
```

## Success Feedback

### Nach dem Speichern
```typescript
const [showSuccess, setShowSuccess] = useState(false)
const [savedTrick, setSavedTrick] = useState<KITrick | null>(null)

// Nach erfolgreichem Speichern
<div className="bg-green-50 border border-green-200 rounded-lg p-4">
  <h3 className="font-semibold text-green-800">
    Trick erfolgreich gespeichert!
  </h3>
  <p className="text-green-700">
    "{savedTrick.title}" wurde hinzugefügt.
  </p>
  <div className="flex gap-4 mt-4">
    <Link href={`/trick/${savedTrick.slug}`}>
      <Button variant="primary">Trick ansehen</Button>
    </Link>
    <Button 
      variant="secondary"
      onClick={() => resetForm()}
    >
      Weiteren Trick hinzufügen
    </Button>
  </div>
</div>
```

## Best Practices

### Content-Qualität sichern

1. **Title Guidelines**:
   - Aktiv & spezifisch
   - Nutzen klar erkennbar
   - Max. 100 Zeichen

2. **Description Template**:
```
[Hauptbeschreibung des Tricks]

**Warum es funktioniert:** [Psychologische/wissenschaftliche Erklärung]
```

3. **Steps Format**:
   - Beginne mit Verb
   - Konkrete Aktionen
   - Messbare Ergebnisse

4. **Examples Structure**:
   - "Beispiel X: [Situation] → [Ergebnis mit Zahlen]"

### Form State Management
```typescript
// Kompletter Form State
const [formData, setFormData] = useState<FormData>({
  title: '',
  description: '',
  category: 'productivity',
  difficulty: 'beginner',
  tools: [],
  timeToImplement: '',
  impact: 'medium',
  steps: [''],
  examples: []
})

// Generic Update Handler
const updateField = <K extends keyof FormData>(
  field: K, 
  value: FormData[K]
) => {
  setFormData(prev => ({ ...prev, [field]: value }))
}
```

## Error Handling

### Validierungs-Fehler
```typescript
{errors.title && (
  <p className="text-sm text-red-600 mt-1">
    {errors.title}
  </p>
)}
```

### localStorage Fehler
```typescript
try {
  saveTrick(newTrick)
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    alert('Speicher voll! Bitte alte Tricks löschen.')
  } else {
    console.error('Speicherfehler:', error)
    alert('Fehler beim Speichern. Bitte erneut versuchen.')
  }
}
```

## Zukünftige Features

### 1. Trick bearbeiten
```typescript
// Route: /admin/tricks/[id]/edit
const trick = getTrickById(id)
// Pre-fill form with existing data
```

### 2. Tricks verwalten
```typescript
// Route: /admin/tricks
// Liste aller Tricks mit:
// - Bearbeiten
// - Löschen
// - Exportieren
```

### 3. Bulk Import
```typescript
// JSON Upload
const handleFileUpload = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const tricks: KITrick[] = JSON.parse(e.target.result)
    // Validate & import
  }
  reader.readAsText(file)
}
```

### 4. Analytics
```typescript
// Tracking für Admin
interface TrickAnalytics {
  views: number
  favorites: number
  completions: number
  avgRating: number
}
```

## Security Considerations

1. **Keine direkte API**: Nur localStorage (Client-side)
2. **XSS Prevention**: Alle Inputs werden escaped
3. **Auth Session**: Läuft bei Browser-Close ab
4. **No CORS**: Keine externen Requests
5. **Input Limits**: Max Längen für alle Felder

## Testing Checklist

- [ ] Auth funktioniert (falsches Passwort → 401)
- [ ] Alle Pflichtfelder validiert
- [ ] Psychology Hook erzwungen
- [ ] Steps dynamisch hinzufügen/entfernen
- [ ] localStorage speichert korrekt
- [ ] Success-Message mit Links
- [ ] Form Reset funktioniert
- [ ] Gespeicherte Tricks in /tricks sichtbar
- [ ] Slug-Generierung korrekt (Umlaute)
- [ ] Mobile-responsive Form