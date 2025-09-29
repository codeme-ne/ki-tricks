# Code Style & Conventions
- **Language/Framework**: TypeScript 5.8 with Next.js 15 App Router (React 19). Strict mode enabled; avoid `any` and prefer typed utilities (Zod, Supabase types).
- **Component Patterns**: Atomic design hierarchy (`atoms`, `molecules`, `organisms`, `enhanced`). Default to Server Components; add `'use client'` only when stateful hooks/UI require it.
- **Styling**: Tailwind CSS 3.4 with custom CSS variables for colors & radii (`tailwind.config.ts`). Mobile-first responsive design, glassmorphism visuals, glow effects. Use `clsx`/`class-variance-authority` for dynamic classes.
- **State & Data**: Favor Supabase server actions/services in `src/lib`, client state via Zustand when needed, memoization with `React.memo`/`useMemo` for performance.
- **UI Copy**: German locale by default; maintain professional tone. Ensure SEO metadata via `src/lib/metadata` helpers.
- **Structure**: Shared utilities/types live under `@/*` alias (`paths` in tsconfig). Organize new scripts/components alongside existing directories.
- **Quality**: Optimize for performance (bundle size, CWV targets). Keep components small, re-usable, and accessible.