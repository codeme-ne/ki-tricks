/* eslint-disable @next/next/no-img-element */
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { PageContainer } from '@/components/layout'
import { Badge, Button } from '@/components/atoms'
import { Input } from '@/components/ui/input'
import { AdminAuth } from '@/lib/utils/admin-auth'
import type { Database } from '@/lib/supabase/types'
import { RefreshCcw, Send, ShieldAlert, ShieldCheck, Camera, Globe } from 'lucide-react'

const ROLE_OPTIONS: Array<Database['public']['Enums']['company_role_enum']> = [
  'general',
  'sales',
  'marketing',
  'hr',
  'finance',
  'it',
  'procurement',
  'operations',
  'customer-service',
  'legal',
  'product',
  'consulting'
]

const EVIDENCE_OPTIONS: Array<Database['public']['Enums']['evidence_level_enum']> = ['A', 'B', 'C']
const RISK_OPTIONS: Array<Database['public']['Enums']['risk_level_enum']> = ['low', 'medium', 'high']

const QUALITY_LABELS: Record<'excellent' | 'good' | 'fair' | 'poor', string> = {
  excellent: 'exzellent',
  good: 'gut',
  fair: 'okay',
  poor: 'verbesserungswürdig'
}

type EvidenceLevel = Database['public']['Enums']['evidence_level_enum']

type RiskLevel = Database['public']['Enums']['risk_level_enum']

type CompanyRole = Database['public']['Enums']['company_role_enum']

interface GuideDuplicate {
  id: string
  title: string
  slug: string
  status: 'draft' | 'pending' | 'published' | 'archived'
  overallSimilarity: number
}

interface GuideItem {
  id: string
  title: string
  summary: string | null
  steps: string[]
  examples: string[]
  slug: string
  quality_score: number | null
  role: CompanyRole | null
  industries: string[]
  tools: string[]
  evidence_level: EvidenceLevel | null
  risk_level: RiskLevel | null
  hero_image_url: string | null
  sources: Array<Record<string, unknown>>
  duplicates: GuideDuplicate[]
  highestDuplicateSimilarity: number
}

interface PublishFormState {
  slug: string
  role: CompanyRole | ''
  industries: string
  tools: string
  evidence: EvidenceLevel | ''
  risk: RiskLevel
}

const createInitialFormState = (guide: GuideItem | null): PublishFormState => ({
  slug: guide?.slug ?? '',
  role: guide?.role ?? '',
  industries: guide?.industries?.join(', ') ?? '',
  tools: guide?.tools?.join(', ') ?? '',
  evidence: guide?.evidence_level ?? '',
  risk: guide?.risk_level ?? 'medium'
})

const toCommaSeparated = (value: string) =>
  value
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean)

const extractSourceUrl = (guide: GuideItem | null): string | null => {
  if (!guide || !Array.isArray(guide.sources)) return null
  const sourceEntry = guide.sources.find(entry => entry && entry['type'] === 'news_item') as
    | Record<string, unknown>
    | undefined
  const url = sourceEntry?.url
  return typeof url === 'string' ? url : null
}

