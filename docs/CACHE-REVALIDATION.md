# Cache Revalidation Strategy

## Implementierte Lösung

### 1. ISR (Incremental Static Regeneration)
Alle Haupt-Seiten nutzen ISR mit 60 Sekunden Revalidation:

- `/` (Homepage) → `revalidate = 60`
- `/tricks` (Tricks-Übersicht) → `revalidate = 60`
- `/trick/[slug]` (Einzelne Tricks) → `revalidate = 60`

**Was bedeutet das?**
- Vercel cached die Seiten für bessere Performance
- Nach 60 Sekunden wird der Cache automatisch aktualisiert
- Neue Tricks sind spätestens nach 1 Minute sichtbar

### 2. On-Demand Revalidation API
Für sofortige Cache-Invalidierung nach Trick-Import/Update:

**Endpoint:** `POST /api/revalidate`

**Authentifizierung:**
```bash
Authorization: Bearer <REVALIDATION_SECRET>
```

**Payload:**
```json
{
  "path": "/tricks",
  "tag": "optional-tag"
}
```

**Beispiel-Request:**
```bash
curl -X POST https://www.ki-tricks.com/api/revalidate \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"path": "/tricks"}'
```

**Response:**
```json
{
  "revalidated": true,
  "path": "/tricks",
  "now": 1234567890
}
```

### 3. Automatische Revalidation beim Import
Der Import-Script ruft automatisch die Revalidation-API auf:

```bash
npm run import-tricks:file -- data/transformed-tricks.json
```

Nach erfolgreichem Import werden automatisch revalidiert:
- `/tricks` (Tricks-Übersicht)
- `/` (Homepage)
- `/trick/[slug]` (Alle einzelnen Trick-Seiten)

## Setup

### Environment Variables

Füge zu `.env.local` hinzu:
```bash
# Revalidation API Secret (für Cache-Invalidierung)
REVALIDATION_SECRET=your-secure-random-string
```

Generiere einen sicheren Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Vercel Environment Variables

Stelle sicher, dass diese Variablen auch in Vercel gesetzt sind:
1. Gehe zu Vercel Dashboard → Project Settings → Environment Variables
2. Füge `REVALIDATION_SECRET` hinzu (Production + Preview)

## Workflow beim Trick-Import

1. **Lokaler Import:**
   ```bash
   npm run import-tricks:file -- data/new-tricks.json
   ```

2. **Automatische Revalidation:**
   - Script importiert Tricks in Supabase
   - Script ruft `/api/revalidate` auf
   - Vercel invalidiert Cache für alle Tricks-Seiten

3. **Sofortige Sichtbarkeit:**
   - Neue Tricks sind innerhalb weniger Sekunden live
   - Keine manuelle Revalidation nötig

## Manueller Cache-Clear (Falls nötig)

### Via API (Empfohlen):
```bash
# Alle Tricks-Seiten
curl -X POST https://www.ki-tricks.com/api/revalidate \
  -H "Authorization: Bearer $REVALIDATION_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"path": "/tricks"}'

# Homepage
curl -X POST https://www.ki-tricks.com/api/revalidate \
  -H "Authorization: Bearer $REVALIDATION_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"path": "/"}'

# Spezifischer Trick
curl -X POST https://www.ki-tricks.com/api/revalidate \
  -H "Authorization: Bearer $REVALIDATION_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"path": "/trick/instagram-captions-in-90-sekunden"}'
```

### Via Vercel Dashboard:
1. Gehe zu Vercel Dashboard → Deployments
2. Klicke auf "Redeploy" für sofortigen Full-Rebuild

## Monitoring

### Cache-Status prüfen:
```bash
# Homepage
curl -I https://www.ki-tricks.com/

# Tricks-Übersicht
curl -I https://www.ki-tricks.com/tricks

# Response Headers checken:
# x-vercel-cache: HIT (cached) oder MISS (neu generiert)
```

### Logs prüfen:
```bash
# Vercel Deployment Logs ansehen
vercel logs --follow
```

## Troubleshooting

### Problem: Neue Tricks nicht sichtbar

**Lösung 1:** Warte 60 Sekunden (ISR Interval)

**Lösung 2:** Manuelle Revalidation via API
```bash
curl -X POST https://www.ki-tricks.com/api/revalidate \
  -H "Authorization: Bearer $REVALIDATION_SECRET" \
  -d '{"path": "/tricks"}'
```

**Lösung 3:** Vercel Redeploy

### Problem: API gibt 401 Unauthorized

**Ursache:** `REVALIDATION_SECRET` fehlt oder ist falsch

**Lösung:**
1. Prüfe `.env.local` lokal
2. Prüfe Vercel Environment Variables
3. Redeploy nach Änderung

### Problem: ISR funktioniert nicht lokal

**Ursache:** ISR funktioniert nur in Production (Vercel)

**Lösung:** 
- Lokal: `npm run dev` lädt immer frische Daten (kein Cache)
- Testen: Deploy auf Vercel Preview Branch

## Best Practices

1. **Nach jedem Trick-Import:** Automatische Revalidation via Script
2. **Bei Schema-Änderungen:** Full Redeploy auf Vercel
3. **Bei Datenbank-Problemen:** Nicht Cache revalidieren, sondern Supabase-Daten prüfen
4. **Monitoring:** Regelmäßig `x-vercel-cache` Headers prüfen

## Weitere Ressourcen

- [Next.js ISR Docs](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Vercel Cache Docs](https://vercel.com/docs/edge-network/caching)
- [Next.js Revalidation API](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating)