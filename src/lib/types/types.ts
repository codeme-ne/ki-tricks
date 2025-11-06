// Core Data Types
export type Category = 
  | 'productivity'
  | 'content-creation'
  | 'programming'
  | 'design'
  | 'data-analysis'
  | 'learning'
  | 'business'
  | 'marketing'

export interface KITrick {
  id: string
  title: string
  description: string
  category: Category
  tools: string[]
  steps?: string[] | null
  examples?: string[] | null
  slug: string
  why_it_works: string
  status: 'draft' | 'pending' | 'published' | 'rejected'
  quality_score?: number | null
  view_count: number
  created_at: string
  updated_at: string
  published_at?: string | null
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  prompt_template?: string | null
  steps_structured?: Array<{
    step: string
    description?: string
    image_url?: string | null
    code_snippet?: string | null
    warning?: string | null
  }> | null
}

// Filter Types
export interface FilterState {
  categories: Category[]
  search: string
}

export interface FilterOption {
  value: string
  label: string
  count?: number
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'text'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  href?: string
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export interface BadgeProps {
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'new' | 'new-subtle'
  children: React.ReactNode
  className?: string
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'search'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface CheckboxProps {
  label: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export interface TrickCardProps {
  trick: KITrick
  variant?: 'default' | 'compact' | 'featured'
  index?: number
  onClick?: () => void
  lazy?: boolean
  className?: string
}

export interface FilterGroupProps {
  title: string
  options: FilterOption[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  type?: 'checkbox' | 'radio'
  className?: string
}

export interface FilterSidebarProps {
  categories: Category[]
  selectedFilters: FilterState
  onFilterChange: (filters: FilterState) => void
  isOpen?: boolean
  onClose?: () => void
  className?: string
}

export interface TrickGridProps {
  tricks: KITrick[]
  isLoading?: boolean
  emptyState?: React.ReactNode
  className?: string
}

export interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  onDebouncedChange?: (value: string) => void
  placeholder?: string
  className?: string
  variant?: 'default' | 'glowing'
  debounceMs?: number
}

// Utilities and Constants
export const EMPTY_FILTER_STATE: FilterState = {
  categories: [],
  search: ''
}

export interface HeaderProps {
  className?: string
}

export interface ResultsHeaderProps {
  count: number
  sortBy?: 'newest' | 'oldest'
  onSortChange?: (sort: string) => void
  className?: string
}


// ======================
// LEARNING PROMPTS TYPES
// ======================

export type PromptCategory =
  | 'note-taking'
  | 'memory-techniques'
  | 'comprehension'
  | 'essay-writing'
  | 'exam-prep'
  | 'research'
  | 'language-learning'
  | 'math-problem-solving'
  | 'coding-practice'
  | 'general-learning'

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
  quality_score?: number | null
  view_count: number
  favorite_count: number
  use_count: number
  created_at: string
  updated_at: string
  published_at?: string | null
  created_by?: string | null
  submitter_name?: string | null
  submitter_email?: string | null
}

export interface PromptSubmission {
  id: string
  prompt_data: Partial<LearningPrompt>
  submitter_email?: string | null
  submitter_name?: string | null
  submitter_user_id?: string | null
  status: 'pending' | 'approved' | 'rejected'
  review_notes?: string | null
  quality_score?: number | null
  created_at: string
  reviewed_at?: string | null
  reviewed_by?: string | null
}

export interface UserPromptFavorite {
  id: string
  user_id: string
  prompt_id: string
  personal_notes?: string | null
  tags?: string[] | null
  created_at: string
  updated_at: string
  prompt?: LearningPrompt // Joined data
}

export interface UserPromptCollection {
  id: string
  user_id: string
  name: string
  description?: string | null
  is_public: boolean
  slug: string
  created_at: string
  updated_at: string
  prompt_count?: number // Computed field
}

export interface CollectionPrompt {
  id: string
  collection_id: string
  prompt_id: string
  order_index: number
  created_at: string
  prompt?: LearningPrompt // Joined data
}

export interface PromptAnalytics {
  id: string
  prompt_id: string
  event_type: 'view' | 'favorite' | 'unfavorite' | 'copy' | 'use' | 'share'
  user_id?: string | null
  session_id?: string | null
  metadata?: Record<string, unknown> | null
  created_at: string
}

export interface UserProfile {
  id: string
  username?: string | null
  display_name?: string | null
  bio?: string | null
  avatar_url?: string | null
  preferred_ai_tools?: string[] | null
  learning_goals?: string[] | null
  profile_visibility: 'public' | 'private'
  show_favorites: boolean
  show_collections: boolean
  created_at: string
  updated_at: string
}

// Prompt Filter Types
export interface PromptFilterState {
  categories: PromptCategory[]
  difficulty: ('beginner' | 'intermediate' | 'advanced')[]
  ai_tools: string[]
  search: string
}

export const EMPTY_PROMPT_FILTER_STATE: PromptFilterState = {
  categories: [],
  difficulty: [],
  ai_tools: [],
  search: ''
}

// Component Props for Prompts
export interface PromptCardProps {
  prompt: LearningPrompt
  variant?: 'default' | 'compact' | 'featured'
  isFavorited?: boolean
  onFavoriteToggle?: (promptId: string) => void
  showFavoriteButton?: boolean
  index?: number
  onClick?: () => void
  lazy?: boolean
  className?: string
}

export interface PromptGridProps {
  prompts: LearningPrompt[]
  isLoading?: boolean
  emptyState?: React.ReactNode
  className?: string
  showFavoriteButton?: boolean
  onFavoriteToggle?: (promptId: string) => void
  favoritedPromptIds?: Set<string>
}

export interface PromptFilterSidebarProps {
  categories: PromptCategory[]
  selectedFilters: PromptFilterState
  onFilterChange: (filters: PromptFilterState) => void
  isOpen?: boolean
  onClose?: () => void
  className?: string
}

// Prompt Category Metadata
export const promptCategoryMetadata: Record<PromptCategory, { label: string; icon: string; color: string; description: string }> = {
  'note-taking': {
    label: 'Notizen',
    icon: '📝',
    color: 'bg-blue-100 text-blue-700',
    description: 'Effektive Notiz-Techniken und Strukturierung'
  },
  'memory-techniques': {
    label: 'Gedächtnistechniken',
    icon: '🧠',
    color: 'bg-purple-100 text-purple-700',
    description: 'Merkhilfen und Gedächtnisstrategien'
  },
  'comprehension': {
    label: 'Textverständnis',
    icon: '📖',
    color: 'bg-green-100 text-green-700',
    description: 'Komplexe Texte verstehen und analysieren'
  },
  'essay-writing': {
    label: 'Essay & Aufsätze',
    icon: '✍️',
    color: 'bg-pink-100 text-pink-700',
    description: 'Akademisches Schreiben verbessern'
  },
  'exam-prep': {
    label: 'Prüfungsvorbereitung',
    icon: '📋',
    color: 'bg-orange-100 text-orange-700',
    description: 'Effektive Prüfungsstrategien'
  },
  'research': {
    label: 'Recherche',
    icon: '🔍',
    color: 'bg-indigo-100 text-indigo-700',
    description: 'Wissenschaftliche Recherche-Methoden'
  },
  'language-learning': {
    label: 'Sprachenlernen',
    icon: '🌍',
    color: 'bg-teal-100 text-teal-700',
    description: 'Neue Sprachen effektiv lernen'
  },
  'math-problem-solving': {
    label: 'Mathematik',
    icon: '🔢',
    color: 'bg-red-100 text-red-700',
    description: 'Mathematische Probleme lösen'
  },
  'coding-practice': {
    label: 'Programmieren',
    icon: '💻',
    color: 'bg-gray-100 text-gray-700',
    description: 'Code verstehen und debuggen'
  },
  'general-learning': {
    label: 'Allgemein',
    icon: '🎓',
    color: 'bg-yellow-100 text-yellow-700',
    description: 'Universelle Lernstrategien'
  }
}

// Category Metadata
export const categoryMetadata: Record<Category, { label: string; icon: string; color: string }> = {
  'productivity': {
    label: 'Produktivität',
    icon: '🚀',
    color: 'bg-blue-100 text-blue-700'
  },
  'content-creation': {
    label: 'Content-Erstellung',
    icon: '✍️',
    color: 'bg-purple-100 text-purple-700'
  },
  'programming': {
    label: 'Programmierung',
    icon: '💻',
    color: 'bg-green-100 text-green-700'
  },
  'design': {
    label: 'Design',
    icon: '🎨',
    color: 'bg-pink-100 text-pink-700'
  },
  'data-analysis': {
    label: 'Datenanalyse',
    icon: '📊',
    color: 'bg-orange-100 text-orange-700'
  },
  'learning': {
    label: 'Lernen',
    icon: '📚',
    color: 'bg-indigo-100 text-indigo-700'
  },
  'business': {
    label: 'Business',
    icon: '💼',
    color: 'bg-gray-100 text-gray-700'
  },
  'marketing': {
    label: 'Marketing',
    icon: '📈',
    color: 'bg-red-100 text-red-700'
  }
}
