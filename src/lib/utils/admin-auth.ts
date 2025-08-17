'use client'

interface AdminSession {
  token: string
  expiresAt: number
}

const SESSION_KEY = 'ki-tricks-admin-session'
const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes

export class AdminAuth {
  static generateToken(password: string): string {
    return btoa(`admin:${password}:${Date.now()}`)
  }

  static saveSession(password: string): void {
    const token = this.generateToken(password)
    const session: AdminSession = {
      token,
      expiresAt: Date.now() + SESSION_DURATION
    }
    
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
    } catch (error) {
      console.warn('Failed to save admin session:', error)
    }
  }

  static getValidSession(): string | null {
    try {
      const sessionData = sessionStorage.getItem(SESSION_KEY)
      if (!sessionData) return null

      const session: AdminSession = JSON.parse(sessionData)
      
      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        this.clearSession()
        return null
      }

      return session.token
    } catch (error) {
      console.warn('Failed to get admin session:', error)
      this.clearSession()
      return null
    }
  }

  static clearSession(): void {
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch (error) {
      console.warn('Failed to clear admin session:', error)
    }
  }

  static isSessionValid(): boolean {
    return this.getValidSession() !== null
  }

  static async authenticateWithPrompt(): Promise<string | null> {
    const existingToken = this.getValidSession()
    if (existingToken) {
      return existingToken
    }

    const password = prompt('Admin-Passwort:')
    if (!password) {
      return null
    }

    // Generate authorization header
    const authHeader = btoa(`admin:${password}`)
    
    // Test the password by making a request
    try {
      const response = await fetch('/api/tricks', {
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      })

      if (response.ok) {
        // Save session if authentication successful
        this.saveSession(password)
        return authHeader
      } else {
        alert('Falsches Passwort')
        return null
      }
    } catch (error) {
      console.error('Authentication error:', error)
      alert('Authentifizierungsfehler')
      return null
    }
  }

  static extendSession(): void {
    try {
      const sessionData = sessionStorage.getItem(SESSION_KEY)
      if (!sessionData) return

      const session: AdminSession = JSON.parse(sessionData)
      session.expiresAt = Date.now() + SESSION_DURATION
      
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
    } catch (error) {
      console.warn('Failed to extend admin session:', error)
    }
  }
}