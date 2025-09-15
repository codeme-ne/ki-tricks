'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageContainer } from '@/components/layout'
import { Button, Badge } from '@/components/atoms'
import { KITrick } from '@/lib/types/types'
import { AdminAuth } from '@/lib/utils/admin-auth'
import { calculateQualityScore, getQualityAssessment } from '@/lib/utils/quality-scoring'
import { ArrowLeft, Check, X, Eye, Clock, AlertCircle, LogOut, Star } from 'lucide-react'
import Link from 'next/link'

interface ExtendedKITrick extends Omit<KITrick, 'status'> {
  status?: 'pending' | 'approved' | 'rejected'
}

export default function PendingTricksPage() {
  const [tricks, setTricks] = useState<ExtendedKITrick[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTrick, setSelectedTrick] = useState<ExtendedKITrick | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)
  const [selectedTricks, setSelectedTricks] = useState<Set<string>>(new Set())
  const [bulkProcessing, setBulkProcessing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending'>('pending')

  // Fetch pending tricks
  const fetchTricks = useCallback(async () => {
    try {
      const authToken = await AdminAuth.authenticateWithPrompt()
      if (!authToken) {
        setError('Authentifizierung fehlgeschlagen')
        setLoading(false)
        return
      }

      const response = await fetch('/api/tricks', {
        headers: {
          'Authorization': `Basic ${authToken}`
        }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          AdminAuth.clearSession()
          setError('Session abgelaufen. Bitte neu anmelden.')
        } else {
          throw new Error('Fehler beim Laden der Tricks')
        }
        return
      }
      
      // Extend session on successful request
      AdminAuth.extendSession()
      
      const data = await response.json()
      // Filter tricks based on status filter
      const filteredTricks = statusFilter === 'all' 
        ? data 
        : data.filter((t: ExtendedKITrick) => 
            statusFilter === 'pending' ? t.status !== 'rejected' : t.status === statusFilter
          )
      setTricks(filteredTricks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchTricks()
  }, [fetchTricks])

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessing(id)
    
    try {
      const authToken = AdminAuth.getValidSession()
      if (!authToken) {
        setError('Session abgelaufen. Bitte Seite neu laden.')
        setProcessing(null)
        return
      }

      const response = await fetch('/api/tricks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authToken}`
        },
        body: JSON.stringify({ id, action })
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          AdminAuth.clearSession()
          setError('Session abgelaufen. Bitte neu anmelden.')
        } else {
          throw new Error('Fehler beim Verarbeiten der Aktion')
        }
        return
      }
      
      // Extend session on successful request
      AdminAuth.extendSession()
      
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

  const handleLogout = () => {
    AdminAuth.clearSession()
    setError('Abgemeldet. Bitte Seite neu laden.')
  }

  // Bulk operations
  const handleSelectTrick = (id: string, selected: boolean) => {
    const newSelectedTricks = new Set(selectedTricks)
    if (selected) {
      newSelectedTricks.add(id)
    } else {
      newSelectedTricks.delete(id)
    }
    setSelectedTricks(newSelectedTricks)
  }

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allIds = new Set(filteredAndSearchedTricks.map(t => t.id))
      setSelectedTricks(allIds)
    } else {
      setSelectedTricks(new Set())
    }
  }

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedTricks.size === 0) {
      alert('Bitte wähle mindestens einen Trick aus.')
      return
    }

    const confirmMessage = `Möchtest du wirklich ${selectedTricks.size} Tricks ${action === 'approve' ? 'freigeben' : 'ablehnen'}?`
    if (!confirm(confirmMessage)) {
      return
    }

    setBulkProcessing(true)
    
    try {
      const authToken = AdminAuth.getValidSession()
      if (!authToken) {
        setError('Session abgelaufen. Bitte neu anmelden.')
        setBulkProcessing(false)
        return
      }

      const response = await fetch('/api/tricks/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authToken}`
        },
        body: JSON.stringify({ 
          ids: Array.from(selectedTricks), 
          action 
        })
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          AdminAuth.clearSession()
          setError('Session abgelaufen. Bitte neu anmelden.')
        } else {
          throw new Error('Fehler bei der Bulk-Operation')
        }
        return
      }
      
      const result = await response.json()
      
      // Extend session on successful request
      AdminAuth.extendSession()
      
      // Refresh the list
      await fetchTricks()
      setSelectedTricks(new Set())
      setSelectedTrick(null)
      
      alert(`Erfolgreich: ${result.stats.successful} Tricks ${action === 'approve' ? 'freigegeben' : 'abgelehnt'}${result.stats.failed > 0 ? `. ${result.stats.failed} Tricks konnten nicht verarbeitet werden.` : '.'}`)
      
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setBulkProcessing(false)
    }
  }

  // Search and filter functionality
  const filteredAndSearchedTricks = tricks.filter(trick => {
    const matchesSearch = searchQuery === '' || 
      trick.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trick.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch
  })

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

  // Difficulty removed from schema/UI

  if (loading) {
    return (
      <PageContainer>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Lade eingereichte Tricks...</p>
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
      <div className="flex justify-between items-start mb-4">
            <Link 
              href="/admin" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück zum Admin-Bereich
            </Link>
            
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Abmelden
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Eingereichte Tricks moderieren
          </h1>
          <p className="text-lg text-muted-foreground">
            {filteredAndSearchedTricks.length} {filteredAndSearchedTricks.length === 1 ? 'Trick' : 'Tricks'} 
            {searchQuery && ` (gefiltert nach "${searchQuery}")`}
          </p>
        </div>

        {/* Search and Filter Controls */}
  <div className="bg-card border border-border rounded-lg p-4 mb-6 shadow-sm">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-neutral-300 mb-1">
                Suchen
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-background text-foreground border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                placeholder="Titel oder Beschreibung..."
              />
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-neutral-300 mb-1">
                Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending')}
                className="w-full px-3 py-2 bg-background text-foreground border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
              >
                <option value="pending">Wartend</option>
                <option value="all">Alle</option>
              </select>
            </div>

            {/* Bulk Actions */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Bulk-Aktionen ({selectedTricks.size} ausgewählt)
              </label>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={() => handleBulkAction('approve')}
                  disabled={selectedTricks.size === 0 || bulkProcessing}
                  className="text-sm"
                >
                  <Check className="w-4 h-4 mr-1" />
                  {bulkProcessing ? 'Verarbeitung...' : 'Freigeben'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkAction('reject')}
                  disabled={selectedTricks.size === 0 || bulkProcessing}
                  className="text-sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  Ablehnen
                </Button>
              </div>
            </div>
          </div>
        </div>

        {filteredAndSearchedTricks.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center shadow-sm">
            <Clock className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-400 text-lg">
              {searchQuery ? 'Keine Tricks entsprechen der Suche' : 'Keine Tricks zur Moderation vorhanden'}
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Trick List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Eingereichte Tricks</h2>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="selectAll"
                    checked={filteredAndSearchedTricks.length > 0 && selectedTricks.size === filteredAndSearchedTricks.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <label htmlFor="selectAll" className="text-sm text-muted-foreground">
                    Alle auswählen
                  </label>
                </div>
              </div>
              {filteredAndSearchedTricks.map((trick) => (
                <div
                  key={trick.id}
                  className={`bg-card border rounded-lg p-4 transition-all ${
                    selectedTrick?.id === trick.id 
                      ? 'border-primary shadow-sm' 
                      : 'border-border hover:border-muted-foreground/30'
                  } ${selectedTricks.has(trick.id) ? 'ring-2 ring-primary/20' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedTricks.has(trick.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleSelectTrick(trick.id, e.target.checked)
                      }}
                      className="mt-1 rounded border-input text-primary focus:ring-primary"
                    />
                    
                    {/* Trick Content */}
                    <div 
                      className="flex-1 cursor-pointer" 
                      onClick={() => setSelectedTrick(trick)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-foreground flex-1">
                          {trick.title}
                        </h3>
                        <div className="flex gap-2">
                          {trick.status === 'rejected' && (
                            <Badge variant="danger">Abgelehnt</Badge>
                          )}
                          {/* Difficulty removed */}
                          {(() => {
                            const qualityScore = calculateQualityScore(trick as Partial<KITrick>)
                            const assessment = getQualityAssessment(qualityScore)
                            return (
                              <Badge 
                                variant={
                                  assessment.color === 'green' ? 'success' :
                                  assessment.color === 'blue' ? 'primary' :
                                  assessment.color === 'yellow' ? 'warning' :
                                  'danger'
                                }
                                className="text-xs"
                              >
                                <Star className="w-3 h-3 mr-1" />
                                {qualityScore.total}
                              </Badge>
                            )
                          })()}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {trick.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{getCategoryLabel(trick.category)}</span>
                        {/* Time to implement removed */}
                        <span className="ml-auto">
                          {new Date(trick.created_at).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trick Detail */}
            <div className="lg:sticky lg:top-4">
              {selectedTrick ? (
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold">{selectedTrick.title}</h2>
                    {(() => {
                      const qualityScore = calculateQualityScore(selectedTrick as Partial<KITrick>)
                      const assessment = getQualityAssessment(qualityScore)
                      return (
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge 
                              variant={
                                assessment.color === 'green' ? 'success' :
                                assessment.color === 'blue' ? 'primary' :
                                assessment.color === 'yellow' ? 'warning' :
                                'danger'
                              }
                            >
                              {assessment.label}
                            </Badge>
                            <span className="text-lg font-bold text-foreground">
                              {qualityScore.total}/100
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{assessment.description}</p>
                        </div>
                      )
                    })()}
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground mb-1">Beschreibung</h3>
                      <p className="text-sm text-muted-foreground">{selectedTrick.description}</p>
                    </div>

                    {selectedTrick.why_it_works && (
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-1">Warum es funktioniert</h3>
                        <p className="text-sm text-muted-foreground">{selectedTrick.why_it_works}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-1">Kategorie</h3>
                        <p className="text-sm">{getCategoryLabel(selectedTrick.category)}</p>
                      </div>
                      {/* Difficulty, time to implement, and impact removed */}
                    </div>

                    {selectedTrick.tools && selectedTrick.tools.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-1">Tools</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedTrick.tools.map((tool, idx) => (
                            <Badge key={idx} variant="neutral">{tool}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTrick.steps && selectedTrick.steps.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-2">Schritte</h3>
                        <ol className="space-y-2">
                          {selectedTrick.steps.map((step, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground">
                              <span className="font-medium">{idx + 1}.</span> {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {selectedTrick.examples && selectedTrick.examples.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-2">Beispiele</h3>
                        <ul className="space-y-2">
                          {selectedTrick.examples.map((example, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground">
                              • {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Quality Score Breakdown */}
                    {(() => {
                      const qualityScore = calculateQualityScore(selectedTrick as Partial<KITrick>)
                      return (
                        <div>
                          <h3 className="font-semibold text-sm text-muted-foreground mb-2">Qualitätsbewertung</h3>
                          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex justify-between">
                                <span>Textlänge:</span>
                                <span className="font-medium">{qualityScore.breakdown.textLength}/20</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Schritte:</span>
                                <span className="font-medium">{qualityScore.breakdown.hasSteps}/25</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Beispiele:</span>
                                <span className="font-medium">{qualityScore.breakdown.hasExamples}/20</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tools:</span>
                                <span className="font-medium">{qualityScore.breakdown.toolsSpecified}/10</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Format:</span>
                                <span className="font-medium">{qualityScore.breakdown.formatting}/10</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Qualität:</span>
                                <span className="font-medium">{qualityScore.breakdown.descriptionQuality}/10</span>
                              </div>
                            </div>
                            {qualityScore.suggestions.length > 0 && (
                              <div className="mt-3 pt-2 border-t border-border">
                                <p className="text-xs font-medium text-muted-foreground mb-1">Verbesserungsvorschläge:</p>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {qualityScore.suggestions.slice(0, 3).map((suggestion, idx) => (
                                    <li key={idx}>• {suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })()}
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
                <div className="bg-card border border-border rounded-lg p-12 text-center shadow-sm">
                  <Eye className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
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