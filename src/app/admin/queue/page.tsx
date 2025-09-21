'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { PageContainer } from '@/components/layout'
import { Badge, Button } from '@/components/atoms'
import { Input } from '@/components/ui/input'
import { AdminAuth } from '@/lib/utils/admin-auth'
import type { Database } from '@/lib/supabase/types'
import { RefreshCcw, Send, ShieldAlert, ShieldCheck } from 'lucide-react'

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

type EvidenceLevel = Database['public']['Enums']['evidence_level_enum']

type RiskLevel = Database['public']['Enums']['risk_level_enum']

type CompanyRole = Database['public']['Enums']['company_role_enum']

interface QueueItem {
  id: string
  title: string
  summary: string | null
  url: string
  source_id: string
  source_type: string
  source_category: string
  evidence_level: EvidenceLevel | null
  published_at: string | null
  tags: string[]
  raw: Record<string, unknown>
  content_hash: string
  created_at: string
  updated_at: string
}

interface FormState {
  role: CompanyRole | ''
  industries: string
  tools: string
  evidence: EvidenceLevel | ''
  risk: RiskLevel
}

interface GuideAnalysis {
  quality: {
    score: number
    category: 'excellent' | 'good' | 'fair' | 'poor'
    suggestions: string[]
  }
  duplicates: Array<{
    id: string
    title: string
    slug: string
    status: 'draft' | 'pending' | 'published' | 'archived'
    overallSimilarity: number
  }>
  highestDuplicateSimilarity: number
}

const DEFAULT_FORM: FormState = {
  role: '',
  industries: '',
  tools: '',
  evidence: '',
  risk: 'medium'
}

const createInitialFormState = (item: QueueItem | null): FormState => ({
  role: '',
  industries: '',
  tools: '',
  evidence: item?.evidence_level ?? '',
  risk: 'medium'
})

const QUALITY_LABELS: Record<'excellent' | 'good' | 'fair' | 'poor', string> = {
  excellent: 'exzellent',
  good: 'gut',
  fair: 'okay',
  poor: 'verbesserungswürdig'
}

const formatDate = (value: string | null) => {
  if (!value) return 'Unbekannt'
  try {
    return format(new Date(value), 'dd. MMM yyyy, HH:mm', { locale: de })
  } catch {
    return value
  }
}

const joinTags = (tags: string[]) => (tags.length ? tags.join(', ') : '–')

const parseCommaSeparated = (value: string) =>
  value
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean)

