# Rate Limiting Setup Guide

## Overview

The LLM Prompt Optimizer API routes are protected by rate limiting to prevent abuse and ensure fair usage. This guide explains how to set up and configure rate limiting using Vercel KV (Upstash Redis).

## Implementation Details

### Middleware Configuration

Rate limiting is implemented in `/middleware.ts` using:
- **Package**: `@upstash/ratelimit` v2.0.6
- **Redis Provider**: `@vercel/kv` v3.0.0
- **Algorithm**: Sliding Window
- **Limit**: 10 requests per minute per IP
- **Protected Routes**: `/api/optimize-prompt-llm/*`

### Key Features

1. **IP-based Rate Limiting**: Each user is identified by their IP address
2. **Sliding Window Algorithm**: Smooth rate limiting without burst allowance resets
3. **Rate Limit Headers**: Returns standard headers for client-side handling
4. **Analytics**: Upstash analytics enabled for monitoring

## Setup Instructions

### Option 1: Vercel KV (Recommended for Vercel Deployments)

1. **Navigate to Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Select your project
   - Go to "Storage" tab

2. **Create KV Database**
   - Click "Create Database"
   - Select "KV" (Key-Value Store)
   - Choose a name (e.g., "ki-tricks-rate-limit")
   - Select region closest to your users
   - Click "Create"

3. **Connect to Project**
   - After creation, click "Connect to Project"
   - Select your Next.js project
   - Vercel automatically adds environment variables:
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`
     - `KV_REST_API_READ_ONLY_TOKEN`
     - `KV_URL`

4. **Local Development**
   - Copy the environment variables to `.env.local`:
   ```bash
   KV_REST_API_URL="https://your-db.upstash.io"
   KV_REST_API_TOKEN="your_token_here"
   ```

### Option 2: Upstash Direct (Alternative)

1. **Create Account**
   - Go to https://console.upstash.com/
   - Sign up or log in

2. **Create Redis Database**
   - Click "Create Database"
   - Name: "ki-tricks-rate-limit"
   - Type: Regional
   - Region: Choose closest to your users
   - Primary Region: Check "Enable TLS"

3. **Get Credentials**
   - After creation, go to "Details" tab
   - Copy:
     - REST API URL → `KV_REST_API_URL`
     - REST API Token → `KV_REST_API_TOKEN`

4. **Add to Environment**
   ```bash
   # .env.local
   KV_REST_API_URL="https://your-db.upstash.io"
   KV_REST_API_TOKEN="AXxxx..."
   ```

## Middleware Code

```typescript
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

  // ... rest of middleware
}
```

## Rate Limit Response Headers

The middleware sets the following headers on all responses to `/api/optimize-prompt-llm/*`:

```
X-RateLimit-Limit: 10          # Maximum requests per window
X-RateLimit-Remaining: 7       # Remaining requests in current window
X-RateLimit-Reset: 1709123456  # Unix timestamp when limit resets
```

## Error Response (429 Too Many Requests)

When rate limit is exceeded:

```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again later.",
  "resetTime": "2025-09-30T10:30:45.123Z"
}
```

## Testing Rate Limiting

### Manual Testing

```bash
# Test with multiple requests
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/optimize-prompt-llm \
    -H "Content-Type: application/json" \
    -d '{"prompt":"Test prompt","rounds":1}' \
    -i | grep -E "(HTTP|X-RateLimit)"
done
```

Expected behavior:
- First 10 requests: `200 OK` with decreasing `X-RateLimit-Remaining`
- Requests 11+: `429 Too Many Requests`

### Automated Testing

Create a test script:

```typescript
// scripts/test-rate-limit.ts
async function testRateLimit() {
  for (let i = 1; i <= 15; i++) {
    const res = await fetch('http://localhost:3000/api/optimize-prompt-llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Test', rounds: 1 })
    });

    console.log(`Request ${i}:`, {
      status: res.status,
      limit: res.headers.get('X-RateLimit-Limit'),
      remaining: res.headers.get('X-RateLimit-Remaining'),
      reset: res.headers.get('X-RateLimit-Reset')
    });

    if (res.status === 429) {
      const json = await res.json();
      console.log('Rate limited:', json);
    }
  }
}

testRateLimit();
```

## Configuration Options

### Adjust Rate Limit

To change the rate limit, modify the `Ratelimit` initialization:

```typescript
// 20 requests per minute
Ratelimit.slidingWindow(20, '1 m')

// 100 requests per hour
Ratelimit.slidingWindow(100, '1 h')

// 5 requests per 30 seconds
Ratelimit.slidingWindow(5, '30 s')
```

### Different Algorithms

```typescript
// Fixed Window: Simple counter, resets at interval boundaries
Ratelimit.fixedWindow(10, '1 m')

// Token Bucket: Allows bursts with refill rate
Ratelimit.tokenBucket(10, '1 m', 5) // 5 tokens refilled per minute

// Sliding Window (Recommended): Smooth rate limiting
Ratelimit.slidingWindow(10, '1 m')
```

## Monitoring

### Upstash Console

- View analytics at https://console.upstash.com/
- Monitor:
  - Request counts
  - Rate limit hits
  - Redis commands/sec
  - Storage usage

### Custom Metrics

Add custom logging in middleware:

```typescript
if (!success) {
  console.log(`Rate limit exceeded for IP ${ip}`, {
    limit,
    remaining,
    reset: new Date(reset).toISOString()
  });
}
```

## Troubleshooting

### "kv is not defined" Error

**Cause**: Missing environment variables

**Solution**: Add `KV_REST_API_URL` and `KV_REST_API_TOKEN` to `.env.local`

### Rate Limiting Not Working

1. **Check environment variables are loaded**:
   ```typescript
   console.log('KV URL:', process.env.KV_REST_API_URL ? 'Set' : 'Missing');
   ```

2. **Verify middleware matcher includes your route**:
   ```typescript
   export const config = {
     matcher: ['/api/optimize-prompt-llm/:path*']
   }
   ```

3. **Test with curl to see headers**:
   ```bash
   curl -i http://localhost:3000/api/optimize-prompt-llm
   ```

### Rate Limit Too Strict

If legitimate users are being rate limited:

1. Increase the limit (e.g., from 10 to 20 requests/min)
2. Change window duration (e.g., from 1 minute to 5 minutes)
3. Consider per-user authentication with higher limits

## Best Practices

1. **Production Limits**: Set stricter limits than development
2. **User Feedback**: Show remaining requests in UI
3. **Retry Logic**: Implement exponential backoff on 429
4. **Monitoring**: Set up alerts for high rate limit violations
5. **Documentation**: Inform users about rate limits in API docs

## Cost Considerations

### Vercel KV Free Tier
- 10,000 commands/day
- 256 MB storage
- Sufficient for small-medium projects

### Upstash Free Tier
- 10,000 commands/day
- 256 MB storage
- Global replication available

## Resources

- [Upstash Rate Limiting Docs](https://upstash.com/docs/redis/features/ratelimiting)
- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Rate Limiting Best Practices](https://blog.upstash.com/ratelimiting-algorithms)