'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/components/layout'
import { TrickForm } from '@/components/organisms/TrickForm'
import { KITrick } from '@/lib/types/types'
import { sendNewTrickNotification } from '@/lib/utils/email-notifications'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function SubmitTrickPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [duplicateWarning, setDuplicateWarning] = useState<any>(null)
  const [lastSubmissionData, setLastSubmissionData] = useState<Partial<KITrick> | null>(null)

  const handleSubmit = async (trickData: Partial<KITrick>, forceDuplicate = false) => {
    setIsSubmitting(true)
    setError(null)
    setDuplicateWarning(null)
    
    try {
      const response = await fetch('/api/tricks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...trickData, forceDuplicate }),
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
          category: trickData.category || 'productivity',
          difficulty: trickData.difficulty || 'beginner'
        })
      } catch (error) {
        // Log error but don't fail the submission
        console.error('Failed to send admin notification:', error)
      }
      
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
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">
              Vielen Dank für deine Einreichung!
            </h1>
            <p className="text-lg text-neutral-600 mb-2">
              Dein KI-Trick wurde erfolgreich eingereicht und wird in Kürze geprüft.
            </p>
            <p className="text-sm text-neutral-500">
              Du wirst in 3 Sekunden zur Übersicht weitergeleitet...
            </p>
          </div>
          <Link 
            href="/tricks"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Zur Trick-Übersicht
          </Link>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/tricks" 
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-100 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Übersicht
          </Link>
          
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">
            KI-Trick einreichen
          </h1>
          <p className="text-lg text-neutral-400">
            Teile deinen besten KI-Trick mit der Community! Deine Einreichung wird 
            geprüft und bei Freigabe auf der Plattform veröffentlicht.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-blue-300 mb-2">
            Tipps für eine erfolgreiche Einreichung:
          </h3>
          <ul className="text-sm text-blue-300 space-y-1">
            <li>• Beschreibe deinen Trick klar und verständlich</li>
            <li>• Füge konkrete Schritte hinzu, die andere nachvollziehen können</li>
            <li>• Gib realistische Zeitschätzungen an</li>
            <li>• Beispiele machen deinen Trick greifbarer</li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {duplicateWarning && (
          <div className="bg-amber-900/20 border border-amber-800 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-amber-300">
                  Mögliches Duplikat erkannt
                </h3>
                <div className="mt-2 text-sm text-amber-300">
                  <p>{duplicateWarning.message}</p>
                </div>

                {duplicateWarning.similarTricks && duplicateWarning.similarTricks.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-amber-300 mb-2">Ähnliche Tricks:</h4>
                    <div className="space-y-2">
                      {duplicateWarning.similarTricks.slice(0, 3).map((similar: any, index: number) => (
                        <div key={index} className="bg-amber-800/30 rounded p-3">
                          <p className="font-medium text-sm text-amber-200">{similar.trick.title}</p>
                          <p className="text-xs text-amber-300 mt-1">{similar.trick.description.substring(0, 100)}...</p>
                          <p className="text-xs text-amber-400 mt-2">
                            Ähnlichkeit: {similar.overallSimilarity}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setDuplicateWarning(null)}
                    className="text-sm bg-amber-800/30 text-amber-300 px-3 py-2 rounded hover:bg-amber-800/50 transition-colors"
                  >
                    Überarbeiten
                  </button>
                  <button
                    onClick={() => lastSubmissionData && handleSubmit(lastSubmissionData, true)}
                    disabled={isSubmitting}
                    className="text-sm bg-amber-700/30 text-amber-200 px-3 py-2 rounded hover:bg-amber-700/50 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Wird eingereicht...' : 'Trotzdem einreichen'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <TrickForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </PageContainer>
  )
}