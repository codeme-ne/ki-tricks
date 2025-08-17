'use client'

import { useState, useEffect } from 'react'
import { PageContainer } from '@/components/layout'
import { Button, Badge } from '@/components/atoms'
import { KITrick } from '@/lib/types/types'
import { ArrowLeft, Check, X, Eye, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface ExtendedKITrick extends KITrick {
  status?: 'pending' | 'approved' | 'rejected'
}

export default function PendingTricksPage() {
  const [tricks, setTricks] = useState<ExtendedKITrick[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTrick, setSelectedTrick] = useState<ExtendedKITrick | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)

  // Fetch pending tricks
  const fetchTricks = async () => {
    try {
      const response = await fetch('/api/tricks', {
        headers: {
          'Authorization': `Basic ${btoa(`admin:${prompt('Admin-Passwort:') || ''}`)}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Tricks')
      }
      
      const data = await response.json()
      // Filter only pending tricks
      const pendingTricks = data.filter((t: ExtendedKITrick) => t.status !== 'rejected')
      setTricks(pendingTricks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTricks()
  }, [])

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessing(id)
    
    try {
      const adminPassword = prompt('Admin-Passwort:')
      if (!adminPassword) {
        throw new Error('Passwort erforderlich')
      }

      const response = await fetch('/api/tricks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`admin:${adminPassword}`)}`
        },
        body: JSON.stringify({ id, action })
      })
      
      if (!response.ok) {
        throw new Error('Fehler beim Verarbeiten der Aktion')
      }
      
      // Refresh the list
      await fetchTricks()
      setSelectedTrick(null)
      
      alert(action === 'approve' ? 'Trick wurde freigegeben!' : 'Trick wurde abgelehnt.')
      
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setProcessing(null)
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'productivity': 'Produktivität',
      'content-creation': 'Content-Erstellung',
      'programming': 'Programmierung',
      'design': 'Design',
      'data-analysis': 'Datenanalyse',
      'learning': 'Lernen',
      'business': 'Business',
      'marketing': 'Marketing'
    }
    return labels[category] || category
  }

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      'beginner': 'Anfänger',
      'intermediate': 'Fortgeschritten',
      'advanced': 'Experte'
    }
    return labels[difficulty] || difficulty
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, 'success' | 'warning' | 'danger'> = {
      'beginner': 'success',
      'intermediate': 'warning',
      'advanced': 'danger'
    }
    return colors[difficulty] || 'primary'
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="text-center py-16">
          <p className="text-neutral-600">Lade eingereichte Tricks...</p>
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zum Admin-Bereich
          </Link>
          
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Eingereichte Tricks moderieren
          </h1>
          <p className="text-lg text-neutral-600">
            {tricks.length} {tricks.length === 1 ? 'Trick wartet' : 'Tricks warten'} auf Freigabe
          </p>
        </div>

        {tricks.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
            <Clock className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600 text-lg">Keine Tricks zur Moderation vorhanden</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Trick List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-3">Eingereichte Tricks</h2>
              {tricks.map((trick) => (
                <div
                  key={trick.id}
                  className={`bg-white border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTrick?.id === trick.id 
                      ? 'border-primary-500 shadow-md' 
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                  onClick={() => setSelectedTrick(trick)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-neutral-900 flex-1">
                      {trick.title}
                    </h3>
                    <Badge variant={getDifficultyColor(trick.difficulty)}>
                      {getDifficultyLabel(trick.difficulty)}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
                    {trick.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span>{getCategoryLabel(trick.category)}</span>
                    <span>{trick.timeToImplement}</span>
                    <span className="ml-auto">
                      {new Date(trick.createdAt).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Trick Detail */}
            <div className="lg:sticky lg:top-4">
              {selectedTrick ? (
                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">{selectedTrick.title}</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <h3 className="font-semibold text-sm text-neutral-700 mb-1">Beschreibung</h3>
                      <p className="text-sm text-neutral-600">{selectedTrick.description}</p>
                    </div>

                    {selectedTrick['Warum es funktioniert'] && (
                      <div>
                        <h3 className="font-semibold text-sm text-neutral-700 mb-1">Warum es funktioniert</h3>
                        <p className="text-sm text-neutral-600">{selectedTrick['Warum es funktioniert']}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-sm text-neutral-700 mb-1">Kategorie</h3>
                        <p className="text-sm">{getCategoryLabel(selectedTrick.category)}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-neutral-700 mb-1">Schwierigkeit</h3>
                        <p className="text-sm">{getDifficultyLabel(selectedTrick.difficulty)}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-neutral-700 mb-1">Umsetzungszeit</h3>
                        <p className="text-sm">{selectedTrick.timeToImplement}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-neutral-700 mb-1">Impact</h3>
                        <p className="text-sm capitalize">{selectedTrick.impact}</p>
                      </div>
                    </div>

                    {selectedTrick.tools && selectedTrick.tools.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm text-neutral-700 mb-1">Tools</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedTrick.tools.map((tool, idx) => (
                            <Badge key={idx} variant="neutral">{tool}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTrick.steps && selectedTrick.steps.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm text-neutral-700 mb-2">Schritte</h3>
                        <ol className="space-y-2">
                          {selectedTrick.steps.map((step, idx) => (
                            <li key={idx} className="text-sm text-neutral-600">
                              <span className="font-medium">{idx + 1}.</span> {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {selectedTrick.examples && selectedTrick.examples.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm text-neutral-700 mb-2">Beispiele</h3>
                        <ul className="space-y-2">
                          {selectedTrick.examples.map((example, idx) => (
                            <li key={idx} className="text-sm text-neutral-600">
                              • {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      onClick={() => handleAction(selectedTrick.id, 'approve')}
                      disabled={processing === selectedTrick.id}
                      className="flex-1"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {processing === selectedTrick.id ? 'Verarbeite...' : 'Freigeben'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAction(selectedTrick.id, 'reject')}
                      disabled={processing === selectedTrick.id}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      {processing === selectedTrick.id ? 'Verarbeite...' : 'Ablehnen'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
                  <Eye className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600">
                    Wähle einen Trick aus der Liste, um Details anzuzeigen
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}