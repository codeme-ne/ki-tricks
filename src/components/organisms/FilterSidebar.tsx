'use client'

import { useEffect } from 'react'
import { X, Filter, RotateCcw } from 'lucide-react'
import { FilterSidebarProps, Category, EMPTY_FILTER_STATE } from '@/lib/types/types'
import { categoryMetadata } from '@/lib/types/types'
import { createFilterHandler, countActiveFilters } from '@/lib/utils/utils'
import { Button, Checkbox, FilterSection } from '@/components/atoms'

export function FilterSidebar({
  categories,
  selectedFilters,
  onFilterChange,
  isOpen = false,
  onClose,
  className = '',
  departments = [],
  industries = []
}: FilterSidebarProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when sidebar is open on mobile
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Create filter handlers using the utility function
  const handleCategoryChange = createFilterHandler<Category>(
    selectedFilters, 
    'categories', 
    onFilterChange
  )
  
  // Departments/Industries handlers
  const handleDepartmentChange = createFilterHandler<string>(
    selectedFilters,
    'departments',
    onFilterChange
  )
  const handleIndustryChange = createFilterHandler<string>(
    selectedFilters,
    'industries',
    onFilterChange
  )
  

  // Reset all filters
  const handleReset = () => {
    onFilterChange(EMPTY_FILTER_STATE)
  }

  // Count active filters
  const activeFilterCount = countActiveFilters(selectedFilters)

  // FilterSection is now imported as a separate component

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-700/60">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-600/20 rounded-lg">
            <Filter className="w-4 h-4 text-primary-400" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-100">Filter</h2>
          {activeFilterCount > 0 && (
            <span className="bg-primary-600 text-white text-xs px-2.5 py-1.5 rounded-full font-medium border border-primary-500">
              {activeFilterCount}
            </span>
          )}
        </div>
        {/* Close button - only visible on mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-neutral-700/60 rounded-lg transition-colors"
            aria-label="Filter schließen"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        )}
      </div>

      {/* Filter Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Categories */}
        <FilterSection 
          title="Kategorien" 
          count={selectedFilters.categories.length}
        >
          {categories.map((category) => (
            <Checkbox
              key={category}
              label={categoryMetadata[category].label}
              checked={selectedFilters.categories.includes(category)}
              onChange={(checked: boolean) => handleCategoryChange(category, checked)}
            />
          ))}
        </FilterSection>

        {/* Departments (optional) */}
        {departments.length > 0 && (
          <FilterSection 
            title="Abteilungen" 
            count={selectedFilters.departments?.length || 0}
          >
            {departments.map((dep) => (
              <Checkbox
                key={dep}
                label={dep}
                checked={selectedFilters.departments?.includes(dep) || false}
                onChange={(checked: boolean) => handleDepartmentChange(dep, checked)}
              />
            ))}
          </FilterSection>
        )}

        {/* Industries (optional) */}
        {industries.length > 0 && (
          <FilterSection 
            title="Branchen" 
            count={selectedFilters.industries?.length || 0}
          >
            {industries.map((ind) => (
              <Checkbox
                key={ind}
                label={ind}
                checked={selectedFilters.industries?.includes(ind) || false}
                onChange={(checked: boolean) => handleIndustryChange(ind, checked)}
              />
            ))}
          </FilterSection>
        )}

      </div>

      {/* Footer */}
      {activeFilterCount > 0 && (
        <div className="border-t border-neutral-700/60 p-6">
          <Button
            variant="secondary"
            size="md"
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 bg-neutral-800/60 hover:bg-neutral-700/60 text-neutral-300 hover:text-neutral-100 border-neutral-700/60 hover:border-neutral-600/60 transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4" />
            Filter zurücksetzen
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile: Overlay */}
      {isOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 w-full max-w-sm bg-neutral-900/95 backdrop-blur-xl z-50 shadow-2xl">
            {sidebarContent}
          </div>
        </>
      )}

      {/* Desktop: Sticky Sidebar */}
      <div className={`hidden lg:block lg:sticky lg:top-6 lg:h-fit w-64 flex-shrink-0 ${className}`}>
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-700/60 rounded-2xl shadow-2xl shadow-black/20">
          {sidebarContent}
        </div>
      </div>
    </>
  )
}