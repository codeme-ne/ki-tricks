'use client'

import React, { useState, useMemo } from 'react'
import { FilterSidebar, TrickGrid } from '@/components/organisms'
import { SearchBar } from '@/components/molecules'
import { Button } from '@/components/atoms'
import { Menu } from 'lucide-react'
import { useFilters } from '@/hooks/useFilters'
import { hasActiveFilters } from '@/lib/utils/utils'
import { KITrick, Category } from '@/lib/types/types'
import type { Database } from '@/lib/supabase/types'

type TrickRow = Database['public']['Tables']['ki_tricks']['Row']

interface TricksClientProps {
  serverTricks?: TrickRow[]
  serverCategories?: string[]
}

export default function TricksClient({ serverTricks = [], serverCategories = [] }: TricksClientProps) {
  const { filters, updateFilters } = useFilters()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Convert Supabase data to KITrick format
  const tricks: KITrick[] = useMemo(() => {
    return serverTricks.map(trick => ({
      id: trick.id,
      title: trick.title,
      description: trick.description,
      category: trick.category as Category,
      tools: trick.tools,
      steps: trick.steps || [],
      examples: trick.examples || [],
      slug: trick.slug,
      created_at: trick.created_at,
      updated_at: trick.updated_at,
      published_at: trick.published_at || null,
      why_it_works: trick.why_it_works,
      status: trick.status || 'published',
      quality_score: trick.quality_score || null,
      view_count: trick.view_count || 0
    }))
  }, [serverTricks])

  // Filter tricks based on search and filters
  const filteredTricks = useMemo(() => {
    let result = tricks

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter(trick => filters.categories.includes(trick.category))
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(trick => 
        trick.title.toLowerCase().includes(query) ||
        trick.description.toLowerCase().includes(query) ||
        trick.tools.some(tool => tool.toLowerCase().includes(query))
      )
    }

    return result
  }, [tricks, searchQuery, filters])

  const availableCategories = useMemo(() => serverCategories as Category[], [serverCategories])

  return (
    <div className="space-y-8">
      {/* Search Bar */}
  <div className="relative max-w-xl sm:max-w-2xl">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Suche nach KI-Tricks, Tools, Themen..."
          variant="default"
        />
      </div>

      {/* Filter Button and Results Count */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Button */}
        <Button
          variant="outline"
          onClick={() => setIsSidebarOpen(true)}
          className="inline-flex items-center gap-2 min-w-[120px]"
        >
          <Menu className="h-4 w-4" />
          <span className="flex-1 text-left">Kategorien {hasActiveFilters(filters) ? `(${filters.categories.length})` : ''}</span>
        </Button>

        {/* Results Header */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-xl sm:text-2xl">✨</span>
          <span className="text-base sm:text-lg font-medium">
            {filteredTricks.length} {filteredTricks.length === 1 ? 'Trick' : 'Tricks'}
          </span>
        </div>
      </div>

      {/* Mobile/Desktop Filter Sidebar */}
      <FilterSidebar
        categories={availableCategories}
        selectedFilters={filters}
        onFilterChange={updateFilters}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Tricks Grid - Full Width */}
      <TrickGrid
        tricks={filteredTricks}
        isLoading={false}
        emptyStateMessage="Keine Tricks gefunden. Versuche deine Filter anzupassen."
      />
    </div>
  );
}
