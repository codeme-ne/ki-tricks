# Learning Prompts Feature Documentation

## Overview

The Learning Prompts feature is a dedicated section of the KI Tricks Platform that allows users to discover, submit, and share AI prompts specifically designed for studying and learning. This feature enables users to:

- Browse curated learning prompts organized by category
- Submit their own learning prompts for community use
- Favorite/save prompts to their personal account
- Create collections of prompts for different learning goals
- Track prompt usage and engagement

## Architecture

### Database Schema

The feature is built on 7 new database tables:

#### 1. `learning_prompts` (Main Prompts Table)

Stores published learning prompts with rich metadata.

**Key Fields:**
- `id`: UUID primary key
- `title`: Prompt title (e.g., "Feynman-Technik für komplexe Themen")
- `prompt_text`: The actual AI prompt to use
- `description`: Optional description of when/how to use it
- `category`: One of 10 learning categories (see categories below)
- `difficulty_level`: beginner | intermediate | advanced
- `subject_areas`: Array of applicable subjects
- `ai_tools`: Compatible AI tools (ChatGPT, Claude, Gemini, etc.)
- `use_cases`: Specific scenarios where this prompt helps
- `example_output`: Sample output to show expected results
- `tips`: Usage tips for best results
- `slug`: URL-friendly identifier
- `status`: draft | pending | published | rejected
- `view_count`: Number of times viewed
- `favorite_count`: Number of users who favorited
- `use_count`: Number of times "use this prompt" was clicked
- `created_by`: User who created it (optional)
- `submitter_name` / `submitter_email`: For anonymous submissions

#### 2. `prompt_submissions`

User-submitted prompts pending review.

**Key Fields:**
- `id`: UUID primary key
- `prompt_data`: JSONB containing the prompt data
- `submitter_email` / `submitter_name`: Submitter info
- `submitter_user_id`: For authenticated submissions
- `status`: pending | approved | rejected
- `review_notes`: Admin feedback
- `quality_score`: Optional rating

#### 3. `user_prompt_favorites`

Junction table for user favorites with personal notes.

**Key Fields:**
- `user_id`: Reference to auth.users
- `prompt_id`: Reference to learning_prompts
- `personal_notes`: User's own notes about the prompt
- `tags`: User's custom tags for organization
- Unique constraint on (user_id, prompt_id)

**Automatic Triggers:**
- On INSERT/DELETE: Updates `favorite_count` in `learning_prompts`

#### 4. `user_prompt_collections`

User-created collections to organize prompts.

**Key Fields:**
- `user_id`: Collection owner
- `name`: Collection name
- `description`: Optional description
- `is_public`: Whether others can view
- `slug`: URL-friendly identifier
- Unique constraint on (user_id, slug)

#### 5. `collection_prompts`

Junction table linking prompts to collections.

**Key Fields:**
- `collection_id`: Reference to user_prompt_collections
- `prompt_id`: Reference to learning_prompts
- `order_index`: For custom ordering
- Unique constraint on (collection_id, prompt_id)

#### 6. `prompt_analytics`

Event tracking for engagement metrics.

**Event Types:**
- `view`: User viewed prompt detail page
- `favorite`: User added to favorites
- `unfavorite`: User removed from favorites
- `copy`: User copied prompt text
- `use`: User clicked "use this prompt"
- `share`: User shared the prompt

#### 7. `user_profiles`

Extended user profile information.

**Key Fields:**
- `id`: References auth.users
- `username`: Unique username
- `display_name`: Display name
- `bio`: User bio
- `avatar_url`: Profile picture
- `preferred_ai_tools`: Preferred AI tools
- `learning_goals`: User's learning goals
- `profile_visibility`: public | private
- `show_favorites`: Whether to show favorites publicly
- `show_collections`: Whether to show collections publicly

### Prompt Categories

The feature uses 10 learning-focused categories:

