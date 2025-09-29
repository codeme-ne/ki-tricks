'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { BaseCard } from '@/components/atoms'
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [token, setToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      setError('Kein gültiger Abmelde-Link. Bitte verwende den Link aus deiner E-Mail.')
    }
  }, [searchParams])

  const handleUnsubscribe = async () => {
    if (!token) {
      setError('Kein gültiger Abmelde-Link.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Fehler beim Abmelden')
      }

      setIsSuccess(true)

      // Redirect nach 5 Sekunden
      setTimeout(() => {
        router.push('/')
      }, 5000)

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="container max-w-2xl">
            <BaseCard className="text-center p-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>

              <h1 className="text-2xl font-bold text-foreground mb-4">
                Erfolgreich abgemeldet
              </h1>

              <p className="text-muted-foreground mb-6">
                Du wurdest erfolgreich vom Newsletter abgemeldet. Du erhältst keine weiteren E-Mails von uns.
              </p>

              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground">
                  Du wirst in 5 Sekunden zur Startseite weitergeleitet...
                </p>
              </div>

              <Link href="/">
                <Button variant="primary" size="lg">
                  Zur Startseite
                </Button>
              </Link>

              <p className="text-sm text-muted-foreground mt-6">
                Hast du dich versehentlich abgemeldet?{' '}
                <Link href="/#newsletter" className="text-primary hover:underline">
                  Hier erneut anmelden
                </Link>
              </p>
            </BaseCard>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error && !token) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="container max-w-2xl">
            <BaseCard className="text-center p-8">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>

              <h1 className="text-2xl font-bold text-foreground mb-4">
                Ungültiger Abmelde-Link
              </h1>

              <p className="text-muted-foreground mb-6">
                {error}
              </p>

              <Link href="/">
                <Button variant="primary" size="lg">
                  Zur Startseite
                </Button>
              </Link>
            </BaseCard>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-16">
        <div className="container max-w-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Vom Newsletter abmelden
            </h1>
            <p className="text-muted-foreground">
              Schade, dass du gehst. Wir würden uns freuen, dich wieder zu sehen!
            </p>
          </div>

          <BaseCard className="p-8">
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground text-center">
                  Du bist dabei, dich vom Newsletter abzumelden.
                  <br />
                  Möchtest du wirklich fortfahren?
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <Button
                onClick={handleUnsubscribe}
                disabled={isLoading || !token}
                variant="primary"
                size="lg"
                className="w-full"
                icon={isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : undefined}
              >
                {isLoading ? 'Wird abgemeldet...' : 'Jetzt abmelden'}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Möchtest du doch bleiben?{' '}
                  <Link href="/tricks" className="text-primary hover:underline">
                    Zu den Tricks
                  </Link>
                </p>
              </div>
            </div>
          </BaseCard>

          <div className="mt-8">
            <BaseCard className="bg-muted/50 p-6">
              <h3 className="font-semibold text-foreground mb-3">
                Was du verpasst:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Wöchentliche neue KI-Tricks direkt in dein Postfach</li>
                <li>• Exklusive Tipps nur für Newsletter-Abonnenten</li>
                <li>• Früher Zugang zu neuen Features</li>
                <li>• Keine Werbung, 100% Mehrwert</li>
              </ul>
            </BaseCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  )
}