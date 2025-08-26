'use client'

import React from 'react'
import Link from 'next/link'
import { Badge } from '@/components/atoms'
import { KITrick, TrickCardProps, categoryMetadata } from '@/lib/types/types'
import { ArrowRight, Clock, Code2, Brain, Briefcase, BarChart3, PenTool, Palette, TrendingUp, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils/utils'

export const TrickCard = React.memo(function TrickCard({ 
  trick, 
  onClick, 
  index = 0, 
  compact = false 
}: TrickCardProps & { 
  index?: number
  compact?: boolean 
}) {
  const categoryMeta = categoryMetadata[trick.category]
  // impact/time removed
  
  // KI/Tech-thematische Icons für verschiedene Kategorien
  const getCategoryIcon = () => {
    const iconClass = "w-4 h-4 text-neutral-400"
    switch (trick.category) {
      case 'programming': return <Code2 className={iconClass} />
      case 'productivity': return <TrendingUp className={iconClass} />
      case 'content-creation': return <PenTool className={iconClass} />
      case 'data-analysis': return <BarChart3 className={iconClass} />
      case 'learning': return <Brain className={iconClass} />
      case 'business': return <Briefcase className={iconClass} />
      case 'marketing': return <TrendingUp className={iconClass} />
      case 'design': return <Palette className={iconClass} />
      default: return <BookOpen className={iconClass} />
    }
  }
  
  const cardContent = (
    <div className="h-full">
      <div
        className={cn(
          "bg-white border border-neutral-200 rounded-lg p-4 md:p-6 flex flex-col h-full transition-colors hover:border-neutral-300 hover:shadow-sm",
          compact ? "min-h-[240px]" : "min-h-[280px]"
        )}
      >
        {/* Header: Icon + Category */}
        <div className="flex items-center gap-2 mb-3">
          {getCategoryIcon()}
          <Badge className="bg-white border-neutral-200 text-neutral-600 text-[11px] py-0.5 px-2">
            {categoryMeta.label}
          </Badge>
        </div>

        {/* Title */}
        <h3
          className={cn(
            "text-neutral-900 font-semibold leading-tight",
            compact ? "text-base" : "text-lg"
          )}
        >
          {trick.title}
        </h3>

        {/* Description */}
        <p
          className={cn(
            "text-neutral-600 text-sm leading-relaxed mt-2 flex-1",
            compact ? "line-clamp-4" : "line-clamp-3"
          )}
        >
          {trick.description.split('\n')[0]}
        </p>

        {/* Action */}
        <div className="mt-4 text-neutral-900 text-sm font-medium inline-flex items-center">
          <span>Jetzt ausprobieren</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </div>
      </div>
    </div>
  )
  
  if (onClick) {
    return (
      <div onClick={onClick}>
        {cardContent}
      </div>
    )
  }
  
  return (
    <Link href={`/trick/${trick.slug}`}>
      {cardContent}
    </Link>
  )
})