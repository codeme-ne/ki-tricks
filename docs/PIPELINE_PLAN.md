# Content Pipeline MVP (DACH) — Plan & Definition of Done

Ziel: Automatisiert hochwertige, leicht verdauliche Materialien (kurze, umsetzbare Guides) aus verlässlichen Quellen erzeugen, inkl. automatisierter Aufbereitung (Struktur, Bilder/Screenshots) und SEO‑Optimierung. Fokus: Einfach, schlank, anschlussfähig an das bestehende System.

North‑Star Metric: veröffentlichte, qualitativ geprüfte Guides/Woche (Ziel: 10+/Woche)

## 1) Scope & Nicht‑Ziele
- Scope (MVP)
  - Guides (How‑Tos) als primärer Inhaltstyp; optional Prompts als Anhang.
  - Automatisiertes Einsammeln (Feeds/HTTP), Normalisieren, Kuratieren (Queue), Formattieren (Schritte/Beispiele), Screenshot/Hero‑Bild, Publizieren, SEO.
- Nicht‑Ziele (MVP)
  - Kommentare/Likes/Bookmarks, komplexe Community‑Funktionen.
  - Komplexe Mini‑Apps. (später)

## 2) Pipeline‑Architektur (End‑to‑End)
1. Source Fetcher
   - Zieht neue Einträge aus konfigurierten Feeds/URLs (vendor docs, changelogs, regulatorik, fachmedien DACH) und schreibt sie als Rohdaten in `news_items` (Supabase) oder `staging_items`.
2. Normalizer
   - Vereinheitlicht Felder (title, url, source, published_at, tags) und berechnet `content_hash` zur Deduplizierung.
3. Curator Queue (Admin)
   - Einfache Review‑UI: Item bewerten, Zieltyp wählen (Guide), Rolle/Branche/Tools zuordnen, Quelle/Evidenzlevel setzen.
4. Formatter
   - Erzeugt Guide‑Struktur: `title`, `summary`, `steps[]` (5–8 schlanke Schritte), `examples[]`, `role`, `industries[]`, `tools[]`, `sources`, `risk_level`, `evidence_level`.
   - Nutzt vorhandene Qualitätssignale (Länge/Struktur) und Duplikat‑Check als Vorabprüfung.
5. Screenshot Service
   - Erzeugt Hero‑Screenshot (Quelle/Tool) via Headless Browser (Playwright) oder externer Screenshot‑API; speichert in Supabase Storage; URL in Guide.
6. Publisher
   - Persistiert als `guides` (status `published`) und aktualisiert Sitemap/Schema; interne Verlinkungen zu Rollen/Branchen/Tricks/Prompts.
7. SEO & Indexer
   - Generiert Slug, Canonical, Schema.org (HowTo), aktualisiert Sitemaps. Interne Verlinkungen (mind. 3/Seite).
8. Monitoring
   - Metriken: Views, Implement‑Events, Durchlaufzeit, Publikationsrate, Fehlerquote.

## 3) Datenmodell (MVP)
- `news_items` (rohe Quellen)
  - id, url (UNIQUE), title, source, published_at, tags[], content_hash, raw JSONB, processed boolean, created_at, updated_at
- `guides` (Materialien)
  - id, slug, title, summary, steps TEXT[], examples TEXT[], role (company_role_enum), industries TEXT[], tools TEXT[], hero_image_url, sources JSONB, risk_level, evidence_level, status, created_at, updated_at, published_at, view_count, implement_count
- Storage
  - Bucket `materials` für Screenshots/Bilder

Hinweis: `company_role_enum`, `risk_level_enum`, `evidence_level_enum` existieren bereits (siehe Migrations). `sources`‑Feld ist in `ki_tricks` schon vorgesehen; für `guides` ebenfalls vorsehen.

## 4) Umsetzung als Tasks (mit DoD)

T0 — Projektgrundlagen
- Inhalte: Diese Datei, SOURCES.md, `config/sources.example.json`.
- DoD: Dateien liegen im Repo; Team versteht Scope/Flow.

T1 — Migrationen (DB)
- Inhalte: SQL für `news_items`, `guides` (inkl. Indexe, RLS: Public SELECT `published`, Admin ALL). Storage‑Bucket `materials` (manuell im Supabase Studio, Dokumentation).
- DoD: Tabellen vorhanden; RLS aktiv; Policies getestet (Public kann veröffentlichte Guides sehen).

