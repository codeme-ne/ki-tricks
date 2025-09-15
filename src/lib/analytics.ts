'use client'

import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

// Web Vitals Tracking
function sendToAnalytics(metric: any) {
  // Sende an Vercel Analytics
  if (typeof window !== 'undefined' && window.va) {
    window.va('track', 'Web Vitals', {
      metric_name: metric.name,
      metric_value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_rating: metric.rating,
    })
  }

  // Sende an Google Analytics (falls vorhanden)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    })
  }

  // Console Log für Development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    })
  }
}

export function initWebVitals() {
  if (typeof window === 'undefined') return

  try {
    getCLS(sendToAnalytics)
    getFID(sendToAnalytics)
    getFCP(sendToAnalytics)
    getLCP(sendToAnalytics)
    getTTFB(sendToAnalytics)
  } catch (error) {
    console.warn('Web Vitals initialization failed:', error)
  }
}

// Performance Observer für zusätzliche Metriken
export function initPerformanceObserver() {
  if (typeof window === 'undefined' || !window.PerformanceObserver) return

  try {
    // Long Tasks Observer
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('Long Task detected:', {
            duration: entry.duration,
            startTime: entry.startTime,
          })
          
          // Track long tasks
          if (window.va) {
            window.va('track', 'Performance', {
              event_name: 'long_task',
              duration: Math.round(entry.duration),
            })
          }
        }
      }
    })

    longTaskObserver.observe({ entryTypes: ['longtask'] })

    // Navigation Timing Observer
    const navigationObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const navigationEntry = entry as PerformanceNavigationTiming
        
        // Track navigation metrics
        if (window.va) {
          window.va('track', 'Navigation Timing', {
            dom_content_loaded: Math.round(navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart),
            load_complete: Math.round(navigationEntry.loadEventEnd - navigationEntry.loadEventStart),
            dns_lookup: Math.round(navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart),
          })
        }
      }
    })

    navigationObserver.observe({ entryTypes: ['navigation'] })

  } catch (error) {
    console.warn('Performance Observer initialization failed:', error)
  }
}

// Resource Loading Performance
export function trackResourcePerformance() {
  if (typeof window === 'undefined') return

  window.addEventListener('load', () => {
    setTimeout(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      
      // Track slow resources
      const slowResources = resources.filter(resource => resource.duration > 1000)
      
      if (slowResources.length > 0 && window.va) {
        window.va('track', 'Performance', {
          event_name: 'slow_resources',
          count: slowResources.length,
          slowest_duration: Math.round(Math.max(...slowResources.map(r => r.duration))),
        })
      }

      // Track resource types
      const resourceTypes = resources.reduce((acc, resource) => {
        const type = resource.initiatorType || 'other'
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      if (window.va) {
        window.va('track', 'Resource Types', resourceTypes)
      }
    }, 1000)
  })
}

// Error Tracking
export function initErrorTracking() {
  if (typeof window === 'undefined') return

  // Global error handler
  window.addEventListener('error', (event) => {
    if (window.va) {
      window.va('track', 'JavaScript Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    }
  })

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    if (window.va) {
      window.va('track', 'Unhandled Promise Rejection', {
        reason: event.reason?.toString() || 'Unknown',
      })
    }
  })
}

// User Interaction Tracking
export function trackUserInteraction(action: string, category: string, label?: string, value?: number) {
  if (typeof window === 'undefined') return

  if (window.va) {
    window.va('track', action, {
      category,
      label,
      value,
    })
  }

  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    })
  }
}

// Initialize all performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return

  // Wait for page to be interactive
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        initWebVitals()
        initPerformanceObserver()
        trackResourcePerformance()
        initErrorTracking()
      }, 100)
    })
  } else {
    setTimeout(() => {
      initWebVitals()
      initPerformanceObserver()
      trackResourcePerformance()
      initErrorTracking()
    }, 100)
  }
}

// Type declarations for global objects
declare global {
  interface Window {
    va?: (event: string, data?: any) => void
    gtag?: (...args: any[]) => void
  }
}