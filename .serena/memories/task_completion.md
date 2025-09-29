# Task Completion Checklist
1. Run `npm run lint` (and `npm run fix-build` if you adjusted TS types) before submitting.
2. For runtime changes, execute `npm run build` to catch Next.js build errors.
3. Update related docs (`README`, `docs/`) and Supabase SQL/scripts when touching data models.
4. If content pipeline scripts were touched, test locally with dummy config (`tsx scripts/pipeline/fetch-feeds.ts --config config/sources.dummy.json`) and ensure Supabase env vars are set.
5. Verify UI changes visually (localhost:3000) and check responsive states.
6. Ensure translations remain German and that SEO metadata/title updates accompany new pages.
7. Commit with descriptive messages and open PR against `main` for Vercel preview deploys.