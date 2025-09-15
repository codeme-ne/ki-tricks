'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/atoms'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error)
  }, [error])

  const isNetworkError = error.message.includes('fetch') || error.message.includes('network')
  const isSupabaseError = error.message.includes('supabase') || error.message.includes('database')

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-destructive/10 rounded-full">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </div>
          
          <div className="space-y-2 content-spacing">
            <h1 className="text-heading-2">Etwas ist schiefgelaufen</h1>
            <p className="text-body text-muted-foreground">
              {isNetworkError && "Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung."}
              {isSupabaseError && "Datenbankfehler. Wir arbeiten an einer Lösung."}
              {!isNetworkError && !isSupabaseError && "Ein unerwarteter Fehler ist aufgetreten."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={reset}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Erneut versuchen
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Zur Startseite
              </Link>
            </Button>
          </div>

          {error.digest && (
            <details className="text-left">
              <summary className="text-caption cursor-pointer hover:text-foreground">
                Technische Details
              </summary>
              <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto">
                Error ID: {error.digest}
                {'\n'}Message: {error.message}
              </pre>
            </details>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}