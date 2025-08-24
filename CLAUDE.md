# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KI Tricks Platform - A Next.js 15 web application for discovering and implementing practical AI tips and tricks. The UI is in German and follows a minimalistic design inspired by thegrowthlist.co. Now fully integrated with Supabase for real-time database operations.

## Essential Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run dev:mobile       # Start dev server accessible on network

# Production  
npm run build           # Build with TypeScript checking
npm start              # Start production server

# Quality checks
npm run lint           # Run ESLint

# Utilities
npm run fix-build       # Fix build errors automatically
npm run fix-build-clean # Fix build errors and remove broken imports

# Data management
npm run migrate-to-supabase     # Initial migration of mock data to Supabase
npm run import-tricks           # Bulk import tricks from CSV or JSON files
npm run import-generated-tips   # Import AI-generated tips with upsert by slug
```

## Critical Architecture Patterns

### Next.js 15 Compatibility Requirements

1. **useSearchParams with Suspense**: Split into server component with Suspense wrapper + client component
   ```typescript
   // page.tsx (server component)
   <Suspense fallback={<Loading />}>
     <ClientComponent />
   </Suspense>
   ```

2. **Dynamic Routes**: Use Promise pattern
   ```typescript
   params: Promise<{slug: string}>
   ```

3. **No styled-jsx**: Removed all `<style jsx>` tags (incompatible with Next.js 15). Use Tailwind CSS or globals.css

### URL-Based Filter System

The `useFilters` hook syncs filter state with URL query parameters for shareable views:
- Categories: `?categories=programming,productivity`  
- Difficulty: `?difficulty=beginner,intermediate`
- Search: `?search=claude+code`

This enables browser navigation and link sharing while maintaining filter state.

### Component Architecture

```
components/
├── atoms/       # Basic UI (Button, Badge, Checkbox)
├── molecules/   # Composite (TrickCard, SearchBar)
├── organisms/  # Complex (FilterSidebar, TrickGrid)
├── enhanced/   # Glowing UI components
└── layout/     # Header, Footer, PageContainer
```

### Data Structure

```typescript
interface KITrick {
  id: string
  title: string
  description: string  // Includes "**Warum es funktioniert:**" hook
  category: Category
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tools: string[]     // ['Claude', 'ChatGPT', etc]
  timeToImplement: string
  impact: 'low' | 'medium' | 'high'
  steps?: string[]    // 4 concrete steps
  examples?: string[] // 2 real-world examples
  slug: string
  departmentTags?: string[]  // DACH business focus
  industryTags?: string[]    // Industry categorization
  qualityScore?: number      // Quality rating
}
```

## Environment Configuration

### Required Environment Variables

```bash
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # For admin operations

# Admin authentication
ADMIN_PASSWORD=your-secure-password

# EmailJS (contact form)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=xxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=xxx  
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxx
```

Admin routes (`/admin/*`) are protected via Basic Auth in `middleware.ts`.

## Supabase Integration

### Database Schema
- **ki_tricks**: Main tricks table with full content, metadata, and analytics
- **trick_submissions**: User submissions pending review  
- **trick_analytics**: Event tracking (views, likes, shares, implements)

### Data Services (`src/lib/services/tricks.service.ts`)
- **Public methods**: `getPublishedTricks()`, `getTrickBySlug()`, `searchTricks()`
- **Admin methods**: `createTrick()`, `updateTrick()`, `publishTrick()`
- **Analytics**: `incrementViewCount()`, `trackEvent()`

### Bulk Import Options

#### 1. CSV Import (`npm run import-tricks data/file.csv`)
```csv
title,description,category,difficulty,timeToImplement,impact,tools,departmentTags,industryTags,steps,examples,slug
"Titel","Beschreibung mit **Warum es funktioniert:** Abschnitt","productivity","beginner","10-30 Minuten","medium","ChatGPT;Claude","Vertrieb;Marketing","E-Commerce;SaaS","Schritt 1;Schritt 2","Beispiel 1;Beispiel 2","optional-slug"
```
- Arrays use semicolon (;) as separator
- Auto-extracts "Warum es funktioniert" from description
- Validates all fields before import
- Skips duplicates by slug

#### 2. JSON Import (`npm run import-tricks data/file.json`)
```json
[{
  "title": "Trick Title",
  "description": "Description",
  "category": "productivity",
  "difficulty": "beginner",
  "tools": ["ChatGPT", "Claude"],
  "timeToImplement": "10-30 Minuten",
  "impact": "medium",
  "departmentTags": ["Vertrieb"],
  "industryTags": ["E-Commerce"],
  "steps": ["Step 1", "Step 2"],
  "examples": ["Example 1"],
  "slug": "optional-slug-or-auto-generated"
}]
```

#### 3. Generated Tips Import (`npm run import-generated-tips`)
- Upserts by slug (updates existing or creates new)
- Auto-sanitizes categories and values
- Extracts "Warum es funktioniert" automatically

### Supabase MCP Server Setup

Add to your `.mcp.json` in VS Code settings:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "your-access-token-here"
      }
    }
  }
}
```

Note for WSL users: Use `"command": "wsl"` and adjust args accordingly.


## Key Implementation Notes

### Component Props
- TrickGrid: `isLoading` (not `loading`)
- Badge: supports `'danger'` variant
- SearchBar: optional `onChange`

### Function Signatures
- `getAllCategories()` - no parameters
- `getAllTools()` - no parameters
- Use centralized imports via index.ts files

### German UI Text
All user-facing text must be in German. Key translations:
- Tricks → Tricks (kept English)
- Search → Suchen
- Filter → Filter
- Category → Kategorie
- Difficulty → Schwierigkeit

## Development Guidelines

1. **TypeScript**: Strict mode enabled - no `any` types
2. **Imports**: Always use `@/` path alias
3. **State Management**: URL for filter state, React state for UI-only
4. **Performance**: Use React.memo, useMemo for expensive operations
5. **Responsive**: Mobile (<640px), Tablet (640-1024px), Desktop (>1024px)

## Common Issues & Solutions

### Build Errors
- **"Unterminated string constant"**: Keep className strings on single line
- **Import errors**: Check all imports exist and paths are correct
- **TypeScript errors**: Ensure all refs have initial values

### Filter Not Working
- Check component has `'use client'` directive
- Verify useFilters is within Suspense boundary
- Ensure updateFilters (not setFilters) is used

### Performance Issues
- Use useMemo for filtered results
- Implement debouncing for search (300ms)
- Lazy load heavy components

## Deployment

The app auto-deploys to Vercel on push to main branch. Ensure:
1. All environment variables are set in Vercel dashboard
2. Build passes locally with `npm run build`
3. No sensitive data in commits (use .env.local)