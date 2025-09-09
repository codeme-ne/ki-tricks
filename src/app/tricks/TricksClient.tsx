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
      createdAt: new Date(trick.created_at),
      updatedAt: new Date(trick.updated_at),
      'Warum es funktioniert': trick.why_it_works,
      // research-backed optional fields
      role: trick.role ?? undefined,
      industries: trick.industries ?? undefined,
      toolVendor: trick.tool_vendor ?? undefined,
      integrations: trick.integrations ?? undefined,
      estimatedTimeMinutes: trick.estimated_time_minutes ?? undefined,
      estimatedSavingsMinutes: trick.estimated_savings_minutes ?? undefined,
      riskLevel: trick.risk_level ?? undefined,
      evidenceLevel: trick.evidence_level ?? undefined,
      prerequisites: trick.prerequisites ?? undefined,
      privacyNotes: trick.privacy_notes ?? undefined,
      sources: (Array.isArray(trick.sources) ? trick.sources : undefined) as any,
      promptExamples: trick.prompt_examples ?? undefined,
      kpiSuggestions: trick.kpi_suggestions ?? undefined
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
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Menu className="h-4 w-4" />
          Kategorien ({hasActiveFilters(filters) ? filters.categories.length : 0})
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
