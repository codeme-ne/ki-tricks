# PRD: Simplify Supabase schema to strict minimum

Owner: lukasz • Date: 2025-09-15 • Status: Draft

## 1) Problem & Goal
The current `public.ki_tricks` table includes many optional/research fields not used by the app. This increases schema complexity, types bloat, and migration surface. We want a strict minimal schema that keeps the app fully functional.

Goal: Remove all non-essential columns and related indexes/policies, keep submissions and analytics tables, and update app code/types accordingly.

## 2) Current state (local)
Tables
- public.ki_tricks
  - Core used fields: id, title, description, category, tools[], steps[], examples[], slug (unique), why_it_works,
    status, created_at, updated_at, published_at, view_count, quality_score
  - Extra fields: quality_category, like_count, created_by, reviewed_by, role, industries[], tool_vendor,
    integrations[], estimated_time_minutes, estimated_savings_minutes, risk_level, evidence_level,
    prerequisites, privacy_notes, sources (jsonb), prompt_examples[], kpi_suggestions[]
- public.trick_submissions (used)
- public.trick_analytics (used)

RLS
- Enabled on `ki_tricks`, minimal policies exist (public view of published; authenticated manage).

Helpers
- update_updated_at_column trigger + function
- increment_view_count function

## 3) Proposed strict-minimal schema
Keep (ki_tricks)
- id (uuid, PK)
- title (text)
- description (text)
- category (text with fixed enums via CHECK)
- tools (text[])
- steps (text[])
- examples (text[])
- slug (text unique)
- why_it_works (text)
- status (text enum-like via CHECK: draft|pending|published|rejected)
- quality_score (integer)
- created_at (timestamptz), updated_at (timestamptz)
- published_at (timestamptz)
- view_count (integer)

Drop (ki_tricks)
- quality_category, like_count, created_by, reviewed_by
- role, industries, tool_vendor, integrations
- estimated_time_minutes, estimated_savings_minutes, risk_level, evidence_level
- prerequisites, privacy_notes, sources, prompt_examples, kpi_suggestions

Indexes to keep
- ki_tricks_slug_key (unique)
- idx_tricks_category, idx_tricks_status, idx_tricks_published_at

Tables to keep intact
- public.trick_submissions (used by submission flow)
- public.trick_analytics (used by tracking)

RLS
- Keep existing minimal RLS on `ki_tricks` and submissions/analytics.

## 4) Migration plan
SQL (new migration, e.g., `20250915_minimal_schema_cleanup.sql`):
- ALTER TABLE public.ki_tricks DROP COLUMN IF EXISTS ... (all extras listed above)
- DROP INDEX IF EXISTS for any indexes referencing dropped columns (currently none in repo except potential research indexes; verify and drop idx_tricks_role/tool_vendor/evidence_level/risk_level if exist)
- Optional: DROP TYPE IF NOT EXISTS for `company_role_enum`, `risk_level_enum`, `evidence_level_enum` if no longer referenced

Idempotency
- Use `IF EXISTS` to allow multiple runs and remote application.

## 5) App code updates
- Remove `role` badge rendering in:
  - `src/components/enhanced/RefinedTrickCard.tsx`
  - `src/components/molecules/TrickCard.tsx`
- Ensure any filters, sorts, or selects don’t depend on dropped fields.
- Regenerate Supabase TS types after migration:
  - `supabase gen types typescript --local > src/lib/supabase/types.ts`
- Sanity check service methods:
  - `TricksService` (ordering by published_at, view_count update, analytics insert) – no change needed
  - Submission flow uses `trick_submissions` – keep as-is

## 6) Acceptance criteria
- Local `supabase db reset` succeeds with new migration.
- UI renders tricks list and detail without errors.
- No TypeScript errors related to missing fields in `Database` types.
- Seed data appears in Studio; view_count increments on page view calls (optional manual test).
- Remote project can be updated with `supabase db push --linked` after local validation.

## 7) Risks & mitigations
- Risk: Dropping columns that some hidden code path depends on.
  - Mitigation: repo-wide grep confirms main UI/services do not depend on dropped fields; we’ll run the app post-migration.
- Risk: Enum types left orphaned.
  - Mitigation: explicitly drop enums using `DROP TYPE IF EXISTS` after dropping referencing columns.

## 8) Rollout
- Phase 1 (local): apply migration, update code, regen types, run app.
- Phase 2 (remote): after validation, push migration to linked project.

## 9) Ops / scripts
- `npm run db:reset` – fully resets and seeds local DB
- `npm run db:start` / `npm run db:stop`
- `supabase gen types typescript --local > src/lib/supabase/types.ts`

## 10) Open questions
- Keep `like_count`? Current UI doesn’t use it, so remove in this pass. Can re-add later with clear usage.
- Keep `role`? Chosen: remove (strict-minimal). If we want role-based filtering later, re-introduce via a small migration.
