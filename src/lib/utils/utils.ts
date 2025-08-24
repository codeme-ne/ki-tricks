import { FilterState, KITrick, Category, Difficulty, Impact } from '../types/types'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
  if (filters.departments && filters.departments.length > 0) count += filters.departments.length
  if (filters.industries && filters.industries.length > 0) count += filters.industries.length
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
export const createFilterHandler = <T extends string>(
  filters: FilterState,
  filterKey: keyof FilterState,
  onFilterChange: (filters: FilterState) => void
) => {
  return (value: T, checked: boolean) => {
    const currentValues = filters[filterKey] as T[]
    const newValues = toggleArrayItem(currentValues, value)
    
    onFilterChange({
      ...filters,
      [filterKey]: newValues
    })
  }
}

// CSS class utilities
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}