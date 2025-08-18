# Supabase Setup Guide für KI-Tricks Platform

## 📋 Übersicht

Diese Anleitung führt dich durch die Integration von Supabase in die KI-Tricks Platform.

## 🚀 Schnellstart

### 1. Supabase Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com) und erstelle ein kostenloses Konto
2. Erstelle ein neues Projekt mit folgenden Einstellungen:
   - **Projektname**: `ki-tricks-platform`
   - **Datenbank Passwort**: Sicheres Passwort wählen (wird automatisch generiert)
   - **Region**: Frankfurt (eu-central-1) für beste Performance in Deutschland

### 2. Datenbank-Schema einrichten

1. Öffne den **SQL Editor** in deinem Supabase Dashboard
2. Kopiere den gesamten Inhalt von `supabase/schema.sql`
3. Führe das SQL-Script aus (grüner "Run" Button)

Das erstellt:
- ✅ Alle benötigten Tabellen (ki_tricks, trick_submissions, trick_analytics)
- ✅ Indexes für optimale Performance
- ✅ Row Level Security Policies
- ✅ Automatische Trigger und Funktionen

### 3. Environment Variables konfigurieren

1. Gehe zu **Settings > API** in deinem Supabase Dashboard
2. Kopiere folgende Werte:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Geheim halten!)

3. Erstelle `.env.local` im Projekt-Root:

```bash
cp .env.local.example .env.local
```

4. Füge deine Werte in `.env.local` ein:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

### 4. Daten migrieren

Führe das Migration-Script aus um die Mock-Daten zu importieren:

```bash
npm run migrate-to-supabase
```

Das Script:
- Importiert alle 40+ KI-Tricks aus `mock-data.ts`
- Migriert pending/approved Tricks aus JSON-Dateien
- Setzt alle Status-Flags korrekt

## 📝 Tricks direkt in Supabase eintragen

### Option 1: Supabase Table Editor (Empfohlen)

1. Öffne **Table Editor** in Supabase Dashboard
2. Wähle Tabelle `ki_tricks`
3. Klicke auf **Insert row**
4. Fülle die Felder aus:

```javascript
{
  title: "Dein KI-Trick Titel",
  description: "Beschreibung mit **Warum es funktioniert:**",
  category: "programming", // oder andere Kategorie
  difficulty: "intermediate",
  tools: ["Claude", "ChatGPT"], // Array!
  time_to_implement: "30 Minuten",
  impact: "high",
  steps: ["Schritt 1", "Schritt 2"], // Optional
  examples: ["Beispiel 1"], // Optional
  slug: "dein-trick-slug", // URL-freundlich
  why_it_works: "Erklärung warum es funktioniert",
  status: "published", // oder "draft"
  published_at: "NOW()" // Für sofortige Veröffentlichung
}
```

### Option 2: SQL Editor

```sql
INSERT INTO ki_tricks (
  title, description, category, difficulty, 
  tools, time_to_implement, impact, slug, 
  why_it_works, status, published_at
) VALUES (
  'Mein neuer KI-Trick',
  'Beschreibung hier...',
  'productivity',
  'beginner',
  ARRAY['Claude', 'ChatGPT'],
  '15 Minuten',
  'medium',
  'mein-neuer-ki-trick',
  'Funktioniert weil...',
  'published',
  NOW()
);
```

### Option 3: Admin Dashboard (Coming Soon)

Das Admin-Dashboard wird bald Supabase-Integration haben für:
- Trick-Verwaltung mit Live-Preview
- Bulk-Import/Export
- Quality Scoring
- Analytics Dashboard

## 🔧 Entwicklung

### Lokale Entwicklung

```bash
npm run dev
```

Die App nutzt automatisch Supabase wenn die Environment Variables gesetzt sind.

### Service Layer verwenden

```typescript
import { TricksService } from '@/lib/services/tricks.service'

// Alle published Tricks abrufen
const tricks = await TricksService.getPublishedTricks()

// Trick by Slug
const trick = await TricksService.getTrickBySlug('mein-trick')

// Tricks filtern
const filtered = await TricksService.getFilteredTricks({
  categories: ['programming'],
  difficulty: ['beginner'],
  search: 'Claude'
})
```

### Real-time Updates (Optional)

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Subscribe to new tricks
supabase
  .channel('tricks')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'ki_tricks' },
    (payload) => {
      console.log('Neuer Trick!', payload.new)
    }
  )
  .subscribe()
```

## 📊 Analytics

Automatisches Tracking in `trick_analytics`:
- Page Views
- Likes
- Shares
- Implementation Clicks

Abrufen mit:

```sql
-- Top 10 Tricks by Views
SELECT t.title, t.view_count 
FROM ki_tricks t 
ORDER BY view_count DESC 
LIMIT 10;

-- Analytics Events
SELECT 
  event_type, 
  COUNT(*) as count 
FROM trick_analytics 
GROUP BY event_type;
```

## 🔐 Sicherheit

### Row Level Security (RLS)

- ✅ Public kann nur `published` Tricks sehen
- ✅ Submissions können von allen erstellt werden
- ✅ Nur Admins können Tricks bearbeiten/löschen
- ✅ Analytics für alle zugänglich

### Best Practices

1. **Niemals** `SUPABASE_SERVICE_ROLE_KEY` im Frontend verwenden
2. Immer Server Components für sensitive Operationen
3. RLS Policies regelmäßig überprüfen
4. Backups aktivieren (automatisch bei Supabase)

## 🚨 Troubleshooting

### "Missing Supabase environment variables"

→ Stelle sicher dass `.env.local` existiert und alle Variablen gesetzt sind

### "Table does not exist"

→ Führe `supabase/schema.sql` im SQL Editor aus

### "Permission denied"

→ Prüfe RLS Policies oder nutze Admin-Client für Admin-Operationen

### Build Fehler

→ Führe `npm run build` aus und prüfe TypeScript-Fehler

## 📚 Weitere Ressourcen

- [Supabase Docs](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [RLS Best Practices](https://supabase.com/docs/guides/auth/row-level-security)

## 🎉 Fertig!

Deine KI-Tricks Platform ist jetzt mit Supabase verbunden! Du kannst:
- ✅ Tricks direkt in Supabase Dashboard verwalten
- ✅ Real-time Updates nutzen
- ✅ Analytics tracken
- ✅ Skalieren auf Millionen von Tricks

Bei Fragen: Schau in die Supabase Dashboard Logs oder kontaktiere den Support!