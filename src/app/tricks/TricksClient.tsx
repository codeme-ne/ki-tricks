'use client'

import React, { useState, useMemo } from 'react'
import { FilterSidebar, TrickGrid } from '@/components/organisms'
import { GlowingSearchBar } from '@/components/enhanced'
import { Button } from '@/components/atoms'
import { Menu } from 'lucide-react'
import { useFilters } from '@/hooks/useFilters'
import { mockTricks, getAllCategories, filterTricks } from '@/lib/data/mock-data'
import { hasActiveFilters } from '@/lib/utils/utils'
import { KITrick } from '@/lib/types/types'

export default function TricksClient() {
  const { filters, updateFilters } = useFilters()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Filter tricks based on search and filters
  const filteredTricks = useMemo(() => {
    return filterTricks(mockTricks, filters, searchQuery)
  }, [searchQuery, filters])

  const availableCategories = useMemo(() => getAllCategories(), [])

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsSidebarOpen(true)}
          className="w-full"
        >
          <Menu className="h-4 w-4" />
          Filter ({hasActiveFilters(filters) ? filters.categories.length + filters.difficulty.length + filters.impact.length : 0})
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar - handles both desktop and mobile internally */}
        <FilterSidebar
          categories={availableCategories}
          selectedFilters={filters}
          onFilterChange={updateFilters}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Search Bar */}
          <div className="mb-6">
            <GlowingSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Suche nach KI Tricks..."
            />
          </div>

          {/* Results Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">
              {filteredTricks.length} {filteredTricks.length === 1 ? 'Trick' : 'Tricks'} gefunden
            </h2>
          </div>

          {/* Tricks Grid */}
          <TrickGrid
            tricks={filteredTricks}
            isLoading={false}
            emptyStateMessage="Keine Tricks gefunden. Versuche deine Filter anzupassen."
          />
        </main>
      </div>
    </>
  );
}