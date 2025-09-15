'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { KITrick } from '@/lib/types/types'
import { Badge, BaseCard } from '@/components/atoms'
import { categoryLabels, categoryEmojis } from '@/lib/constants/constants'

interface RefinedTrickCardProps {
  trick: KITrick
}

export const RefinedTrickCard: React.FC<RefinedTrickCardProps> = ({ trick }) => {
  // Memoize expensive calculations
  const categoryInfo = useMemo(() => ({
    label: categoryLabels[trick.category],
    emoji: categoryEmojis[trick.category]
  }), [trick.category])

  return (
    <Link href={`/trick/${trick.slug}`} className="block h-full group">
      <BaseCard as="article" variant="feature">
        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-blue-600 transition-colors">
          {trick.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground line-clamp-3 mb-4 text-sm leading-relaxed flex-1">
          {trick.description.split('\n')[0]}
        </p>

        {/* Footer */}
        <div className="mt-auto">
          {/* Category badge */}
          <div className="flex items-center justify-between">
            <Badge className="bg-neutral-50 text-neutral-700 border-neutral-200 shadow-sm">
              <span className="mr-1.5">{categoryInfo.emoji}</span>
              {categoryInfo.label}
            </Badge>

            <div className="p-2 rounded-full bg-white/80 text-neutral-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </BaseCard>
    </Link>
  )
}

// Memoize component for performance
export default React.memo(RefinedTrickCard)
