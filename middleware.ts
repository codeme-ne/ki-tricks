import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

// Rate limiter for LLM API endpoints
// 10 requests per minute per IP (prevents abuse while allowing legitimate use)
const rateLimiter = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
  prefix: '@upstash/ratelimit',
})

export async function middleware(request: NextRequest) {
  // Rate limiting for LLM API endpoints
  if (request.nextUrl.pathname.startsWith('/api/optimize-prompt-llm')) {
    // Get IP address for rate limiting
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'anonymous'

    // Check rate limit
    const { success, limit, reset, remaining } = await rateLimiter.limit(ip)

    // Set rate limit headers
    const response = success
      ? NextResponse.next()
      : NextResponse.json(
          {
            error: 'Too many requests',
            message: 'Rate limit exceeded. Please try again later.',
            resetTime: new Date(reset).toISOString()
          },
          { status: 429 }
        )

    response.headers.set('X-RateLimit-Limit', limit.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', reset.toString())

    if (!success) {
      return response
    }
  }

  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check for authentication
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      })
    }

    // Decode the base64 credentials
    const base64Credentials = authHeader.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')

    // Check against environment variable
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword || username !== 'admin' || password !== adminPassword) {
      return new NextResponse('Invalid credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/optimize-prompt-llm/:path*',
  ],
}