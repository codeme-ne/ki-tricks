import type { Database } from '@/lib/supabase/types'
import type { KITrick } from './types'

// Database type aliases for easier usage
export type DatabaseTrick = Database['public']['Tables']['ki_tricks']['Row']
export type DatabaseTrickInsert = Database['public']['Tables']['ki_tricks']['Insert']
export type DatabaseTrickUpdate = Database['public']['Tables']['ki_tricks']['Update']

export type DatabaseSubmission = Database['public']['Tables']['trick_submissions']['Row']
export type DatabaseSubmissionInsert = Database['public']['Tables']['trick_submissions']['Insert']
export type DatabaseSubmissionUpdate = Database['public']['Tables']['trick_submissions']['Update']

export type DatabaseAnalytics = Database['public']['Tables']['trick_analytics']['Row']
export type DatabaseAnalyticsInsert = Database['public']['Tables']['trick_analytics']['Insert']

// Type guards for runtime validation
export function isDatabaseTrick(obj: any): obj is DatabaseTrick {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.category === 'string' &&
    Array.isArray(obj.tools) &&
    typeof obj.slug === 'string' &&
    typeof obj.why_it_works === 'string' &&
    typeof obj.status === 'string' &&
    typeof obj.view_count === 'number' &&
    typeof obj.created_at === 'string' &&
    typeof obj.updated_at === 'string'
  )
}

export function isValidCategory(category: string): category is DatabaseTrick['category'] {
  return [
    'productivity',
    'content-creation',
    'programming',
    'design',
    'data-analysis',
    'learning',
    'business',
    'marketing'
  ].includes(category)
}

export function isValidStatus(status: string): status is DatabaseTrick['status'] {
  return ['draft', 'pending', 'published', 'rejected'].includes(status)
}

// Conversion functions between Database and KITrick types
export function databaseToKITrick(dbTrick: DatabaseTrick): KITrick {
  return {
    id: dbTrick.id,
    title: dbTrick.title,
    description: dbTrick.description,
    category: dbTrick.category,
    tools: dbTrick.tools,
    steps: dbTrick.steps,
    examples: dbTrick.examples,
    slug: dbTrick.slug,
    why_it_works: dbTrick.why_it_works,
    status: dbTrick.status,
    quality_score: dbTrick.quality_score,
    view_count: dbTrick.view_count,
    created_at: dbTrick.created_at,
    updated_at: dbTrick.updated_at,
    published_at: dbTrick.published_at
  }
}

export function kiTrickToDatabase(trick: Partial<KITrick>): DatabaseTrickInsert {
  return {
    id: trick.id,
    title: trick.title!,
    description: trick.description!,
    category: trick.category!,
    tools: trick.tools || [],
    steps: trick.steps || null,
    examples: trick.examples || null,
    slug: trick.slug!,
    why_it_works: trick.why_it_works!,
    status: trick.status || 'draft',
    quality_score: trick.quality_score || null,
    view_count: trick.view_count || 0,
    created_at: trick.created_at,
    updated_at: trick.updated_at,
    published_at: trick.published_at || null
  }
}

// Utility functions for common operations
export function createEmptyTrick(): Partial<KITrick> {
  return {
    title: '',
    description: '',
    category: 'productivity',
    tools: [],
    steps: [],
    examples: [],
    slug: '',
    why_it_works: '',
    status: 'draft',
    quality_score: null,
    view_count: 0
  }
}

export function validateTrickForInsert(trick: Partial<KITrick>): trick is Required<Pick<KITrick, 'title' | 'description' | 'category' | 'slug' | 'why_it_works'>> & Partial<KITrick> {
  return !!(
    trick.title &&
    trick.description &&
    trick.category &&
    trick.slug &&
    trick.why_it_works &&
    isValidCategory(trick.category)
  )
}

// Error types for better error handling
export class TrickValidationError extends Error {
  constructor(field: string, message: string) {
    super(`Invalid ${field}: ${message}`)
    this.name = 'TrickValidationError'
  }
}

export class TrickNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Trick not found: ${identifier}`)
    this.name = 'TrickNotFoundError'
  }
}