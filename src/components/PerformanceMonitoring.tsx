'use client'

import { useEffect } from 'react'
import { initPerformanceMonitoring } from '@/lib/analytics'

export function PerformanceMonitoring() {
  useEffect(() => {
    // Initialize performance monitoring only in production
    if (process.env.NODE_ENV === 'production') {
      initPerformanceMonitoring()
    }
  }, [])

  // This component doesn't render anything
  return null
}