| Category | Label (German) | Icon | Description |
|----------|----------------|------|-------------|
| `note-taking` | Notizen | 📝 | Effektive Notiz-Techniken |
| `memory-techniques` | Gedächtnistechniken | 🧠 | Merkhilfen und Gedächtnisstrategien |
| `comprehension` | Textverständnis | 📖 | Komplexe Texte verstehen |
| `essay-writing` | Essay & Aufsätze | ✍️ | Akademisches Schreiben |
| `exam-prep` | Prüfungsvorbereitung | 📋 | Effektive Prüfungsstrategien |
| `research` | Recherche | 🔍 | Wissenschaftliche Recherche |
| `language-learning` | Sprachenlernen | 🌍 | Neue Sprachen lernen |
| `math-problem-solving` | Mathematik | 🔢 | Mathematische Probleme |
| `coding-practice` | Programmieren | 💻 | Code verstehen und debuggen |
| `general-learning` | Allgemein | 🎓 | Universelle Lernstrategien |

### Row-Level Security (RLS)

All tables have RLS enabled with the following policies:

**learning_prompts:**
- Public can view published prompts
- Users can view their own drafts
- Authenticated users (admins) can manage all

**prompt_submissions:**
- Anyone can submit
- Users can view their own submissions
- Authenticated users (admins) can manage all

**user_prompt_favorites:**
- Users can only view/manage their own favorites

**user_prompt_collections:**
- Public can view public collections
- Users can view and manage their own collections

**collection_prompts:**
- Users can view items in public collections or their own
- Users can only manage their own collection items

**prompt_analytics:**
- Anyone can insert analytics
- Everyone can view analytics

**user_profiles:**
- Public can view public profiles
- Users can view and update their own profile

### Database Functions

#### `increment_prompt_view_count(prompt_slug TEXT)`
Increments the view count for a prompt by slug.

#### `increment_prompt_use_count(prompt_slug TEXT)`
Increments the use count when users click "use this prompt".

#### `increment_favorite_count()`
Trigger function that automatically updates `favorite_count` when favorites are added/removed.

## TypeScript Types

Located in `/src/lib/types/types.ts`:

```typescript
// Main prompt type
export interface LearningPrompt {
  id: string
  title: string
  prompt_text: string
  description?: string | null
  category: PromptCategory
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | null
  subject_areas?: string[] | null
  ai_tools?: string[] | null
  use_cases?: string[] | null
  example_output?: string | null
  tips?: string[] | null
  slug: string
  status: 'draft' | 'pending' | 'published' | 'rejected'
  view_count: number
  favorite_count: number
  use_count: number
  // ... timestamps and author fields
}

// Filter state for URL synchronization
export interface PromptFilterState {
  categories: PromptCategory[]
  difficulty: ('beginner' | 'intermediate' | 'advanced')[]
  ai_tools: string[]
  search: string
}
```

## Service Layer

Located in `/src/lib/services/prompts.service.ts`:

### Public Read Operations

```typescript
// Get all published prompts
PromptsService.getPublishedPrompts()

// Get single prompt by slug
PromptsService.getPromptBySlug(slug)

// Get prompts by category
PromptsService.getPromptsByCategory(category)

// Search prompts
PromptsService.searchPrompts(query)

// Get filtered prompts
PromptsService.getFilteredPrompts({
  categories?: PromptCategory[]
  difficulty?: ('beginner' | 'intermediate' | 'advanced')[]
  ai_tools?: string[]
  search?: string
})

// Get related prompts
PromptsService.getRelatedPrompts(category, currentSlug, limit)

// Get popular prompts
PromptsService.getPopularPrompts(limit)
```

### View & Usage Tracking

```typescript
// Increment view count (server-side only)
PromptsService.incrementViewCount(slug)

// Increment use count
PromptsService.incrementUseCount(promptId, userId?, sessionId?)

// Track custom event
PromptsService.trackEvent(promptId, eventType, userId?, sessionId?, metadata?)
```

### User Favorites

