'use client'

import React from 'react'
import Link from 'next/link'
import { Badge } from '@/components/atoms'
import { KITrick, TrickCardProps, categoryMetadata, impactMetadata } from '@/lib/types/types'
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
  const impactMeta = impactMetadata[trick.impact]
  
  // Prüfe ob Trick neu ist (innerhalb der letzten 7 Tage)
  const isNewTrick = () => {
    if (!trick.createdAt) return false
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return new Date(trick.createdAt) > weekAgo
  }
  
  // KI/Tech-thematische Icons für verschiedene Kategorien
  const getCategoryIcon = () => {
    const iconClass = "w-5 h-5"
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
    <div className="relative group/card h-full">
      {/* NEU Badge - Harmonisch positioniert und sichtbar */}
      {isNewTrick() && (
        <div className="absolute -top-2 -right-2 z-20">
          <Badge variant="new">
            NEU
          </Badge>
        </div>
      )}
      {/* Hover Gradient Overlay */}
      <div className="opacity-0 group-hover/card:opacity-100 transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800/20 to-transparent pointer-events-none rounded-lg" />
      
      <div className={cn(
        "bg-white dark:bg-neutral-900 p-6 flex flex-col transition-all duration-300",
        compact ? "min-h-[280px]" : "h-[320px]"
      )}>
        {/* Icon & Category Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-neutral-600 dark:text-neutral-400 group-hover/card:text-primary-600 transition-colors">
              {getCategoryIcon()}
            </div>
            <Badge className={cn(
              "text-xs",
              categoryMeta.color
            )}>
              {categoryMeta.label}
            </Badge>
          </div>
        </div>
        
        {/* Title with side accent */}
        <div className="relative mb-3">
          <div className="absolute left-0 inset-y-0 h-6 group-hover/card:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/card:bg-primary-600 transition-all duration-300 origin-center" />
          <h3 className={cn(
          "text-lg font-bold text-neutral-800 dark:text-neutral-100 leading-tight pl-4 group-hover/card:translate-x-1 transition-transform duration-300",
          compact ? "line-clamp-3" : "line-clamp-2"
        )}>
            {trick.title}
          </h3>
        </div>
        
        {/* Description */}
        <p className={cn(
          "text-neutral-600 dark:text-neutral-300 text-sm mb-6 leading-relaxed flex-1 px-4",
          compact ? "line-clamp-4" : "line-clamp-3"
        )}>
          {trick.description.split('\n')[0]}
        </p>
        
        {/* Meta Information */}
        <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800 px-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                {trick.timeToImplement}
              </div>
              <Badge 
                variant={impactMeta.color as any}
                className="text-xs"
              >
                Impact: {impactMeta.label}
              </Badge>
            </div>
          </div>
          
          {/* Action Link */}
          <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-semibold group-hover/card:text-primary-700 dark:group-hover/card:text-primary-300">
            Jetzt ausprobieren
            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover/card:translate-x-1.5" />
          </div>
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