T2 — Source Fetcher (Script)
- Inhalte: `scripts/pipeline/fetch-feeds.ts` liest `config/sources.json`, holt Feeds/URLs, schreibt normalisierte Items nach `news_items` mit `processed=false`.
- DoD: Lokaler Test mit 3 Dummy‑Feeds; Dedupe via `content_hash`; Logging/Retry vorhanden.

T3 — Normalizer & Dedupe
- Inhalte: Normalisierungspipeline (Titel säubern, Quelle erkennen, Datum parsen, Tags ableiten), Hashbildung; Markierung von Duplikaten.
- DoD: 100% Einträge normiert; keine Duplikate in `news_items` (UNIQUE/UPSERT + Hashprüfung).

T4 — Curator Queue (Admin‑UI)
- Inhalte: `/admin/queue` mit Tabelle (news_items), Aktionen: "Zu Guide vorschlagen", Felder: role/industries/tools/evidence/risk, Vorschau.
- DoD: Ausgewählter Eintrag erzeugt Draft in `guides` (status `pending`); Felder korrekt gemappt.

T5 — Formatter (Guide‑Generator)
- Inhalte: Server‑Action/Script `format-guide.ts` → erzeugt `summary`, `steps`, `examples` (Heuristik + Templates). Nutzung bestehender `quality-scoring` & `duplicate-detection` (angepasst für Guides).
- DoD: Draft erhält valide Struktur; Quality‑Score >= 70; Duplicate‑Warnung angezeigt.

T6 — Screenshot Service
- Inhalte: API‑Route `/api/screenshot?url=...` (Playwright) ODER externer Screenshot‑Dienst; Upload nach Supabase Storage; Pfad in `hero_image_url` speichern.
- DoD: Für 3 Test‑URLs Bild gespeichert (<300KB, WebP), 95% Erfolgsrate, Timeout/Retry vorhanden.

T7 — Publisher & SEO
- Inhalte: UI‑Aktion "Veröffentlichen"; Slug/Cleanup; Schema.org HowTo; Sitemaps (guides) + Canonicals.
- DoD: `/learn` (Liste) und `/learn/[slug]` (Detail) laufen; strukturierte Daten validieren; Sitemap enthält Eintrag.

T8 — Implement‑Events (Light Feedback)
- Inhalte: "Umgesetzt"‑Button (sessionStorage‑Dedupe), Counter‑Anzeige; Ranking nutzt Views+Implement.
- DoD: Events werden in Analytics erfasst; Startseite „Trending Guides“ korrekt.

T9 — Betrieb (Cron/Monitoring)
- Inhalte: Vercel Cron (täglich) für Fetcher; Fehler‑Alerts (min. Logging/Email); Kennzahlen Dashboard simpel (Anzahl neue Items, veröffentlichte Guides/Woche).
- DoD: 7 Tage stabil; 0 kritische Fehler; NSM ≥ Ziel.

## 5) Qualitätsrichtlinien (DoD je Guide)
- Reproduzierbar in ≤ 15 Min; 5–8 klare Schritte; 1–2 Beispiele.
- Quellen verlinkt; "Zuletzt geprüft" + Tool/Version; DACH‑Hinweis (Datenschutz/Policy) wenn relevant.
- Rolle/Branche/Tools gepflegt; risk_level/evidence_level gesetzt.
- Deutsch (DACH), neutral‑professioneller Ton; SEO‑Title/Meta gesetzt; interne Links ≥ 3.

## 6) Risiken & Gegenmaßnahmen
- Webseitenänderungen/Parsing bricht → robuste Feeds bevorzugen, Fallbacks, Monitoring.
- Screenshot‑Flakes → Timeout/Retry, Exponential Backoff, alternative Anbieter.
- Qualitätsstreuung → Curator‑Gate + Quality‑Score; kleine Redaktions‑Checkliste.
- DSGVO/Compliance → Checklisten‑Bausteine + Quellenpflicht.

## 7) Testplan
- Unit: Normalisierung, Hash, Slug, Score, Duplicate‑Check.
- E2E: Feed→news_items→Draft→Screenshot→Publish→SEO Validator.
- Load: 200 Items/Run; 10 Guides/Woche.

---

Owner: Produkt/Redaktion. Technik: Pipelines/Platform. Review: wöchentlich.

