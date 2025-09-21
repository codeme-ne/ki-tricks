# Pipeline Scripts

Dieses Verzeichnis enthält Hilfsskripte für die Content-Pipeline. Das wichtigste Skript ist `fetch-feeds.ts`, das konfigurierte Quellen ausliest und neue Items in `news_items` schreibt.

## Lokaler Test mit Dummy-Feeds

1. Verwende die mitgelieferte Dummy-Konfiguration und drei Beispiel-RSS-Feeds:
   ```bash
   tsx scripts/pipeline/fetch-feeds.ts --config config/sources.dummy.json
   ```
2. Das Skript liest lokale Dateien (`scripts/pipeline/__fixtures__/*.xml`) über das `file:`-Schema, normalisiert die Items und dedupliziert sie via `content_hash`.
3. Die Ausgabe auf der Konsole zeigt, wie viele Items pro Quelle geparst wurden und wie viele Datensätze in `news_items` geschrieben wurden. Doppelte GUID/Links werden ignoriert.

> Hinweis: Stelle sicher, dass deine `.env.local` die Variablen `NEXT_PUBLIC_SUPABASE_URL` und `SUPABASE_SERVICE_ROLE_KEY` enthält, damit der Supabase-Client funktioniert.

## Produktiver Betrieb

- Pflegen die produktiven Quellen in `config/sources.json`.
- Ein Supabase Storage Bucket `materials` muss manuell im Supabase Studio angelegt werden (für Screenshots/Hero-Bilder, siehe Pipeline-Plan T1).
- Für geplante Ausführung (z. B. Vercel Cron) kann das Skript ohne zusätzliche Flags ausgeführt werden.