export default function AdminQueuePage() {
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [items, setItems] = useState<QueueItem[]>([])
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null)
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [analysis, setAnalysis] = useState<GuideAnalysis | null>(null)

  const loadQueue = useCallback(async () => {
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
      const response = await fetch('/api/admin/news-items', {
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
        throw new Error('Fehler beim Laden der Queue')
      }

      AdminAuth.extendSession()
      const payload = await response.json()
      const queueItems = (payload.items ?? []) as QueueItem[]
      setItems(queueItems)
      setSelectedItem(queueItems[0] ?? null)
      setAnalysis(null)
      setLoading(false)
    } catch (fetchError) {
      console.error('Failed to load curator queue', fetchError)
      setError('Fehler beim Laden der Queue')
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }, [authToken])

  useEffect(() => {
    void loadQueue()
  }, [loadQueue])

  useEffect(() => {
    setFormState(createInitialFormState(selectedItem))
  }, [selectedItem])

  const handleSelect = (item: QueueItem) => {
    setSuccess(null)
    setAnalysis(null)
    setSelectedItem(item)
  }

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value as FormState[keyof FormState]
    }))
  }

  const handlePropose = async () => {
    if (!selectedItem) return

    try {
      setSubmitting(true)
      setSuccess(null)
      setError(null)
      setAnalysis(null)

      const token = authToken ?? (await AdminAuth.authenticateWithPrompt())
      if (!token) {
        setError('Authentifizierung erforderlich')
        setSubmitting(false)
        return
      }

      setAuthToken(token)

      const payload = {
        newsItemId: selectedItem.id,
        role: formState.role || undefined,
        industries: parseCommaSeparated(formState.industries),
        tools: parseCommaSeparated(formState.tools),
        evidence: formState.evidence || undefined,
        risk: formState.risk || undefined
      }

      const response = await fetch('/api/admin/news-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (response.status === 401) {
        AdminAuth.clearSession()
        setAuthToken(null)
        setError('Session abgelaufen. Bitte neu anmelden.')
        setSubmitting(false)
        return
      }

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? 'Guide konnte nicht angelegt werden.')
      }

      AdminAuth.extendSession()

      const duplicates = Array.isArray(result.duplicates)
        ? result.duplicates.map((item: any) => ({
            id: String(item.id ?? ''),
            title: String(item.title ?? 'Unbenannter Guide'),
            slug: String(item.slug ?? ''),
            status: (item.status ?? 'pending') as 'draft' | 'pending' | 'published' | 'archived',
            overallSimilarity: Number(item.overallSimilarity ?? 0)
          }))
        : []

      const quality = result.quality
        ? {
            score: Number(result.quality.score ?? 0),
            category: (result.quality.category ?? 'fair') as GuideAnalysis['quality']['category'],
            suggestions: Array.isArray(result.quality.suggestions)
              ? (result.quality.suggestions as string[])
              : []
          }
        : {
            score: 0,
            category: 'fair' as const,
            suggestions: [] as string[]
          }

      setAnalysis({
        quality,
        duplicates,
        highestDuplicateSimilarity:
          typeof result.highestDuplicateSimilarity === 'number'
            ? result.highestDuplicateSimilarity
            : duplicates[0]?.overallSimilarity ?? 0
      })

      setItems(prev => {
        const updated = prev.filter(item => item.id !== selectedItem.id)
        setSelectedItem(updated[0] ?? null)
        return updated
      })

      setSuccess(
        `Guide-Entwurf angelegt. Qualität: ${quality.score.toFixed(0)}/100 (${quality.category}).`
      )
    } catch (submitError) {
      console.error('Failed to propose guide', submitError)
      setError(submitError instanceof Error ? submitError.message : 'Unbekannter Fehler beim Vorschlag')
    } finally {
      setSubmitting(false)
    }
  }

  const previewEntries = useMemo(() => {
    if (!selectedItem) return [] as Array<{ key: string; value: string }>

    const raw = selectedItem.raw || {}
    const interestingKeys = ['author', 'categories', 'guid', 'source', 'language']

    return interestingKeys
      .map(key => ({
        key,
        value: raw && typeof raw === 'object' && key in raw ? String((raw as Record<string, unknown>)[key]) : ''
      }))
      .filter(entry => entry.value)
  }, [selectedItem])

  return (
    <PageContainer className="pb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-100">Curator Queue</h1>
          <p className="text-neutral-400">
            Prüfe automatisierte News-Einträge und lege Guide-Entwürfe an.
          </p>
        </div>
        <Button variant="outline" onClick={() => void loadQueue()} disabled={refreshing}>
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

      {analysis && (
        <div className="mb-6 rounded-lg border border-primary-900/40 bg-primary-900/15 p-5 text-neutral-100">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-neutral-400">Qualitätsscore</p>
                <p className="text-xl font-semibold">
                  {analysis.quality.score.toFixed(0)}/100 · {QUALITY_LABELS[analysis.quality.category]}
                </p>
              </div>
              {analysis.quality.suggestions.length > 0 && (
                <ul className="text-sm text-neutral-300 list-disc pl-5">
                  {analysis.quality.suggestions.slice(0, 3).map(hint => (
                    <li key={hint}>{hint}</li>
                  ))}
                </ul>
              )}
            </div>

            {analysis.duplicates.length > 0 ? (
              <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-4 text-amber-100">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    <span className="font-semibold">
                      Mögliche Dubletten ({analysis.highestDuplicateSimilarity}% Übereinstimmung)
                    </span>
                  </div>
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  {analysis.duplicates.map(dup => (
                    <li key={dup.id} className="flex flex-col">
                      <span className="font-medium text-neutral-100">{dup.title}</span>
                      <span className="text-neutral-300">
                        Status: {dup.status} · Ähnlichkeit: {dup.overallSimilarity}% · Slug: {dup.slug || '—'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-md border border-green-500/30 bg-green-500/10 p-4 text-green-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Keine ähnlichen Guides gefunden.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center text-neutral-400">
          Lade Queue…
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center text-neutral-400">
          Keine offenen News-Items. 🎉
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
          <section className="space-y-4">
            {items.map(item => {
              const isSelected = selectedItem?.id === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={`w-full rounded-lg border p-4 text-left transition ${
                    isSelected
                      ? 'border-primary-500 bg-primary-500/10 shadow-lg'
                      : 'border-border bg-card hover:border-primary-500/60 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-neutral-100 line-clamp-2">
                      {item.title}
                    </h2>
                    <span className="text-sm text-neutral-500">
                      {formatDate(item.published_at ?? item.created_at)}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm text-neutral-400">
                    <span className="rounded bg-white/5 px-2 py-1 text-xs uppercase tracking-wide text-neutral-300">
                      {item.source_id || 'unknown'}
                    </span>
                    <span className="text-neutral-500">{item.source_category}</span>
                    {item.evidence_level && (
                      <Badge variant="secondary" className="bg-primary-500/20 text-primary-300">
                        Evidenz {item.evidence_level}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-neutral-400">
                    {item.summary ?? 'Keine Zusammenfassung verfügbar.'}
                  </p>
                  <p className="mt-2 text-xs text-neutral-500">Tags: {joinTags(item.tags)}</p>
                </button>
              )
            })}
          </section>

          <section className="rounded-lg border border-border bg-card p-6">
            {selectedItem ? (
              <div className="space-y-6">
                <header>
                  <h2 className="text-2xl font-semibold text-neutral-100">
                    {selectedItem.title}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-400">
                    Quelle: {selectedItem.source_id || 'unbekannt'} · Kategorie: {selectedItem.source_category}
                  </p>
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex text-sm text-primary-400 hover:text-primary-300"
                  >
                    Original ansehen
                  </a>
                </header>

                <div className="rounded-md border border-border/80 bg-black/20 p-4 text-sm text-neutral-300">
                  {selectedItem.summary ?? 'Keine Zusammenfassung vorhanden. Nutze Inhalt der Quelle.'}
                </div>

                <form className="grid gap-5 lg:grid-cols-2" onSubmit={event => event.preventDefault()}>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-200">Rolle</label>
                    <select
                      className="w-full rounded-md border border-border bg-black/30 p-2 text-sm text-neutral-100"
                      value={formState.role}
                      onChange={event => handleChange('role', event.target.value)}
                    >
                      <option value="">— auswählen —</option>
                      {ROLE_OPTIONS.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-200">Evidenz-Level</label>
                    <select
                      className="w-full rounded-md border border-border bg-black/30 p-2 text-sm text-neutral-100"
                      value={formState.evidence}
                      onChange={event => handleChange('evidence', event.target.value)}
                    >
                      <option value="">Übernehmen ({selectedItem.evidence_level ?? 'k.A.'})</option>
                      {EVIDENCE_OPTIONS.map(option => (
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
                      placeholder="z. B. Fertigung, Pharma"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-200">Tools (Komma getrennt)</label>
                    <Input
                      value={formState.tools}
                      onChange={event => handleChange('tools', event.target.value)}
                      placeholder="z. B. Excel, Salesforce"
                    />
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
                </form>

                {previewEntries.length > 0 && (
                  <div className="space-y-2 text-sm text-neutral-400">
                    <p className="text-neutral-300">Rohdaten-Vorschau:</p>
                    {previewEntries.map(entry => (
                      <div key={entry.key} className="flex items-start justify-between gap-4">
                        <span className="font-medium text-neutral-300">{entry.key}</span>
                        <span className="text-neutral-400">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={() => void handlePropose()} disabled={submitting}>
                    <Send className="mr-2 h-4 w-4" />
                    Zu Guide vorschlagen
                  </Button>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <ShieldCheck className="h-4 w-4 text-green-400" />
                    <span>Markiert Item als verarbeitet</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <ShieldAlert className="h-4 w-4 text-amber-400" />
                    <span>Duplikate werden automatisch übersprungen</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-neutral-400">
                Wähle links ein News-Item aus, um Details zu sehen.
              </div>
            )}
          </section>
        </div>
      )}
    </PageContainer>
  )
}
