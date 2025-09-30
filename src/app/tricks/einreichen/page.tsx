'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/components/layout'
import { TrickForm } from '@/components/organisms/TrickForm'
import { KITrick } from '@/lib/types/types'
import { sendNewTrickNotification } from '@/lib/utils/email-notifications'
import { ArrowLeft, CheckCircle, Clock, Sparkles, Share2, ShieldCheck, BookOpen, HelpCircle, Lightbulb, Compass, AlertTriangle, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { Badge, Button } from '@/components/atoms'
import { createPortal } from 'react-dom'

const submissionHighlights = [
  {
    title: 'Zeitaufwand',
    description: 'Plane 5–10 Minuten ein. Das Formular speichert deine Eingaben lokal bis zum Absenden.',
    icon: Clock
  },
  {
    title: 'Review-Prozess',
    description: 'Das Team prüft jede Einsendung innerhalb von 48 Stunden – inkl. Feedback bei Rückfragen.',
    icon: ShieldCheck
  },
  {
    title: 'Community Impact',
    description: 'Dein Trick wird in der KI-Tricks Bibliothek gefeatured und in unserem Newsletter erwähnt.',
    icon: Share2
  }
]

const faqItems = [
  {
    question: 'Was passiert nach dem Absenden?',
    answer:
      'Wir prüfen deinen Trick redaktionell, testen die Anleitung und melden uns, falls noch Informationen fehlen. Sobald alles passt, wird er veröffentlicht und du erhältst eine Bestätigung.'
  },
  {
    question: 'Kann ich meinen Trick später aktualisieren?',
    answer:
      'Ja! Antworten einfach auf unsere Bestätigungs-Mail oder schick uns eine Nachricht über kontakt@kitricks.de. Wir aktualisieren deinen Beitrag oder erstellen eine neue Version.'
  },
  {
    question: 'Welche Inhalte sind besonders hilfreich?',
    answer:
      'Konkrete Schritte mit Tool-Namen, Prompt-Beispielen und einem kurzen Hinweis, warum der Trick funktioniert. Wenn du Limitierungen kennst, erwähne sie gern.'
  }
]

interface DuplicateDialogProps {
  warning: any
  onClose: () => void
  onSubmitAnyway: () => void
  isSubmitting: boolean
}

const DuplicateDialog = ({ warning, onClose, onSubmitAnyway, isSubmitting }: DuplicateDialogProps) => {
  const isBrowser = typeof window !== 'undefined'

  useEffect(() => {
    if (!warning || !isBrowser) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [warning, isBrowser, onClose])

  if (!warning || !isBrowser) return null

  const similarTricks = Array.isArray(warning.similarTricks)
    ? warning.similarTricks.slice(0, 3)
    : []

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-background border border-border p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Wir haben ähnliche Tricks gefunden
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {warning.message || 'Prüfe kurz, ob dein Beitrag sich deutlich unterscheidet oder ergänze weitere Details.'}
              </p>
            </div>

            {similarTricks.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Ähnliche Beiträge aus der Bibliothek
                </p>
                <div className="space-y-3">
                  {similarTricks.map((similar: any, index: number) => (
                    <div key={`${similar.trick?.id ?? index}`} className="rounded-xl border border-border bg-muted p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {similar.trick?.title ?? 'Ohne Titel'}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                            {similar.trick?.description ?? 'Keine Beschreibung verfügbar.'}
                          </p>
                        </div>
                        <Badge variant="neutral" className="text-[11px]">
                          {similar.overallSimilarity ?? '?'}%
                          <span className="text-neutral-400"> ähnlich</span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-900 dark:text-amber-200">
              <p className="font-semibold">So kannst du deinen Trick abheben:</p>
              <ul className="mt-2 space-y-1.5">
                <li>• Hebe differenzierende Schritte oder Tools hervor.</li>
                <li>• Teile konkrete Prompt-Beispiele oder Nischen-Szenarien.</li>
                <li>• Ergänze, warum dein Ansatz besser funktioniert.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={onClose} className="justify-center">
                Zurück zur Bearbeitung
              </Button>
              <Button
                onClick={onSubmitAnyway}
                disabled={isSubmitting}
                className="justify-center"
              >
                {isSubmitting ? 'Wird eingereicht...' : 'Trotzdem einreichen'}
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function SubmitTrickPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [duplicateWarning, setDuplicateWarning] = useState<any>(null)
  const [lastSubmissionData, setLastSubmissionData] = useState<Partial<KITrick> | null>(null)

  const handleForceDuplicateSubmit = () => {
    if (!lastSubmissionData) return
    handleSubmit(lastSubmissionData, true)
  }

  const handleSubmit = async (trickData: Partial<KITrick>, forceDuplicate = false) => {
    setIsSubmitting(true)
    setError(null)
    setDuplicateWarning(null)
    
    try {
      const response = await fetch('/api/tricks/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          trickData: { ...trickData, forceDuplicate },
          submitterInfo: {} // Can be extended with email/name if needed
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        if (data.error === 'duplicate_detected') {
          setDuplicateWarning(data)
          setLastSubmissionData(trickData)
          setIsSubmitting(false)
          return
        }
        throw new Error(data.message || data.error || 'Fehler beim Einreichen des Tricks')
      }
      
      // Send admin notification (non-blocking)
      try {
        await sendNewTrickNotification({
          title: trickData.title || 'Unbenannter Trick',
          description: trickData.description || 'Keine Beschreibung',
          category: trickData.category || 'productivity'
        })
      } catch (error) {
        // Log error but don't fail the submission
        console.error('Failed to send admin notification:', error)
      }
      
      // Clear saved draft
      localStorage.removeItem('ki-tricks-draft')
      
      // Show success message
      setSuccess(true)
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/tricks')
      }, 3000)
      
    } catch (err) {
      console.error('Fehler beim Einreichen:', err)
      setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Vielen Dank für deine Einreichung!
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Dein KI-Trick wurde erfolgreich eingereicht und wird in Kürze geprüft.
            </p>
            <p className="text-sm text-muted-foreground">
              Du wirst in 3 Sekunden zur Übersicht weitergeleitet...
            </p>
          </div>
          <Link 
            href="/tricks"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Zur Trick-Übersicht
          </Link>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 space-y-6">
          <Link
            href="/tricks"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Übersicht
          </Link>

          <div className="relative overflow-hidden rounded-3xl border border-border bg-white dark:bg-gray-900 p-1 shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_55%)]" />
            <div className="relative grid gap-8 rounded-[calc(1.5rem-4px)] bg-white dark:bg-gray-900 p-8 md:grid-cols-[minmax(0,1.2fr)_minmax(280px,1fr)]">
              <div className="space-y-4">
                <Badge variant="new-subtle" className="uppercase tracking-wide text-xs">
                  <Sparkles className="w-3 h-3" />
                  Community Submission
                </Badge>
                <h1 className="text-3xl font-semibold sm:text-4xl text-neutral-900 dark:text-white">
                  Teile deinen besten KI-Workflow mit der Community
                </h1>
                <p className="text-base text-neutral-600 dark:text-gray-400">
                  Zeig Schritt für Schritt, wie du mit KI Zeit sparst, Ergebnisse verbesserst oder neue Ideen möglich machst. Wir helfen dir beim letzten Feinschliff.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Badge variant="neutral">🔍 Wir prüfen jede Einsendung manuell</Badge>
                  <Badge variant="neutral">🤝 Credits für deinen Beitrag</Badge>
                  <Badge variant="neutral">📬 Feedback innerhalb von 48h</Badge>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-neutral-50 dark:bg-gray-800 p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
                  <Compass className="w-4 h-4" />
                  Einreichungs-Playbook
                </div>
                <ul className="mt-4 space-y-4 text-sm text-neutral-600 dark:text-gray-400">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <span>Kurzer Titel + prägnante Zusammenfassung</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <span>Schritte mit Tool-Hinweisen und Prompt-Beispielen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <span>Optional: Warum funktioniert es? Welche Grenzen gibt es?</span>
                  </li>
                </ul>
                <Link
                  href="/learn"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-foreground transition hover:border-primary hover:text-primary"
                >
                  <BookOpen className="w-4 h-4" />
                  Inspiration & Beispiele ansehen
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {submissionHighlights.map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-xl border border-border bg-white dark:bg-gray-800 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-white">
                  <Icon className="w-4 h-4 text-primary" />
                  {title}
                </div>
                <p className="mt-2 text-sm text-neutral-600 dark:text-gray-400">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <TrickForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        <section className="mt-16 space-y-6">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Häufige Fragen zur Einreichung
            </h2>
          </div>
          <div className="space-y-4">
            {faqItems.map(({ question, answer }) => (
              <details key={question} className="group rounded-xl border border-border bg-white dark:bg-gray-800 p-5 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-neutral-900 dark:text-white">
                  {question}
                  <HelpCircle className="w-4 h-4 text-neutral-500 dark:text-gray-400 transition group-open:rotate-45" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-gray-400">{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <DuplicateDialog
        warning={duplicateWarning}
        onClose={() => setDuplicateWarning(null)}
        onSubmitAnyway={handleForceDuplicateSubmit}
        isSubmitting={isSubmitting}
      />
    </PageContainer>
  )
}