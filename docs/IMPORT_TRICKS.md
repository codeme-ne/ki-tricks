# Importing KI Tricks (simple JSON → Supabase → website)

Use this guide to add many tricks at once with a single JSON file. The repo validates on PR and auto-imports to Supabase on merge to main. The website reads from Supabase at request-time, so changes show up after a normal refresh.

## TL;DR

1. Put your array into `data/my-tricks.json` (use the template).

1. Validate locally:

  ```bash
  npm run -s import-tricks:validate-file -- data/my-tricks.json
  ```

1. Import locally (instant on website):

  ```bash
  npm run -s import-tricks:file -- data/my-tricks.json
  ```

  Or commit + PR (validation) → merge to main (auto-import).

## 1) JSON format

- File lives in `data/your-tricks.json`
- Either a single object or an array of objects.
- Required fields: `title`, `description`, `category`
- Optional: `tools[]`, `steps[]`, `examples[]`, `slug`, `why_it_works`
- If `why_it_works` is missing, the script extracts it from the end of `description` when written like:
  - `**Warum es funktioniert:** …`
- If `slug` is missing, it’s generated from `title`.
- Category must be one of:
  - `productivity`, `content-creation`, `programming`, `design`, `data-analysis`, `learning`, `business`, `marketing`

Example entry:

```json
{
  "title": "YouTube-Video in 5 Stichpunkten zusammenfassen",
  "description": "…\n\n**Warum es funktioniert:** …",
  "category": "productivity",
  "tools": ["YouTube", "ChatGPT"],
  "steps": ["…", "…"],
  "examples": ["…"]
}
```

Tip: Use `data/tricks-template.simple.json` as a starting point.

## 2) Local validate and import

Prepare `.env.local` (not committed):

- `NEXT_PUBLIC_SUPABASE_URL=…`
- `SUPABASE_SERVICE_ROLE_KEY=…`

Validate (no DB writes):

```bash
npm run -s import-tricks:validate-file -- data/your-tricks.json
```

Import (upsert by `slug`):

```bash
npm run -s import-tricks:file -- data/your-tricks.json
```

## 3) CI auto-import on main

Workflow: `.github/workflows/import-tricks.yml`

- Pull Request: validates changed `data/*.json`
- Push to `main`: imports the changed `data/*.json`

Required GitHub Actions secrets (Repository → Settings → Secrets → Actions):

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 4) Behavior and constraints

- Upsert conflict target: `slug`
- Default status: `published` (visible immediately)
- Site fetches data from Supabase per request (no rebuild needed)
- Arrays (`tools`, `steps`, `examples`) are supported; empty arrays are fine

## 5) Common pitfalls

- Duplicate `slug` inside the same JSON can overwrite earlier items in the batch. The validator will now flag duplicates.
- Invalid `category` will fail validation/import.
- Missing Supabase secrets in CI prevents import after merge.

## 6) Nice-to-have extensions (optional)

- Import all changed JSONs in one commit (current workflow imports the first match; easy to extend).
- Add a moderation path (import into `trick_submissions`, then approve to publish).
