Pipeline Status — Content Pipeline (Stand: aktuell)

Was ist fertig
- DB: Tabellen news_items und guides inkl. Indizes/Unique + RLS (Migrationen im Repo)
- Dedupe-Felder: is_duplicate und duplicate_of (Migration hinzugefügt)
- Fetcher: scripts/pipeline/fetch-feeds.ts (liest Quellen, speichert normalisiert grob in news_items)
- Normalizer: scripts/pipeline/normalize-news-items.ts (Titel/URL säubern, Quelle/Tags/Datum ableiten, Hash, Duplikate markieren)
- Curator Queue (Admin):
  - API: /api/admin/news-items (GET Liste, POST „Zu Guide vorschlagen“)
  - UI: /admin/queue (Auswahl, Felder role/industries/tools/evidence/risk, Vorschau)
- Guide Formatter:
  - Service: src/lib/services/guide-formatter.ts (Summary/Steps/Examples, Quality-Score, Duplicate-Check)
  - Script: scripts/pipeline/format-guides.ts (füllt pending Guides auf)
- Screenshot API: /api/screenshot (Puppeteer, Upload in Supabase Storage Bucket „materials“)
- Publisher Flow (Admin):
  - API: /api/admin/guides (GET pending + Dubletten, PUT publish)
  - UI: /admin/guides/pending (Screenshot aktualisieren, Veröffentlichen)
- Learn-Seiten: /learn (Liste) und /learn/[slug] (Detail mit HowTo/Breadcrumb Schema)
- Sitemap: Guides werden ergänzt; /sitemap.xml enthält /learn und einzelne Guides
- NPM-Skripte: pipeline:normalize, pipeline:format-guides

Was du jetzt tun musst (Schritt für Schritt)
1) Supabase verknüpfen und Migrationen ausrichten
   - supabase login
   - supabase link --project-ref <DEIN_PROJECT_REF>
   - supabase migration list (prüfen, ob „remote only“ Versionen existieren)
   - supabase migration fetch (remote-only Dateien holen) ODER
     supabase migration repair --status reverted <VERSION> (einzelne remote-only Versionen zurücksetzen)
   - supabase db push (führt lokale Migrationen aus, inkl. is_duplicate/duplicate_of)

2) Storage-Bucket anlegen (einmalig, für Screenshots)
   - Im SQL-Editor deines Projekts ausführen:
     select storage.create_bucket('materials', public => true);
   - Optional: Public-Read-Policy für Objekte im Bucket „materials“ setzen.

3) .env.local prüfen
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

4) Daten normalisieren und Guides vorbereiten
   - npm run pipeline:normalize
   - npm run pipeline:format-guides

5) Manuelle Kuratierung und Veröffentlichung
   - /admin/queue: Einträge prüfen, „Zu Guide vorschlagen“ (legt Guide mit status=pending an)
   - /admin/guides/pending: Screenshot aktualisieren und „Veröffentlichen“
   - /learn + /learn/[slug]: Sichtprüfung Liste/Detail (Hero, Steps, Examples)
   - /sitemap.xml: Prüfen, dass der Guide enthalten ist

Nützliche Befehle
- supabase migration list
- supabase migration fetch
- supabase migration repair --status reverted <VERSION>
- supabase db push
- npm run pipeline:normalize
- npm run pipeline:format-guides

Offene Punkte / Nice-to-have
- Cron einrichten (z. B. Vercel Cron) für Fetcher → Normalizer → Formatter
- Screenshot-Fehlerfälle/Fallbacks weiter verhärten; Timeouts/Retry sind vorhanden
- E2E-Checkliste und kleine Unit-Tests für Formatter/Normalizer
- Interne Verlinkungen und weitere SEO-Feinheiten ausbauen

Hinweise
- Admin-APIs erwarten Basic-Auth; die Admin-UI fragt per Prompt nach dem Passwort (AdminAuth).
- Bei Lint/Build: npm run lint (aktuell sauber).
