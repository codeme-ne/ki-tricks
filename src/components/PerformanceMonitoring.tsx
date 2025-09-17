'use client'

import { useEffect } from 'react'
import { initPerformanceMonitoring, initMonetizationTracking } from '@/lib/analytics'

export function PerformanceMonitoring() {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring()

    // Initialize monetization tracking for revenue optimization
    initMonetizationTracking()
  }, [])

  // This component doesn't render anything
  return null
}