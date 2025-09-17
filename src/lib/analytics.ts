'use client'

import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

// Web Vitals Tracking
function sendToAnalytics(metric: any) {
  // Sende an Vercel Analytics
  if (typeof window !== 'undefined' && window.va) {
    window.va('event', {
      name: 'web-vital',
      data: {
        metric_name: metric.name,
        metric_value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        metric_id: metric.id,
        metric_rating: metric.rating,
      }
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
    onCLS(sendToAnalytics)
    onINP(sendToAnalytics)
    onFCP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
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
            window.va('event', {
              name: 'long-task',
              data: {
                duration: Math.round(entry.duration),
              }
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
          window.va('event', {
            name: 'navigation-timing',
            data: {
              dom_content_loaded: Math.round(navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart),
              load_complete: Math.round(navigationEntry.loadEventEnd - navigationEntry.loadEventStart),
              dns_lookup: Math.round(navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart),
            }
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
        window.va('event', {
          name: 'slow-resources',
          data: {
            count: slowResources.length,
            slowest_duration: Math.round(Math.max(...slowResources.map(r => r.duration))),
          }
        })
      }

      // Track resource types
      const resourceTypes = resources.reduce((acc, resource) => {
        const type = resource.initiatorType || 'other'
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      if (window.va) {
        window.va('event', {
          name: 'resource-types',
          data: resourceTypes
        })
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
      window.va('event', {
        name: 'javascript-error',
        data: {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        }
      })
    }
  })

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    if (window.va) {
      window.va('event', {
        name: 'promise-rejection',
        data: {
          reason: event.reason?.toString() || 'Unknown',
        }
      })
    }
  })
}

// User Interaction Tracking
export function trackUserInteraction(action: string, category: string, label?: string, value?: number) {
  if (typeof window === 'undefined') return

  if (window.va) {
    window.va('event', {
      name: action,
      data: {
        category,
        label,
        value,
      }
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

// MONETIZATION-FOCUSED TRACKING

// Email Signup Tracking
export function trackEmailSignup(source: string, leadMagnet?: string) {
  trackUserInteraction('email_signup', 'Lead Generation', source, 1)

  if (window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: 'AW-CONVERSION_ID/EMAIL_SIGNUP', // Replace with actual conversion ID
      event_category: 'lead_generation',
      event_label: source,
      value: 1
    })
  }
}

// Affiliate Link Clicks
export function trackAffiliateClick(tool: string, position: string, trickId?: string) {
  trackUserInteraction('affiliate_click', 'Monetization', `${tool}_${position}`, 1)

  if (window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'affiliate',
      event_label: `${tool}_${position}`,
      custom_parameters: {
        trick_id: trickId,
        tool: tool,
        position: position
      }
    })
  }
}

// Content Engagement Tracking
export function trackTrickView(trickId: string, category: string, timeOnPage?: number) {
  trackUserInteraction('trick_view', 'Content', `${category}_${trickId}`, timeOnPage)

  if (window.gtag) {
    window.gtag('event', 'page_view', {
      event_category: 'content',
      custom_parameters: {
        trick_id: trickId,
        category: category,
        time_on_page: timeOnPage
      }
    })
  }
}

// Search Behavior
export function trackSearch(query: string, resultsCount: number, filterUsed?: string[]) {
  trackUserInteraction('search', 'User Behavior', query, resultsCount)

  if (window.gtag) {
    window.gtag('event', 'search', {
      search_term: query,
      event_category: 'user_behavior',
      custom_parameters: {
        results_count: resultsCount,
        filters_used: filterUsed?.join(',') || 'none'
      }
    })
  }
}

// Category Interest Tracking
export function trackCategoryInterest(category: string, action: 'filter' | 'click' | 'view') {
  trackUserInteraction(`category_${action}`, 'User Interest', category, 1)

  if (window.gtag) {
    window.gtag('event', `category_${action}`, {
      event_category: 'user_interest',
      event_label: category,
      custom_parameters: {
        category: category,
        action: action
      }
    })
  }
}

// Tool Interest Tracking (for future affiliate targeting)
export function trackToolInterest(tool: string, context: 'trick_view' | 'search' | 'filter') {
  trackUserInteraction('tool_interest', 'User Interest', `${tool}_${context}`, 1)

  if (window.gtag) {
    window.gtag('event', 'tool_interest', {
      event_category: 'user_interest',
      event_label: tool,
      custom_parameters: {
        tool: tool,
        context: context
      }
    })
  }
}

// Newsletter Engagement
export function trackNewsletterInteraction(action: 'signup' | 'confirm' | 'unsubscribe', source?: string) {
  trackUserInteraction(`newsletter_${action}`, 'Newsletter', source || 'unknown', 1)
}

// Future Membership/Payment Tracking
export function trackMembershipIntent(action: 'signup_click' | 'pricing_view' | 'trial_start') {
  trackUserInteraction(`membership_${action}`, 'Monetization', action, 1)

  if (window.gtag) {
    window.gtag('event', `membership_${action}`, {
      event_category: 'monetization',
      event_label: action,
      custom_parameters: {
        action: action,
        timestamp: Date.now()
      }
    })
  }
}

// High-Value User Actions (potential premium users)
export function trackHighValueAction(action: 'multiple_tricks_viewed' | 'search_power_user' | 'return_visitor') {
  trackUserInteraction('high_value_action', 'User Behavior', action, 1)

  if (window.gtag) {
    window.gtag('event', 'high_value_user', {
      event_category: 'user_segmentation',
      event_label: action,
      custom_parameters: {
        action: action,
        session_id: sessionStorage.getItem('session_id') || 'unknown'
      }
    })
  }
}

// Ad Revenue Optimization Tracking
export function trackAdViewability(adUnit: string, position: string, viewable: boolean) {
  if (window.gtag) {
    window.gtag('event', 'ad_viewability', {
      event_category: 'advertising',
      event_label: `${adUnit}_${position}`,
      custom_parameters: {
        ad_unit: adUnit,
        position: position,
        viewable: viewable
      }
    })
  }
}

// Initialize Enhanced Analytics for Monetization
export function initMonetizationTracking() {
  if (typeof window === 'undefined') return

  // Track session duration for high-value users
  const sessionStart = Date.now()
  const sessionId = Math.random().toString(36).substring(2, 15)
  sessionStorage.setItem('session_id', sessionId)

  // Track when user becomes a power user (views multiple tricks)
  let tricksViewed = 0
  const trackPowerUser = () => {
    tricksViewed++
    if (tricksViewed >= 3) {
      trackHighValueAction('multiple_tricks_viewed')
    }
  }

  // Expose power user tracking globally
  window.trackPowerUser = trackPowerUser

  // Track session end
  window.addEventListener('beforeunload', () => {
    const sessionDuration = Date.now() - sessionStart
    trackUserInteraction('session_end', 'User Behavior', 'session_duration', Math.round(sessionDuration / 1000))
  })

  // Track scroll depth for content engagement
  let maxScrollDepth = 0
  window.addEventListener('scroll', () => {
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth
      if (maxScrollDepth >= 75) {
        trackUserInteraction('deep_scroll', 'Content Engagement', 'scroll_75_percent', maxScrollDepth)
      }
    }
  })
}

// Type declarations for global objects
declare global {
  interface Window {
    va?: (event: string, data?: any) => void
    gtag?: (...args: any[]) => void
    trackPowerUser?: () => void
  }
}