```typescript
// Get user's favorites
PromptsService.getUserFavorites(userId)

// Check if favorited
PromptsService.isPromptFavorited(userId, promptId)

// Get favorited IDs
PromptsService.getUserFavoriteIds(userId)

// Add to favorites
PromptsService.addToFavorites(userId, promptId, personalNotes?)

// Remove from favorites
PromptsService.removeFromFavorites(userId, promptId)

// Toggle favorite
PromptsService.toggleFavorite(userId, promptId)

// Update notes
PromptsService.updateFavoriteNotes(userId, promptId, notes, tags?)
```

### User Collections

```typescript
// Get user's collections
PromptsService.getUserCollections(userId)

// Get public collections
PromptsService.getPublicCollections(limit)

// Get collection by slug
PromptsService.getCollectionBySlug(userId, slug)

// Create collection
PromptsService.createCollection(userId, name, description?, isPublic)

// Add prompt to collection
PromptsService.addPromptToCollection(collectionId, promptId, orderIndex?)

// Remove from collection
PromptsService.removePromptFromCollection(collectionId, promptId)

// Delete collection
PromptsService.deleteCollection(collectionId, userId)
```

### Admin Operations

```typescript
// Get all prompts (including unpublished)
PromptsService.getAllPrompts()

// Create prompt
PromptsService.createPrompt(prompt)

// Update prompt
PromptsService.updatePrompt(id, updates)

// Delete prompt
PromptsService.deletePrompt(id)

// Publish prompt
PromptsService.publishPrompt(id)

// Reject prompt
PromptsService.rejectPrompt(id)
```

### Submissions

```typescript
// Submit new prompt
PromptsService.submitPrompt(promptData, email?, name?, userId?)

// Get all submissions
PromptsService.getAllSubmissions()

// Get pending submissions
PromptsService.getPendingSubmissions()

// Approve submission
PromptsService.approveSubmission(submissionId, reviewNotes?)

// Reject submission
PromptsService.rejectSubmission(submissionId, reviewNotes?)
```

## Page Structure

The feature follows the same pattern as the existing tricks feature:

### Recommended Routes

```
/prompts                        # Main listing page
  ├── PromptsProvider.tsx       # Server component (data fetching)
  └── PromptsClient.tsx         # Client component (filtering, search)

/prompt/[slug]                  # Individual prompt detail page
  └── page.tsx                  # Dynamic route with SSG + ISR

/prompts/einreichen             # Submission page
  └── page.tsx                  # Client component for form

/profil/favoriten               # User's saved prompts
  └── page.tsx                  # Requires authentication

/profil/sammlungen              # User's collections
  └── page.tsx                  # Requires authentication

/profil/sammlungen/[slug]       # Individual collection page
  └── page.tsx                  # Dynamic route
```

## Component Architecture

Following the existing atomic design pattern:

### Atoms (Reusable)
- Use existing `Button`, `Badge`, `Checkbox` components
- Add `FavoriteButton` for favorite toggle
- Add `CopyButton` for prompt copying

### Molecules
- `PromptCard` (similar to `TrickCard`)
  - Display prompt title, category, difficulty
  - Show favorite count, view count
  - Include favorite button if user is logged in
  - Click to navigate to detail page
- `PromptMeta` (similar to `TrickMeta`)
  - Display AI tools, subject areas, difficulty
- `PromptCategoryBadge`
  - Category with icon and color

### Organisms
- `PromptFilterSidebar` (similar to `FilterSidebar`)
  - Category filters
  - Difficulty filters
  - AI tool filters
  - Mobile responsive
- `PromptGrid` (similar to `TrickGrid`)
  - Responsive grid layout
  - Loading states
  - Empty states
- `PromptForm` (similar to `TrickForm`)
  - Multi-step form
  - Validation
  - Draft saving
- `PromptDetail`
  - Full prompt display
  - Copy button
  - Use button (increments use_count)
  - Favorite button
  - Share button
  - Related prompts
- `FavoritesList`
  - User's saved prompts
  - Filter by category
  - Search within favorites
- `CollectionManager`
  - Create/edit collections
  - Add/remove prompts
  - Reorder prompts (drag & drop)

