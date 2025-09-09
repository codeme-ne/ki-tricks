'use client'

import React, { useMemo, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { KITrick } from '@/lib/types/types'
import { Badge } from '@/components/atoms/Badge'
import { categoryLabels, categoryEmojis } from '@/lib/constants/constants'

interface RefinedTrickCardProps {
  trick: KITrick
}

export const RefinedTrickCard: React.FC<RefinedTrickCardProps> = ({ trick }) => {
  // Mobile detection for performance optimization
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Memoize expensive calculations
  const categoryInfo = useMemo(() => ({
    label: categoryLabels[trick.category],
    emoji: categoryEmojis[trick.category]
  }), [trick.category])
  
  // difficulty/impact removed
  
  // Memoize accent color calculation
  const accentColor = useMemo(() => ({
    productivity: '#3B82F6',
    'content-creation': '#A855F7',
    programming: '#22C55E',
    design: '#EC4899',
    'data-analysis': '#FB923C',
    learning: '#FACC15',
    business: '#6366F1',
    marketing: '#EF4444',
  }[trick.category] || '#2299DD'), [trick.category])

  return (
    <Link href={`/trick/${trick.slug}`} className="block h-full group">
      <div 
        className={`relative bg-card border border-border rounded-xl p-6 h-full flex flex-col justify-between transition-all ${
          isMobile 
            ? 'duration-150' 
            : 'duration-300 hover:border-muted-foreground/30 hover:shadow-md hover:-translate-y-1'
        }`}
        style={{ 
          contain: 'layout style paint',
          transform: 'translateZ(0)', // Enable hardware acceleration
          willChange: isMobile ? 'auto' : 'transform'
        }}
      >
        {/* Content */}
        <div>
          {/* Title */}
          <h3 className={`text-lg font-semibold text-foreground mb-3 ${isMobile ? '' : 'group-hover:text-primary transition-colors duration-300'}`}>
            {trick.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground line-clamp-3 mb-4 text-sm leading-relaxed">
            {trick.description.split('\n')[0]}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto">
          {/* Top badges: Category + optional Role/ToolVendor */}
          <div className="mb-3 flex flex-wrap gap-2">
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-foreground rounded-md text-xs border border-border"
              style={{ borderColor: `${accentColor}20` }}
            >
              <span>{categoryInfo.emoji}</span>
              <span>{categoryInfo.label}</span>
            </span>
            {trick.role && (
              <Badge variant="outline" className="text-xs">{trick.role}</Badge>
            )}
            {trick.toolVendor && (
              <Badge variant="outline" className="text-xs">{trick.toolVendor}</Badge>
            )}
          </div>

          {/* Meta row: time + evidence */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              {typeof trick.estimatedTimeMinutes === 'number' && (
                <span className="inline-flex items-center gap-1">⏱️ {trick.estimatedTimeMinutes} min</span>
              )}
            </div>
            {trick.evidenceLevel && (
              <span className="inline-flex items-center gap-1">📑 Evidenz {trick.evidenceLevel}</span>
            )}
          </div>
        </div>

      </div>
    </Link>
  )
}

// Memoize component for performance
export default React.memo(RefinedTrickCard)
