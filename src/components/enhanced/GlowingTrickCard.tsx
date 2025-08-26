'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { KITrick } from '@/lib/types/types'
import { Badge } from '@/components/atoms/Badge'
import { GlowingButton } from './GlowingButton'
import { categoryLabels, categoryEmojis } from '@/lib/constants/constants'

interface GlowingTrickCardProps {
  trick: KITrick
}

export const GlowingTrickCard: React.FC<GlowingTrickCardProps> = ({ trick }) => {
  const categoryInfo = { label: categoryLabels[trick.category], emoji: categoryEmojis[trick.category] }
  // difficulty/impact removed from card
  
  // Dynamic accent colors based on category - more subtle approach
  const accentColor = {
    productivity: 'rgb(59, 130, 246)', // blue
    'content-creation': 'rgb(168, 85, 247)', // purple
    programming: 'rgb(34, 197, 94)', // green
    design: 'rgb(236, 72, 153)', // pink
    'data-analysis': 'rgb(251, 146, 60)', // orange
    learning: 'rgb(250, 204, 21)', // yellow
    business: 'rgb(99, 102, 241)', // indigo
    marketing: 'rgb(239, 68, 68)', // red
  }[trick.category] || 'rgb(34, 153, 221)' // default blue

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="relative group h-full"
    >
      {/* Single, subtle border glow on hover */}
      <div 
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${accentColor}40, transparent, ${accentColor}20)`,
        }}
      />

      <Link href={`/trick/${trick.slug}`} className="block h-full">
  <div className="relative bg-card backdrop-blur-sm border border-border rounded-2xl p-6 h-full flex flex-col justify-between overflow-hidden transition-all duration-300 group-hover:border-muted-foreground/30 group-hover:shadow-lg group-hover:shadow-black/10">
          
          {/* Minimal background texture on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${accentColor} 0.5px, transparent 0.5px)`,
              backgroundSize: '20px 20px',
            }} />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <span />
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 45 }}
                transition={{ duration: 0.3 }}
                className="text-neutral-500 opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{ color: accentColor }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </div>

            {/* Title - Clean, no shimmer animation */}
            <h3 className="text-xl font-semibold text-foreground mb-3 transition-colors duration-300">
              {trick.title}
            </h3>

            {/* Description */}
            <p className="text-neutral-400 line-clamp-3 mb-4 text-sm leading-relaxed">
              {trick.description.split('\n')[0]}
            </p>

            {/* Category Badge */}
            <div className="mb-4">
              <Badge 
                variant="neutral" 
                className="bg-muted/50 text-foreground/80 group-hover:bg-muted transition-colors duration-300 border border-border"
              >
                {categoryInfo.emoji} {categoryInfo.label}
              </Badge>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 pt-4 border-t border-border transition-colors duration-300">
            
            {/* CTA Button */}
            <GlowingButton
              variant="primary"
              size="sm"
              className="w-full"
              glowColor={accentColor}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Jetzt ausprobieren
            </GlowingButton>
          </div>

          {/* Single subtle accent overlay */}
          <div 
            className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-60 transition-opacity duration-500"
            style={{
              background: `linear-gradient(to bottom, ${accentColor}, transparent)`,
            }}
          />
        </div>
      </Link>

    </motion.div>
  )
}

// Memoize component for performance
export default React.memo(GlowingTrickCard)