## Authentication Setup

### Supabase Auth

The feature requires Supabase Authentication to be enabled:

1. **Enable Email/Password Auth:**
   - Supabase Dashboard → Authentication → Providers
   - Enable Email provider

2. **Optional Social Auth:**
   - Enable Google, GitHub, etc.
   - Configure OAuth callbacks

3. **Email Templates:**
   - Customize confirmation email
   - Customize magic link email

### Auth Context

Create an auth context provider:

```typescript
// src/contexts/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### Protected Routes

Use Next.js middleware or server-side checks:

```typescript
// Example: app/profil/favoriten/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function FavoritesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/profil/favoriten')
  }

  // ... render favorites
}
```

## URL-Based Filtering

Reuse the existing `useFilters` hook pattern or create a new one for prompts:

```typescript
// src/hooks/usePromptFilters.ts
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import type { PromptFilterState, PromptCategory } from '@/lib/types/types'

export function usePromptFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const filters = useMemo<PromptFilterState>(() => {
    const categories = searchParams.get('categories')
      ?.split(',')
      .filter(Boolean) as PromptCategory[] || []

    const difficulty = searchParams.get('difficulty')
      ?.split(',')
      .filter(Boolean) as ('beginner' | 'intermediate' | 'advanced')[] || []

    const ai_tools = searchParams.get('ai_tools')
      ?.split(',')
      .filter(Boolean) || []

    const search = searchParams.get('search') || ''

    return { categories, difficulty, ai_tools, search }
  }, [searchParams])

  const updateFilters = useCallback((newFilters: PromptFilterState) => {
    const params = new URLSearchParams()

    if (newFilters.categories.length > 0) {
      params.set('categories', newFilters.categories.join(','))
    }
    if (newFilters.difficulty.length > 0) {
      params.set('difficulty', newFilters.difficulty.join(','))
    }
    if (newFilters.ai_tools.length > 0) {
      params.set('ai_tools', newFilters.ai_tools.join(','))
    }
    if (newFilters.search) {
      params.set('search', newFilters.search)
    }

    const queryString = params.toString()
    router.push(`/prompts${queryString ? `?${queryString}` : ''}`, {
      scroll: false
    })
  }, [router])

  return { filters, updateFilters }
}
```

## Implementation Checklist

### Phase 1: Database & Backend
- [x] Create database migration file
- [x] Define TypeScript types
- [x] Create PromptsService
- [ ] Run migration on local Supabase
- [ ] Test all service methods
- [ ] Seed initial prompts

### Phase 2: Authentication
- [ ] Set up Supabase Auth
- [ ] Create AuthContext provider
- [ ] Add login/signup pages
- [ ] Add protected route middleware

### Phase 3: Core UI Components
- [ ] Create PromptCard component
- [ ] Create PromptGrid component
- [ ] Create PromptFilterSidebar component
- [ ] Create usePromptFilters hook
- [ ] Create PromptSearchBar

### Phase 4: Main Pages
- [ ] Create /prompts page (listing)
  - [ ] PromptsProvider (server)
  - [ ] PromptsClient (client)
- [ ] Create /prompt/[slug] page (detail)
- [ ] Create /prompts/einreichen page (submit)
- [ ] Add navigation links

### Phase 5: User Features
- [ ] Create FavoriteButton component
- [ ] Create /profil/favoriten page
- [ ] Create /profil/sammlungen page
- [ ] Create collection management UI
- [ ] Add user profile page

### Phase 6: Polish
- [ ] Add SEO metadata
- [ ] Add schema.org markup
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add toast notifications
- [ ] Mobile responsive testing

### Phase 7: Testing & Deployment
- [ ] Test all flows
- [ ] Run migrations on production
- [ ] Deploy to Vercel
- [ ] Monitor analytics

## Example Seed Data

5 example prompts are included in the migration:

1. **Feynman-Technik für komplexe Themen** (Comprehension)
2. **Aktive Recall-Fragengeneration** (Exam Prep)
3. **Spaced Repetition Lernplan** (Exam Prep)
4. **Cornell-Notizen Optimierung** (Note-taking)
5. **Code-Debugging mit Erklärungen** (Coding Practice)

## Best Practices

### Performance
- Use `createPublicClient()` for SSG/ISR pages
- Implement ISR with 60-second revalidation
- Use `React.memo` for heavy components
- Lazy load prompts below the fold

### SEO
- Add metadata for each prompt page
- Implement schema.org `HowTo` markup
- Generate sitemaps for all prompts
- Use semantic HTML

### UX
- Show loading states during favorites toggle
- Debounce search input (300ms)
- Show toast on favorite add/remove
- Confirm before deleting collections
- Empty states with CTAs

### Security
- Validate all user inputs
- Sanitize prompt text before display
- Rate limit submissions
- Use RLS for all user data
- Never expose service role key client-side

## German UI Labels

All user-facing text should be in German:

```typescript
const labels = {
  prompts: 'Lern-Prompts',
  categories: 'Kategorien',
  difficulty: 'Schwierigkeit',
  beginner: 'Anfänger',
  intermediate: 'Fortgeschritten',
  advanced: 'Experte',
  search: 'Suchen',
  favorites: 'Favoriten',
  collections: 'Sammlungen',
  submit: 'Prompt einreichen',
  copy: 'Kopieren',
  use: 'Verwenden',
  share: 'Teilen',
  addToFavorites: 'Zu Favoriten hinzufügen',
  removeFromFavorites: 'Aus Favoriten entfernen',
  addToCollection: 'Zu Sammlung hinzufügen',
  createCollection: 'Sammlung erstellen',
  aiTools: 'KI-Tools',
  useCases: 'Anwendungsfälle',
  exampleOutput: 'Beispiel-Ausgabe',
  tips: 'Tipps',
  relatedPrompts: 'Ähnliche Prompts',
  popularPrompts: 'Beliebte Prompts',
  viewCount: 'Aufrufe',
  favoriteCount: 'Favoriten',
  useCount: 'Verwendungen'
}
```

## Migration Command

To apply the migration:

```bash
# Local Supabase
npm run db:reset  # Resets and applies all migrations

