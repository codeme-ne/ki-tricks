# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KI Tricks Platform - A Next.js 15 application for discovering and implementing practical AI tips and tricks. German UI, Supabase-powered backend, minimalistic design inspired by thegrowthlist.co.

## Essential Commands

```bash
# Development
npm run dev                      # Start dev server (port 3000)
npm run dev:mobile              # Start dev server accessible on network
npm run build                   # TypeScript build
npm start                       # Production server
npm run lint                    # ESLint

# Data Management
npm run clean:data              # Clean generated AI tips data
npm run migrate-to-supabase     # Initial data migration to Supabase
npm run import-tricks           # Bulk import from CSV/JSON files
npm run import-tricks:validate  # Validate import data without inserting
npm run ingest:omni             # Ingest omnisearch results

# Build Utilities
npm run fix-build               # Auto-fix build errors
npm run fix-build-clean         # Fix build errors and remove broken imports

# Supabase (Local Development)
npm run db:start                # Start local Supabase
npm run db:stop                 # Stop local Supabase
npm run db:studio               # Open Supabase Studio
npm run db:reset                # Reset local database
npm run db:push                 # Push schema changes

# Supabase Cloud
npm run supabase:login          # Login to Supabase CLI
npm run supabase:link           # Link to cloud project (requires SUPABASE_PROJECT_REF)
```

## Critical Architecture Patterns

### Next.js 15 Requirements

1. **useSearchParams requires Suspense boundary**:
```typescript
// Server component wraps client component with Suspense
<Suspense fallback={<Loading />}>
  <TricksClient />
</Suspense>
```

2. **Dynamic route params use Promise pattern**:
```typescript
export default async function Page({ params }: { params: Promise<{slug: string}> }) {
  const { slug } = await params
}
```

3. **No styled-jsx** - Use Tailwind CSS exclusively

### URL-Based Filter System

The `useFilters` hook (`src/hooks/useFilters.ts`) syncs filters with URL for shareable views:
- Categories: `?categories=programming,productivity`
- Search: `?search=prompt+engineering`
- Enables browser back/forward navigation
- State persists across page refreshes

### Supabase Database Architecture

```sql
-- Main tables (from supabase/schema.sql)
ki_tricks          -- Published tricks with metadata
trick_submissions  -- User submissions pending review  
trick_analytics    -- Event tracking (views, likes, shares)
```

Key fields:
- `slug`: Unique URL identifier
- `why_it_works`: Extracted from description's "**Warum es funktioniert:**" section
- `category`: Enum of valid categories
- `status`: draft/pending/published/rejected
- `quality_score`: Integer rating

### Bulk Import System

**CSV Import** (`npm run import-tricks data/file.csv`):
```csv
title,description,category,tools,steps,examples,slug
"Title","Description with **Warum es funktioniert:** section","productivity","ChatGPT;Claude","Step 1;Step 2","Example 1","slug"
```
- Semicolon (;) separates array values
- Auto-generates slug if not provided
- Validates categories against enum
- Skips duplicates by slug

**JSON Import**:
```json
[{
  "title": "Title",
  "description": "Description",
  "category": "productivity",
  "tools": ["ChatGPT", "Claude"],
  "steps": ["Step 1"],
  "examples": ["Example 1"]
}]
```

## Authentication & Security

- Admin routes (`/admin/*`) protected via Basic Auth in `middleware.ts`
- Username: `admin`, Password: `ADMIN_PASSWORD` env var
- Returns 401 with WWW-Authenticate header if invalid

## Component Architecture

```
src/components/
├── atoms/       # Button, Badge, Checkbox, Input
├── molecules/   # TrickCard, SearchBar, TrickMeta
├── organisms/   # FilterSidebar, TrickGrid, TrickForm
├── enhanced/    # GlowingTrickCard, RefinedTrickCard (glassmorphism effects)
└── layout/      # Header, Footer, PageContainer
```

### Type System

Core types in `src/lib/types/types.ts`:
```typescript
type Category = 'productivity' | 'content-creation' | 'programming' | 'design' | 'data-analysis' | 'learning' | 'business' | 'marketing'

interface KITrick {
  id: string
  title: string
  description: string
  category: Category
  tools: string[]
  steps?: string[]
  examples?: string[]
  slug: string
  'Warum es funktioniert': string  // Note: German property name
}
```

## Key Implementation Details

### State Management Pattern
- URL params for shareable filter state via `useFilters` hook
- React state for UI-only concerns (modals, dropdowns)
- No global state management library

### Performance Optimizations
- `React.memo` on heavy components
- `useMemo` for filtered/sorted lists
- 300ms debounce on search input
- Lazy loading for below-fold content

### German UI Conventions
All user-facing text in German:
- "Suchen" not "Search"
- "Filter" stays "Filter"
- "Kategorie" not "Category"
- Keep "Tricks" as English

### Import Patterns
- Always use `@/` path alias (configured in tsconfig.json)
- Centralized exports via index.ts files
- Example: `import { Button, Badge } from '@/components/atoms'`

## Environment Variables

Required in `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # Admin operations only

# Admin Auth
ADMIN_PASSWORD=                 # For /admin routes

# EmailJS (optional)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

## Common Gotchas

1. **Build fails with "Unterminated string constant"**: Keep className strings on single line
2. **useSearchParams error**: Wrap component with Suspense boundary
3. **Filter not updating URL**: Use `updateFilters` not `setFilters` from hook
4. **TypeScript strict errors**: No `any` types allowed, initialize all refs
5. **Admin route 401**: Check ADMIN_PASSWORD env var is set

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
