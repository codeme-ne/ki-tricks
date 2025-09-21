# Quellen & Watchlist (MVP)

Ziel: Verlässliche, überprüfbare Quellen für Guides. Priorität: Primärquellen (Vendor/Regulatorik) > Integrationen > Fachmedien DACH.

Hinweis: Feeds/URLs in `config/sources.json` pflegen. Jede Quelle mit Prüffrequenz und Evidenzlevel (A/B/C).

## Evidenzlevel
- A: Offizielle Hersteller‑Dokumentation/Changelog/Regulatorik
- B: Hersteller‑Blog/Engineering/Whitepaper
- C: Fachmedien/Community (nur nach Verifikation)

## Kategorien & Beispiele (Platzhalter)
- Modelle/Plattformen (A/B)
  - OpenAI, Anthropic, Google AI/Workspace, Microsoft (M365/Copilot)
- Produkt‑Ökosystem (A/B)
  - Notion, Slack, Zoom, Atlassian, HubSpot, Salesforce
- Integrationen (A/B)
  - Make, Zapier, n8n, Power Automate, Google Workspace Add‑ons
- Regulatorik/Standards (A)
  - BfDI/DSK (DE), EDÖB (CH), DSB (AT), EDPB (EU), ISO/NIST
- Fachmedien DACH (C)
  - heise, t3n, Golem, Computerwoche, (Wirtschaft: Handelsblatt/NZZ)

Bitte konkrete Feed‑Links im Team ergänzen. Beispiele (müssen geprüft werden):
- RSS/Atom Feeds: /feed, /rss, /atom, /blog/rss, /changelog.xml
- Sitemaps: /sitemap.xml, /news/sitemap.xml

## Pflicht‑Metadaten je Item
- title, url, source, published_at, tags
- content_hash (für Dedupe)
- raw (Originalpayload)

## Redaktions‑Checkliste (Kurz)
- Reproduzierbarkeit in ≤ 15 Min bestätigt
- Schritte/Beispiele klar; deutsch (DACH), Ton professionell
- Evidenzlevel + Quellen gesetzt; "Zuletzt geprüft" gepflegt
- Rolle/Branche/Tools passend
- Datenschutz/Policy‑Hinweise ergänzt, falls relevant

