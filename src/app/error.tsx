'use client'

import { useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Etwas ist schiefgelaufen!
          </h1>
          <p className="text-neutral-600 mb-8">
            Es ist ein unerwarteter Fehler aufgetreten.
          </p>
          <button
            onClick={reset}
            className="btn-primary"
          >
            Erneut versuchen
          </button>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}