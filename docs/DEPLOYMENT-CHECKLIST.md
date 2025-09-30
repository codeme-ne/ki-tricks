# Deployment Checklist für Vercel

## ✅ Bereits implementiert

- [x] ISR auf Homepage (`revalidate = 60`)
- [x] ISR auf Tricks-Übersicht (`revalidate = 60`)
- [x] ISR auf einzelnen Trick-Seiten (`revalidate = 60`)
- [x] On-Demand Revalidation API (`/api/revalidate`)
- [x] Automatische Revalidation im Import-Script
- [x] REVALIDATION_SECRET lokal generiert und in `.env.local` gesetzt

## 🚀 Deployment-Schritte

### 1. Vercel Environment Variables setzen

Gehe zu: https://vercel.com/dashboard → ki-tricks → Settings → Environment Variables

Füge folgende Variable hinzu:

```
REVALIDATION_SECRET=132711c70462b2a88b3b4d57089a5c23bf4046c4472c0980200c4cdbf8b7097a
```

**Wichtig:**
- Setze für **Production** ✅
- Setze für **Preview** ✅
- Setze für **Development** (optional)

### 2. Deployment auslösen

**Option A: Via Git Push (Empfohlen)**
```bash
git add .
git commit -m "Add ISR and cache revalidation"
git push origin main
```

**Option B: Via Vercel CLI**
```bash
vercel --prod
```

**Option C: Via Vercel Dashboard**
- Gehe zu Deployments → Redeploy

### 3. Verify Deployment

Nach erfolgreichem Deployment:

```bash
# Check Homepage Cache
curl -I https://www.ki-tricks.com/
# Suche nach: x-vercel-cache: HIT oder MISS

# Check Tricks Page Cache
curl -I https://www.ki-tricks.com/tricks
# Suche nach: x-vercel-cache: HIT oder MISS

# Test Revalidation API
curl -X POST https://www.ki-tricks.com/api/revalidate \
  -H "Authorization: Bearer 132711c70462b2a88b3b4d57089a5c23bf4046c4472c0980200c4cdbf8b7097a" \
  -H "Content-Type: application/json" \
  -d '{"path": "/tricks"}'
# Erwarte: {"revalidated": true, ...}
```

## 🔄 Nach Import neuer Tricks

Wenn du neue Tricks importierst, passiert **automatisch**:

```bash
npm run import-tricks:file -- data/new-tricks.json
```

1. ✅ Tricks werden in Supabase importiert
2. ✅ Script ruft Revalidation-API auf
3. ✅ Vercel Cache wird invalidiert
4. ✅ Neue Tricks sind innerhalb weniger Sekunden live

**Falls Revalidation fehlschlägt:**
- Tricks sind trotzdem importiert
- Cache wird nach 60 Sekunden automatisch aktualisiert (ISR)

## 📊 Monitoring

### Cache-Performance prüfen

```bash
# Homepage
curl -I https://www.ki-tricks.com/

# Tricks-Übersicht
curl -I https://www.ki-tricks.com/tricks

# Spezifischer Trick
curl -I https://www.ki-tricks.com/trick/instagram-captions-in-90-sekunden
```

**Response Headers beachten:**
- `x-vercel-cache: HIT` → Seite wurde aus Cache geliefert ✅
- `x-vercel-cache: MISS` → Seite wurde neu generiert
- `x-vercel-cache: STALE` → Cache ist abgelaufen, wird aktualisiert

### Vercel Logs ansehen

```bash
# Real-time Logs
vercel logs --follow

# Letzte 100 Logs
vercel logs
```

## 🐛 Troubleshooting

### Problem: Neue Tricks nach 5 Minuten noch nicht sichtbar

**Diagnose:**
```bash
# 1. Prüfe ob Tricks in Supabase sind
# Gehe zu Supabase Studio → ki_tricks Tabelle

# 2. Prüfe Cache-Status
curl -I https://www.ki-tricks.com/tricks

# 3. Force Revalidation
curl -X POST https://www.ki-tricks.com/api/revalidate \
  -H "Authorization: Bearer YOUR_SECRET" \
  -d '{"path": "/tricks"}'
```

**Lösung:**
1. Wenn 401 Unauthorized → Prüfe REVALIDATION_SECRET in Vercel
2. Wenn Tricks in DB → Manual Redeploy via Vercel Dashboard
3. Wenn gar nichts hilft → Vercel Support kontaktieren

### Problem: Revalidation API gibt 401

**Ursache:** `REVALIDATION_SECRET` fehlt oder ist falsch in Vercel

**Lösung:**
1. Gehe zu Vercel → Settings → Environment Variables
2. Prüfe ob `REVALIDATION_SECRET` gesetzt ist
3. Vergleiche mit lokalem `.env.local`
4. Nach Änderung: Redeploy erforderlich

### Problem: Cache wird nicht invalidiert

**Diagnose:**
```bash
# Prüfe ob API erreichbar ist
curl https://www.ki-tricks.com/api/revalidate

# Sollte 401 zurückgeben (nicht 404)
```

**Lösung:**
1. Stelle sicher, dass `/api/revalidate/route.ts` deployed wurde
2. Check Vercel Deployment Logs
3. Prüfe ob Build erfolgreich war

## 📝 Deployment Notes

- **ISR Interval:** 60 Sekunden (kann in page.tsx angepasst werden)
- **Automatische Revalidation:** Bei jedem Trick-Import
- **Manuelle Revalidation:** Via API oder Vercel Redeploy
- **Fallback:** ISR aktualisiert Cache automatisch nach 60s, auch wenn API fehlschlägt