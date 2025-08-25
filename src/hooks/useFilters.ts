'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FilterState, Category, EMPTY_FILTER_STATE } from '@/lib/types/types'
import { 
  parseArrayParam, 
  serializeArrayParam, 
  countActiveFilters, 
  hasActiveFilters 
} from '@/lib/utils/utils'

export const useFilters = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTER_STATE)
  const [isLoading, setIsLoading] = useState(true)

  // Parse URL parameters on mount
  useEffect(() => {
    const urlFilters: FilterState = {
      categories: parseArrayParam(searchParams.get('categories')) as Category[],
      search: searchParams.get('search') || ''
    }
    
    setFilters(urlFilters)
    setIsLoading(false)
  }, [searchParams])

  // Helper functions are now imported from utils

  // Update URL with current filters
  const updateURL = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams()
    
    if (newFilters.categories.length > 0) {
      params.set('categories', serializeArrayParam(newFilters.categories))
    }
    
    if (newFilters.search.trim() !== '') {
      params.set('search', newFilters.search)
    }

    const queryString = params.toString()
    const newUrl = queryString ? `?${queryString}` : window.location.pathname
    
    router.push(newUrl, { scroll: false })
  }, [router])

  // Update filters and URL
  const updateFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    updateURL(newFilters)
  }, [updateURL])

  // Update specific filter category
  const updateFilter = useCallback((
    filterType: keyof FilterState,
    value: string[] | string
  ) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    }
    updateFilters(newFilters)
  }, [filters, updateFilters])

  // Reset all filters
  const resetFilters = useCallback(() => {
    updateFilters(EMPTY_FILTER_STATE)
  }, [updateFilters])

  // Get count of active filters
  const getActiveFilterCount = useCallback(() => {
    return countActiveFilters(filters)
  }, [filters])

  // Check if filters are active
  const hasActiveFiltersState = useCallback(() => {
    return hasActiveFilters(filters)
  }, [filters])

  return {
    filters,
    updateFilters,
    updateFilter,
    resetFilters,
    getActiveFilterCount,
    hasActiveFilters: hasActiveFiltersState,
    isLoading
  }
}