'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import Link from 'next/link'
import { Badge, BaseCard } from '@/components/atoms'
import { KITrick } from '@/lib/types/types'
import {
  ArrowRight,
  Code2,
  Brain,
  Briefcase,
  BarChart3,
  PenTool,
  Palette,
  TrendingUp,
  BookOpen,
} from 'lucide-react'
import { categoryLabels, categoryEmojis } from '@/lib/constants/constants'

interface TrickCardProps {
  trick: KITrick
  variant?: 'default' | 'compact' | 'featured'
  index?: number
  onClick?: () => void
  lazy?: boolean
}

export const TrickCard = React.memo(function TrickCard({
  trick,
  variant = 'default',
  index = 0,
  onClick,
  lazy = false
}: TrickCardProps) {
  const [isInView, setIsInView] = useState(!lazy || index < 6)
  const cardRef = useRef<HTMLDivElement>(null)

  // Memoize expensive calculations
  const categoryInfo = useMemo(() => ({
    label: categoryLabels[trick.category],
    emoji: categoryEmojis[trick.category]
  }), [trick.category])

  // Category icon mapping
  const getCategoryIcon = () => {
    const iconClass = 'w-4 h-4 text-neutral-400'
    switch (trick.category) {
      case 'programming':
        return <Code2 className={iconClass} />
      case 'productivity':
        return <TrendingUp className={iconClass} />
      case 'content-creation':
        return <PenTool className={iconClass} />
      case 'data-analysis':
        return <BarChart3 className={iconClass} />
      case 'learning':
        return <Brain className={iconClass} />
      case 'business':
        return <Briefcase className={iconClass} />
      case 'marketing':
        return <TrendingUp className={iconClass} />
      case 'design':
        return <Palette className={iconClass} />
      default:
        return <BookOpen className={iconClass} />
    }
  }

  // Lazy loading setup
  useEffect(() => {
    if (!lazy || isInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (cardRef.current) {
            observer.unobserve(cardRef.current)
          }
        }
      },
      {
        rootMargin: '100px',
        threshold: 0
      }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [lazy, isInView])

  // Skeleton loading placeholder
  const SkeletonCard = () => (
    <div className="bg-card border border-border rounded-2xl h-full min-h-[400px] animate-pulse">
      <div className="p-6 space-y-4">
        <div className="h-6 bg-muted rounded w-20"></div>
        <div className="h-8 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
    </div>
  )

  // Variant-specific styling
  const getCardVariant = () => {
    switch (variant) {
      case 'compact':
        return 'compact'
      case 'featured':
        return 'feature'
      default:
        return 'default'
    }
  }

  // Render the main card content
  const CardContent = () => (
    <BaseCard
      onClick={onClick}
      as="article"
      variant={getCardVariant()}
      className="h-full flex flex-col"
    >
      {/* Header - varies by variant */}
      {variant === 'featured' ? (
        // Featured variant: Clean layout with emoji
        <>
          <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-blue-600 transition-colors">
            {trick.title}
          </h3>

          <p className="text-muted-foreground line-clamp-3 mb-4 text-sm leading-relaxed flex-1">
            {trick.description.split('\n')[0]}
          </p>

          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <Badge className="bg-neutral-50 text-neutral-700 border-neutral-200 shadow-sm">
                <span>
                  <span className="mr-1.5">{categoryInfo.emoji}</span>
                  {categoryInfo.label}
                </span>
              </Badge>

              <div className="p-2 rounded-full bg-white/80 text-neutral-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all shadow-sm">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </>
      ) : (
        // Default/compact variant: Icon-based layout
        <>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {getCategoryIcon()}
            <Badge className="bg-neutral-50 border-neutral-200 text-neutral-700 text-xs py-1 px-2.5 font-medium">
              {categoryInfo.label}
            </Badge>
          </div>

          <h3 className="text-neutral-900 font-semibold leading-tight text-lg mb-2">
            {trick.title}
          </h3>

          <p className="text-neutral-600 text-sm leading-relaxed flex-1 line-clamp-3 mb-4">
            {trick.description.split('\n')[0]}
          </p>

          <div className="mt-auto pt-3 flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Mehr erfahren</span>
            <div className="p-1.5 rounded-full bg-neutral-100 text-neutral-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </>
      )}
    </BaseCard>
  )

  // Return with or without Link wrapper
  if (onClick) {
    return (
      <div
        ref={cardRef}
        style={{
          minHeight: lazy ? '400px' : 'auto',
          contain: lazy ? 'layout style' : 'none'
        }}
        className="h-full"
      >
        {isInView ? <CardContent /> : <SkeletonCard />}
      </div>
    )
  }

  return (
    <Link href={`/trick/${trick.slug}`} className="block h-full group">
      <div
        ref={cardRef}
        style={{
          minHeight: lazy ? '400px' : 'auto',
          contain: lazy ? 'layout style' : 'none'
        }}
        className="h-full"
      >
        {isInView ? <CardContent /> : <SkeletonCard />}
      </div>
    </Link>
  )
})

TrickCard.displayName = 'TrickCard'

export default TrickCard