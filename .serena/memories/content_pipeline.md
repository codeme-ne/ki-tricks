# Content Pipeline Highlights
- Scripts live in `scripts/pipeline/` with fixtures & docs; orchestrate fetch → normalize → curate → format flow.
- **Fetch** (`fetch-feeds.ts`): reads `config/sources.json` (or dummy sources) to pull feeds, storing raw items in Supabase `news_items` (processed=false).
- **Normalize** (`normalize-news-items.ts`): cleans titles/URLs, enriches tags, dedupes via `content_hash`, marks duplicates.
- **Curate** (`curator.ts` / admin UI): editors assign roles, industries, evidence/risk, move item toward guide creation.
- **Format Guides** (`format-guides.ts`): fills summaries, steps, examples, enforces quality score ≥70.
- Dummy run: `tsx scripts/pipeline/fetch-feeds.ts --config config/sources.dummy.json` with local fixtures; requires Supabase env vars.
- Supabase migrations under `supabase/migrations/` define `news_items`, `guides`, enums, RLS.
- Refer to `docs/PIPELINE_PLAN.md` for detailed roadmap and definition-of-done per stage.