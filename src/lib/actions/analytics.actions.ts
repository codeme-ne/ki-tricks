import { TricksService } from '@/lib/services/tricks.service'

export async function trackPageView(slug: string) {
  try {
    // Increment view count in database
    await TricksService.incrementViewCount(slug)
    
    // Get trick ID for analytics
    const trick = await TricksService.getTrickBySlug(slug)
    if (trick) {
      // Track analytics event
      await TricksService.trackEvent(
        trick.id,
        'view',
        generateSessionId(),
        {
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
          timestamp: new Date().toISOString()
        }
      )
    }
  } catch (error) {
    console.error('Error tracking page view:', error)
  }
}

export async function trackLike(trickId: string) {
  try {
    await TricksService.trackEvent(
      trickId,
      'like',
      generateSessionId(),
      {
        timestamp: new Date().toISOString()
      }
    )
  } catch (error) {
    console.error('Error tracking like:', error)
  }
}

export async function trackShare(trickId: string, platform?: string) {
  try {
    await TricksService.trackEvent(
      trickId,
      'share',
      generateSessionId(),
      {
        platform,
        timestamp: new Date().toISOString()
      }
    )
  } catch (error) {
    console.error('Error tracking share:', error)
  }
}

export async function trackImplementation(trickId: string) {
  try {
    await TricksService.trackEvent(
      trickId,
      'implement',
      generateSessionId(),
      {
        timestamp: new Date().toISOString()
      }
    )
  } catch (error) {
    console.error('Error tracking implementation:', error)
  }
}

// Generate or get session ID
function generateSessionId(): string {
  if (typeof window === 'undefined') {
    return `server-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  let sessionId = sessionStorage.getItem('ki-tricks-session')
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('ki-tricks-session', sessionId)
  }
  return sessionId
}