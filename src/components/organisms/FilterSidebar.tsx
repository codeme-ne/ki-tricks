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
  className = ''
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
  const handleCategoryChange = createFilterHandler(selectedFilters, onFilterChange)
  

  // Reset all filters
  const handleReset = () => {
    onFilterChange(EMPTY_FILTER_STATE)
  }

  // Count active filters
  const activeFilterCount = countActiveFilters(selectedFilters)

  // FilterSection is now imported as a separate component

  const sidebarContent = (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-foreground" />
          <h2 className="text-base font-medium text-foreground">Kategorien</h2>
          {activeFilterCount > 0 && (
            <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded font-medium">
              {activeFilterCount}
            </span>
          )}
        </div>
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Filter schließen"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Filter Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {/* Categories */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Kategorien wählen</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50 rounded-md p-2 transition-colors">
                <Checkbox
                  label={categoryMetadata[category].label}
                  checked={selectedFilters.categories.includes(category)}
                  onChange={(checked) => handleCategoryChange(category, checked)}
                  className="shrink-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      {activeFilterCount > 0 && (
        <div className="border-t border-border p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2"
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
      {/* Overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-foreground/5 backdrop-blur-[1px] z-40"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-background z-50 shadow-2xl border-r border-border">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  )
}