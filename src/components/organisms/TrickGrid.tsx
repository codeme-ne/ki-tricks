'use client'

import React, { useMemo } from 'react'
import { SkeletonCard } from '@/components/molecules'
import { LazyTrickCard } from '@/components/enhanced/LazyTrickCard'
import { KITrick } from '@/lib/types/types'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils/utils'

interface TrickGridProps {
  tricks: KITrick[]
  isLoading?: boolean
  emptyStateMessage?: string
}

export function TrickGrid({ 
  tricks, 
  isLoading = false, 
  emptyStateMessage = "Keine Tricks gefunden" 
}: TrickGridProps) {
  
  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Results Counter Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-6 bg-neutral-200 rounded w-32 animate-pulse"></div>
        </div>
        
        {/* Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    )
  }
  
  // Empty State
  if (tricks.length === 0) {
    return (
      <div className="space-y-6">
        {/* Results Counter */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            0 Tricks gefunden
          </h2>
        </div>
        
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted rounded-full p-4 mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {emptyStateMessage}
          </h3>
          <p className="text-muted-foreground text-sm max-w-md">
            Versuche deine Suchkriterien zu ändern oder andere Filter zu verwenden, 
            um passende KI-Tricks zu finden.
          </p>
        </div>
      </div>
    )
  }
  
  // Results with Tricks
  return (
    <div className="space-y-6">
      {/* Grid with Lazy-loaded Cards */}
      <div 
        className="tricks-container grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        style={{
          contain: 'layout',
          transform: 'translateZ(0)', // Enable hardware acceleration
        }}
      >
        {tricks.map((trick, index) => (
          <LazyTrickCard key={trick.id} trick={trick} index={index} />
        ))}
      </div>
    </div>
  )
}