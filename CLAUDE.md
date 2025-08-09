# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KI Tricks Platform - A Next.js 15 web application for discovering and implementing practical AI tips and tricks. The UI is in German and follows a minimalistic design inspired by thegrowthlist.co.

## Essential Commands

```bash
# Development
npm run dev           # Start dev server (port 3000, fallback 3001)

# Production  
npm run build         # Build with TypeScript checking
npm start            # Start production server

# Quality checks
npm run lint         # Run ESLint

# Content generation
npm run convert-youtube  # Convert YouTube transcripts to KI tricks
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
}
```

## Environment Configuration

### Required Environment Variables

```bash
# Admin authentication
ADMIN_PASSWORD=your-secure-password

# EmailJS (contact form)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=xxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=xxx  
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxx
```

Admin routes (`/admin/*`) are protected via Basic Auth in `middleware.ts`.

## Content Management

### Mock Data
- 40+ high-quality KI tricks in `app/lib/mock-data.ts`
- Categories: programming (11), productivity (10), learning (7), business (5), content-creation (3), data-analysis (2), marketing (2), design (1)

### Admin Interface
- `/admin/tricks/new` - Add new tricks (saves to localStorage)
- Protected by Basic Auth using ADMIN_PASSWORD env variable

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
```

## AI Development Strategies

- **Verification Principle**: Always verify changes with current documents. For example, when unsure about parameters for Apify actors, check the specific actor's documentation.
  - Example: Reddit Lite Scraper input JSON verification
    ```json
    {
        "debugMode": false,
        "ignoreStartUrls": false,
        "includeNSFW": true,
        "maxComments": 10,
        "maxCommunitiesCount": 2,
        "maxItems": 10,
        "maxPostCount": 10,
        "maxUserCount": 2,
        "proxy": {
            "useApifyProxy": true,
            "apifyProxyGroups": [
                "RESIDENTIAL"
            ]
        },
        "scrollTimeout": 40,
        "searchComments": false,
        "searchCommunities": false,
        "searchPosts": true,
        "searchUsers": false,
        "skipComments": false,
        "skipCommunity": false,
        "skipUserPosts": false,
        "sort": "new",
        "startUrls": [
            {
                "url": "https://www.reddit.com/r/pasta/comments/vwi6jx/pasta_peperoni_and_ricotta_cheese_how_to_make/",
                "method": "GET"
            }
        ]
    }
    ```