'use client'

import React, { useState, useMemo } from 'react'
import { FilterSidebar, TrickGrid } from '@/components/organisms'
import { SearchBar } from '@/components/molecules'
import { Button } from '@/components/atoms'
import { Menu } from 'lucide-react'
import { useFilters } from '@/hooks/useFilters'
import { hasActiveFilters } from '@/lib/utils/utils'
import { KITrick, Category } from '@/lib/types/types'

interface TricksClientProps {
  serverTricks?: any[]
  serverCategories?: string[]
  departments?: string[]
  industries?: string[]
}

export default function TricksClient({ serverTricks = [], serverCategories = [], departments = [], industries = [] }: TricksClientProps) {
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
      departmentTags: trick.department_tags || [],
      industryTags: trick.industry_tags || [],
      steps: trick.steps || [],
      examples: trick.examples || [],
      slug: trick.slug,
      createdAt: new Date(trick.created_at),
      updatedAt: new Date(trick.updated_at),
      'Warum es funktioniert': trick.why_it_works
    }))
  }, [serverTricks])

  // Filter tricks based on search and filters
  const filteredTricks = useMemo(() => {
    let result = tricks

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter(trick => filters.categories.includes(trick.category))
    }

    // Departments
    if (filters.departments && filters.departments.length > 0) {
      result = result.filter(trick => (trick.departmentTags || []).some(t => filters.departments!.includes(t)))
    }
    // Industries
    if (filters.industries && filters.industries.length > 0) {
      result = result.filter(trick => (trick.industryTags || []).some(t => filters.industries!.includes(t)))
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
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsSidebarOpen(true)}
          className="w-full"
        >
          <Menu className="h-4 w-4" />
          Filter ({hasActiveFilters(filters) ? filters.categories.length + (filters.departments?.length || 0) + (filters.industries?.length || 0) : 0})
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
          departments={departments}
          industries={industries}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Suche nach KI Tricks..."
              variant="glowing"
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