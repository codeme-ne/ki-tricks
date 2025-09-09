import { FilterState } from '../types/types'
import { cn } from '../utils'

/**
 * Utility functions for filtering and array manipulation
 */

// Note: filterTricks moved to mock-data.ts to avoid duplication

// Array manipulation utilities
export const toggleArrayItem = <T>(array: T[], item: T): T[] => {
  const index = array.indexOf(item)
  if (index === -1) {
    return [...array, item]
  }
  return array.filter(i => i !== item)
}

// Filter count utilities
export const countActiveFilters = (filters: FilterState): number => {
  let count = 0
  if (filters.categories.length > 0) count += filters.categories.length
  if (filters.search.trim() !== '') count += 1
  return count
}

export const hasActiveFilters = (filters: FilterState): boolean => {
  return countActiveFilters(filters) > 0
}

// URL parameter utilities
export const parseArrayParam = (param: string | null): string[] => {
  if (!param) return []
  return param.split(',').filter(Boolean)
}

export const serializeArrayParam = (arr: string[]): string => {
  return arr.join(',')
}

// Generic filter handler creator
export const createFilterHandler = (
  filters: FilterState,
  onFilterChange: (filters: FilterState) => void
) => {
  return (value: string, checked: boolean) => {
  const currentValues = filters.categories as string[]
  const next = toggleArrayItem(currentValues, value) as unknown as typeof filters.categories
    onFilterChange({
      ...filters,
      categories: next
    })
  }
}

// CSS class utilities
export { cn }