# Or manually apply
npx supabase db push

# Production (after linking)
npx supabase db push --linked
```

## Monitoring & Analytics

Track these metrics:

- Total prompts created
- Most viewed prompts
- Most favorited prompts
- Most used prompts (use_count)
- User engagement rate
- Submission approval rate
- Popular categories
- Popular AI tools

Query examples:

```sql
-- Most popular prompts
SELECT title, favorite_count, view_count, use_count
FROM learning_prompts
WHERE status = 'published'
ORDER BY favorite_count DESC
LIMIT 10;

-- Category distribution
SELECT category, COUNT(*) as count
FROM learning_prompts
WHERE status = 'published'
GROUP BY category
ORDER BY count DESC;

-- User engagement
SELECT
  COUNT(DISTINCT user_id) as active_users,
  COUNT(*) as total_favorites
FROM user_prompt_favorites;
```

## Future Enhancements

Potential features for v2:

1. **Prompt Versions**: Track edits and allow reverting
2. **Community Voting**: Let users upvote/downvote prompts
3. **Comments**: Enable discussions on prompts
4. **Prompt Remixes**: Allow users to create variations
5. **AI-Powered Suggestions**: Recommend prompts based on user behavior
6. **Achievements**: Gamify prompt usage and creation
7. **Export Collections**: Download prompts as PDF/Markdown
8. **Collaborative Collections**: Multiple users can co-manage
9. **Prompt Templates**: Variable placeholders users can fill in
10. **Integration API**: Allow third-party apps to access prompts

## Support

For questions or issues:
- Check the CLAUDE.md file for development guidelines
- Review the existing tricks implementation as reference
- Test locally with Supabase local dev environment
- Refer to Supabase documentation for RLS and auth

---

**Created**: 2025-01-06
**Version**: 1.0
**Status**: Ready for implementation
