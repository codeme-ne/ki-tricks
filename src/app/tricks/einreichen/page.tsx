'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/components/layout'
import { TrickForm } from '@/components/organisms/TrickForm'
import { KITrick } from '@/lib/types/types'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function SubmitTrickPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (trickData: Partial<KITrick>) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/tricks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trickData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Einreichen des Tricks')
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
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Übersicht
          </Link>
          
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            KI-Trick einreichen
          </h1>
          <p className="text-lg text-neutral-600">
            Teile deinen besten KI-Trick mit der Community! Deine Einreichung wird 
            geprüft und bei Freigabe auf der Plattform veröffentlicht.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">
            Tipps für eine erfolgreiche Einreichung:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Beschreibe deinen Trick klar und verständlich</li>
            <li>• Füge konkrete Schritte hinzu, die andere nachvollziehen können</li>
            <li>• Gib realistische Zeitschätzungen an</li>
            <li>• Beispiele machen deinen Trick greifbarer</li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
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