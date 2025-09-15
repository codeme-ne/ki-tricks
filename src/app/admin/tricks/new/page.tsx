'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/components/layout'
import { TrickForm } from '@/components/organisms/TrickForm'
import { KITrick } from '@/lib/types/types'
import { Button } from '@/components/atoms'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewTrickPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (trickData: Partial<KITrick>) => {
    setIsSubmitting(true)
    
    try {
      // Hier würde normalerweise die API-Integration stattfinden
      // Für den Moment speichern wir in localStorage
      const existingTricks = JSON.parse(localStorage.getItem('customTricks') || '[]')
      const newTrick: KITrick = {
        id: `custom-${Date.now()}`,
        title: trickData.title || '',
        description: trickData.description || '',
        category: trickData.category || 'productivity',
        tools: trickData.tools || [],
        steps: trickData.steps || null,
        examples: trickData.examples || null,
        slug: trickData.title?.toLowerCase()
          .replace(/[äöü]/g, (match) => {
            const map: { [key: string]: string } = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue' }
            return map[match] || match
          })
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') || '',
        why_it_works: trickData.why_it_works || 'Dieser Trick basiert auf bewährten Prinzipien und ist praxiserprobt.',
        status: trickData.status || 'draft',
        quality_score: trickData.quality_score || null,
        view_count: trickData.view_count || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: trickData.published_at || null
      }
      
      existingTricks.push(newTrick)
      localStorage.setItem('customTricks', JSON.stringify(existingTricks))
      
      // Erfolgs-Feedback und Weiterleitung
      alert('Trick erfolgreich gespeichert!')
      router.push('/tricks')
    } catch (error) {
      console.error('Fehler beim Speichern:', error)
      alert('Fehler beim Speichern des Tricks')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/tricks" 
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-100 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Übersicht
          </Link>
          
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">
            Neuen KI Trick erstellen
          </h1>
          <p className="text-lg text-neutral-400">
            Füge einen neuen Trick zur Sammlung hinzu
          </p>
        </div>

        <TrickForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </PageContainer>
  )
}