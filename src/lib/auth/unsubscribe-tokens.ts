import crypto from 'crypto'

const TOKEN_VALIDITY_DAYS = 30
const TOKEN_SEPARATOR = '|'

/**
 * Generate a secure unsubscribe token for a newsletter subscriber
 * Token structure: base64url(email|timestamp|subscriberId|HMAC-signature)
 *
 * @param email - Subscriber email address
 * @param subscriberId - Supabase subscriber UUID
 * @returns Secure token string
 */
export function generateUnsubscribeToken(email: string, subscriberId: string): string {
  const secret = process.env.NEWSLETTER_SECRET

  if (!secret) {
    throw new Error('NEWSLETTER_SECRET environment variable is not set')
  }

  if (secret.length < 32) {
    throw new Error('NEWSLETTER_SECRET must be at least 32 characters long')
  }

  const timestamp = Date.now().toString()
  const payload = `${email}${TOKEN_SEPARATOR}${timestamp}${TOKEN_SEPARATOR}${subscriberId}`

  // Create HMAC signature
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64url')

  // Combine payload and signature
  const token = `${payload}${TOKEN_SEPARATOR}${signature}`

  // Encode as base64url for URL safety
  return Buffer.from(token).toString('base64url')
}

/**
 * Verify and decode an unsubscribe token
 *
 * @param token - Token to verify
 * @returns Object with email and subscriberId
 * @throws Error if token is invalid or expired
 */
export function verifyUnsubscribeToken(token: string): {
  email: string
  subscriberId: string
} {
  const secret = process.env.NEWSLETTER_SECRET

  if (!secret) {
    throw new Error('NEWSLETTER_SECRET environment variable is not set')
  }

  try {
    // Decode from base64url
    const decoded = Buffer.from(token, 'base64url').toString('utf-8')
    const parts = decoded.split(TOKEN_SEPARATOR)

    if (parts.length !== 4) {
      throw new Error('Invalid token format')
    }

    const [email, timestamp, subscriberId, signature] = parts

    // Verify HMAC signature
    const payload = `${email}${TOKEN_SEPARATOR}${timestamp}${TOKEN_SEPARATOR}${subscriberId}`
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('base64url')

    if (signature !== expectedSignature) {
      throw new Error('Invalid token signature')
    }

    // Check token expiration
    const tokenTimestamp = parseInt(timestamp, 10)
    const now = Date.now()
    const maxAge = TOKEN_VALIDITY_DAYS * 24 * 60 * 60 * 1000 // 30 days in ms

    if (now - tokenTimestamp > maxAge) {
      throw new Error('Token has expired')
    }

    return { email, subscriberId }

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Token verification failed: ${error.message}`)
    }
    throw new Error('Token verification failed: Unknown error')
  }
}

/**
 * Get token validity in human-readable format
 */
export function getTokenValidityDays(): number {
  return TOKEN_VALIDITY_DAYS
}