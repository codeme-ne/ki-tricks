'use client'

import React, { useEffect, useRef, useState } from 'react'
import { KITrick } from '@/lib/types/types'
import { RefinedTrickCard } from './RefinedTrickCard'

interface LazyTrickCardProps {
  trick: KITrick
  index?: number
}

export const LazyTrickCard: React.FC<LazyTrickCardProps> = ({ trick, index = 0 }) => {
  const [isInView, setIsInView] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Load first 6 cards immediately for above-the-fold content
    if (index < 6) {
      setIsInView(true)
      return
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          // Once loaded, stop observing
          if (cardRef.current) {
            observer.unobserve(cardRef.current)
          }
        }
      },
      {
        // Start loading when card is 100px away from viewport
        rootMargin: '100px',
        threshold: 0
      }
    )
    
    if (cardRef.current) {
      observer.observe(cardRef.current)
    }
    
    return () => {
      observer.disconnect()
    }
  }, [index])
  
  return (
    <div 
      ref={cardRef} 
      style={{ 
        minHeight: '400px',
        contain: 'layout style'
      }}
    >
      {isInView ? (
        <RefinedTrickCard trick={trick} />
      ) : (
        <div className="bg-card border border-border rounded-2xl h-full min-h-[400px] animate-pulse">
          <div className="p-6 space-y-4">
            <div className="h-6 bg-muted rounded w-20"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      )}
    </div>
  )
}

// Memoize for performance
export default React.memo(LazyTrickCard)