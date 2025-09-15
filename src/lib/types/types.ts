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
  variant?: 'default' | 'compact'
  onClick?: () => void
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
  placeholder?: string
  className?: string
  variant?: 'default' | 'glowing'
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