export default function PendingGuidesPage() {
  const [guides, setGuides] = useState<GuideItem[]>([])
  const [selectedGuide, setSelectedGuide] = useState<GuideItem | null>(null)
  const [formState, setFormState] = useState<PublishFormState>(createInitialFormState(null))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [screenshotting, setScreenshotting] = useState(false)
  const [authToken, setAuthToken] = useState<string | null>(null)

  const loadGuides = useCallback(async () => {
    try {
      setError(null)
      setSuccess(null)
      setRefreshing(true)

      const token = authToken ?? (await AdminAuth.authenticateWithPrompt())
      if (!token) {
        setError('Authentifizierung erforderlich')
        setLoading(false)
        setRefreshing(false)
        return
      }

      setAuthToken(token)

      const response = await fetch('/api/admin/guides', {
        headers: {
          Authorization: `Basic ${token}`
        }
      })

      if (response.status === 401) {
        AdminAuth.clearSession()
        setAuthToken(null)
        setError('Session abgelaufen. Bitte neu anmelden.')
        setLoading(false)
        setRefreshing(false)
        return
      }

      if (!response.ok) {
        throw new Error('Fehler beim Laden der Guides')
      }

      AdminAuth.extendSession()
      const data = await response.json()
      const loadedGuides = (data.guides ?? []) as GuideItem[]
      const normalizedGuides = loadedGuides.map(guide => ({
        ...guide,
        steps: Array.isArray(guide.steps) ? guide.steps : [],
        examples: Array.isArray(guide.examples) ? guide.examples : [],
        industries: Array.isArray(guide.industries) ? guide.industries : [],
        tools: Array.isArray(guide.tools) ? guide.tools : [],
        sources: Array.isArray(guide.sources) ? guide.sources : [],
        duplicates: Array.isArray(guide.duplicates)
          ? guide.duplicates.map(dup => ({
              ...dup,
              overallSimilarity: Number(dup.overallSimilarity ?? 0)
            }))
          : []
      }))

      setGuides(normalizedGuides)
      setSelectedGuide(normalizedGuides[0] ?? null)
      setFormState(createInitialFormState(normalizedGuides[0] ?? null))
      setLoading(false)
    } catch (fetchError) {
      console.error('Failed to load pending guides', fetchError)
      setError('Fehler beim Laden der Guides')
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }, [authToken])

  useEffect(() => {
    void loadGuides()
  }, [loadGuides])

  useEffect(() => {
    setFormState(createInitialFormState(selectedGuide))
  }, [selectedGuide])

  const handleSelect = (guide: GuideItem) => {
    setSelectedGuide(guide)
    setSuccess(null)
  }

  const handleChange = (field: keyof PublishFormState, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value as PublishFormState[keyof PublishFormState]
    }))
  }

  const handleScreenshot = async () => {
    if (!selectedGuide) return
    const sourceUrl = extractSourceUrl(selectedGuide)
    if (!sourceUrl) {
      setError('Keine Quelle für Screenshot gefunden.')
      return
    }

    try {
      setScreenshotting(true)
      setError(null)
      setSuccess(null)

      const token = authToken ?? (await AdminAuth.authenticateWithPrompt())
      if (!token) {
        setError('Authentifizierung erforderlich')
        setScreenshotting(false)
        return
      }

      setAuthToken(token)

      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`
        },
        body: JSON.stringify({ url: sourceUrl, guideId: selectedGuide.id })
      })

      const result = await response.json()

      if (response.status === 401) {
        AdminAuth.clearSession()
        setAuthToken(null)
        setError('Session abgelaufen. Bitte neu anmelden.')
        setScreenshotting(false)
        return
      }

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? 'Screenshot fehlgeschlagen.')
      }

      AdminAuth.extendSession()

      setGuides(prev =>
        prev.map(guide =>
          guide.id === selectedGuide.id ? { ...guide, hero_image_url: result.heroImageUrl } : guide
        )
      )
      setSelectedGuide(prev =>
        prev ? { ...prev, hero_image_url: result.heroImageUrl } : prev
      )

      setSuccess('Screenshot aktualisiert und gespeichert.')
    } catch (screenshotError) {
      console.error('Screenshot failed', screenshotError)
      setError(screenshotError instanceof Error ? screenshotError.message : 'Screenshot fehlgeschlagen')
    } finally {
      setScreenshotting(false)
    }
  }

  const handlePublish = async () => {
    if (!selectedGuide) return

    try {
      setPublishing(true)
      setError(null)
      setSuccess(null)

      const token = authToken ?? (await AdminAuth.authenticateWithPrompt())
      if (!token) {
        setError('Authentifizierung erforderlich')
        setPublishing(false)
        return
      }

      setAuthToken(token)

      const payload = {
        id: selectedGuide.id,
        action: 'publish' as const,
        slug: formState.slug,
        role: formState.role || undefined,
        industries: toCommaSeparated(formState.industries),
        tools: toCommaSeparated(formState.tools),
        evidence: formState.evidence || undefined,
        risk: formState.risk || undefined
      }

      const response = await fetch('/api/admin/guides', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (response.status === 401) {
        AdminAuth.clearSession()
        setAuthToken(null)
        setError('Session abgelaufen. Bitte neu anmelden.')
        setPublishing(false)
        return
      }

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? 'Veröffentlichung fehlgeschlagen.')
      }

      AdminAuth.extendSession()

      setGuides(prev => prev.filter(guide => guide.id !== selectedGuide.id))
      setSelectedGuide(null)
      setSuccess(`Guide veröffentlicht unter /learn/${result.slug}`)
    } catch (publishError) {
      console.error('Publish failed', publishError)
      setError(publishError instanceof Error ? publishError.message : 'Veröffentlichung fehlgeschlagen')
    } finally {
      setPublishing(false)
    }
  }

  const previewEntries = useMemo(() => {
    if (!selectedGuide) return [] as Array<{ key: string; value: string }>
    const entries: Array<{ key: string; value: string }> = []

    const sourceEntry = extractSourceUrl(selectedGuide)
    if (sourceEntry) {
      entries.push({ key: 'Quelle', value: sourceEntry })
    }

    return entries
  }, [selectedGuide])

  return (
    <PageContainer className="pb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-100">Guides veröffentlichen</h1>
          <p className="text-neutral-400">
            Prüfe vorbereitete Guides, aktualisiere Screenshot & veröffentliche mit einem Klick.
          </p>
        </div>
        <Button variant="outline" onClick={() => void loadGuides()} disabled={refreshing}>
          <RefreshCcw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Aktualisieren
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-900/40 bg-red-900/20 p-4 text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg border border-green-900/40 bg-green-900/15 p-4 text-green-200">
          {success}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center text-neutral-400">
          Lade Guides…
        </div>
      ) : guides.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center text-neutral-400">
          Keine offenen Guides. 🎉
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
          <section className="space-y-4">
            {guides.map(guide => {
              const isSelected = selectedGuide?.id === guide.id
              return (
                <button
                  key={guide.id}
                  type="button"
                  onClick={() => handleSelect(guide)}
                  className={`w-full rounded-lg border p-4 text-left transition ${
                    isSelected
                      ? 'border-primary-500 bg-primary-500/10 shadow-lg'
                      : 'border-border bg-card hover:border-primary-500/60 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-neutral-100 line-clamp-2">
                      {guide.title}
                    </h2>
                    <Badge variant="secondary" className="bg-primary-500/20 text-primary-300">
                      Score {guide.quality_score ?? '–'}
                    </Badge>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-neutral-400">
                    {guide.summary ?? 'Keine Summary vorhanden.'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-500">
                    {guide.role && <span>Rolle: {guide.role}</span>}
                    {guide.evidence_level && <span>Evidenz: {guide.evidence_level}</span>}
                    {guide.risk_level && <span>Risiko: {guide.risk_level}</span>}
                  </div>
                </button>
              )
            })}
          </section>

          <section className="rounded-lg border border-border bg-card p-6">
            {selectedGuide ? (
              <div className="space-y-6">
                <header className="space-y-2">
                  <h2 className="text-2xl font-semibold text-neutral-100">{selectedGuide.title}</h2>
                  <p className="text-sm text-neutral-400">Slug: {selectedGuide.slug}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
                    {selectedGuide.industries?.length > 0 && (
                      <span>Industrien: {selectedGuide.industries.join(', ')}</span>
                    )}
                    {selectedGuide.tools?.length > 0 && (
                      <span>Tools: {selectedGuide.tools.join(', ')}</span>
                    )}
                  </div>
                </header>

                {selectedGuide.hero_image_url ? (
                  <div className="overflow-hidden rounded-lg border border-border/60">
                    <img
                      src={selectedGuide.hero_image_url}
                      alt="Guide Hero"
                      className="w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border/60 bg-black/20 p-6 text-sm text-neutral-500">
                    Noch kein Screenshot vorhanden.
                  </div>
                )}

                <div className="rounded-md border border-border/80 bg-black/20 p-4 text-sm text-neutral-300">
                  {selectedGuide.summary ?? 'Keine Summary vorhanden.'}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-200 mb-2">Schritte</h3>
                    <ol className="space-y-2 text-sm text-neutral-300 list-decimal list-inside">
                      {selectedGuide.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-neutral-200 mb-2">Beispiele</h3>
                    <ul className="space-y-2 text-sm text-neutral-300 list-disc list-inside">
                      {selectedGuide.examples.map((example, index) => (
                        <li key={index}>{example}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {selectedGuide.duplicates.length > 0 ? (
                  <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-4 text-amber-100">
                    <div className="flex items-center gap-2 font-semibold">
                      <ShieldAlert className="h-4 w-4" />
                      <span>Mögliche Dubletten ({selectedGuide.highestDuplicateSimilarity}% Übereinstimmung)</span>
                    </div>
                    <ul className="mt-2 space-y-2 text-sm">
                      {selectedGuide.duplicates.map(dup => (
                        <li key={dup.id} className="flex flex-col">
                          <span className="text-neutral-50">{dup.title}</span>
                          <span className="text-neutral-200 text-xs">
                            Status: {dup.status} · Ähnlichkeit: {dup.overallSimilarity}% · Slug: {dup.slug || '—'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="rounded-md border border-green-500/30 bg-green-500/10 p-4 text-green-100 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Keine ähnlichen Guides gefunden.</span>
                  </div>
                )}

                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-200">Slug</label>
                    <Input
                      value={formState.slug}
                      onChange={event => handleChange('slug', event.target.value)}
                      placeholder="slug"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-200">Rolle</label>
                    <select
                      className="w-full rounded-md border border-border bg-black/30 p-2 text-sm text-neutral-100"
                      value={formState.role}
                      onChange={event => handleChange('role', event.target.value)}
                    >
                      <option value="">— optional —</option>
                      {ROLE_OPTIONS.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-200">Industrien (Komma getrennt)</label>
                    <Input
                      value={formState.industries}
                      onChange={event => handleChange('industries', event.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-200">Tools (Komma getrennt)</label>
                    <Input
                      value={formState.tools}
                      onChange={event => handleChange('tools', event.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-200">Evidenz-Level</label>
                    <select
                      className="w-full rounded-md border border-border bg-black/30 p-2 text-sm text-neutral-100"
                      value={formState.evidence}
                      onChange={event => handleChange('evidence', event.target.value)}
                    >
                      <option value="">— unverändert —</option>
                      {EVIDENCE_OPTIONS.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-200">Risiko-Einschätzung</label>
                    <select
                      className="w-full rounded-md border border-border bg-black/30 p-2 text-sm text-neutral-100"
                      value={formState.risk}
                      onChange={event => handleChange('risk', event.target.value)}
                    >
                      {RISK_OPTIONS.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {previewEntries.length > 0 && (
                  <div className="space-y-2 text-sm text-neutral-400">
                    <p className="text-neutral-300">Quellen:</p>
                    {previewEntries.map(entry => (
                      <div key={entry.key} className="flex items-start gap-2">
                        <Globe className="h-4 w-4 mt-1 text-neutral-500" />
                        <a
                          href={entry.value}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary-300 hover:text-primary-200 break-all"
                        >
                          {entry.value}
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={() => void handleScreenshot()} disabled={screenshotting} variant="outline">
                    <Camera className={`mr-2 h-4 w-4 ${screenshotting ? 'animate-spin' : ''}`} />
                    Screenshot aktualisieren
                  </Button>
                  <Button onClick={() => void handlePublish()} disabled={publishing}>
                    <Send className={`mr-2 h-4 w-4 ${publishing ? 'animate-spin' : ''}`} />
                    Veröffentlichen
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-neutral-400">
                Wähle links einen Guide aus, um Details zu sehen.
              </div>
            )}
          </section>
        </div>
      )}
    </PageContainer>
  )
}
