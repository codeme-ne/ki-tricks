'use client'

import { useState, useEffect } from 'react'
import { Button, Badge } from '@/components/atoms'
import { TrickPreview } from '@/components/organisms/TrickPreview'
import { KITrick, Category } from '@/lib/types/types'
import { categoryLabels } from '@/lib/constants/constants'
import {
  Plus,
  X,
  Lightbulb,
  Wand2,
  ListChecks,
  CheckCircle2,
  AlertCircle,
  Circle,
  Target
} from 'lucide-react'

interface TrickFormProps {
  onSubmit: (data: Partial<KITrick>) => void
  isSubmitting?: boolean
  initialData?: Partial<KITrick>
}

const categories: { value: Category; label: string }[] = [
  { value: 'productivity', label: categoryLabels['productivity'] },
  { value: 'content-creation', label: categoryLabels['content-creation'] },
  { value: 'programming', label: categoryLabels['programming'] },
  { value: 'design', label: categoryLabels['design'] },
  { value: 'data-analysis', label: categoryLabels['data-analysis'] },
  { value: 'learning', label: categoryLabels['learning'] },
  { value: 'business', label: categoryLabels['business'] },
  { value: 'marketing', label: categoryLabels['marketing'] }
]

type FieldStatus = 'empty' | 'incomplete' | 'complete'

const statusMeta: Record<FieldStatus, { label: string; variant: 'neutral' | 'warning' | 'success'; Icon: typeof Circle }> = {
  empty: {
    label: 'Noch offen',
    variant: 'neutral',
    Icon: Circle
  },
  incomplete: {
    label: 'Fast geschafft',
    variant: 'warning',
    Icon: AlertCircle
  },
  complete: {
    label: 'Fertig',
    variant: 'success',
    Icon: CheckCircle2
  }
}

export const TrickForm = ({ onSubmit, isSubmitting = false, initialData = {} }: TrickFormProps) => {
  const TITLE_MIN_LENGTH = 10
  const DESCRIPTION_MIN_LENGTH = 50
  const STORAGE_KEY = 'ki-tricks-draft'

  const [formData, setFormData] = useState<Partial<KITrick>>({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || 'productivity',
    tools: initialData.tools || [],
    steps: initialData.steps || [],
    examples: initialData.examples || [],
    why_it_works: initialData.why_it_works || ''
  })

  // Auto-save form data to localStorage (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    }, 2000)
    return () => clearTimeout(timer)
  }, [formData, STORAGE_KEY])

  // Load saved draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.title || parsed.description) {
          if (window.confirm('Gespeicherten Entwurf wiederherstellen?')) {
            setFormData(parsed)
          } else {
            localStorage.removeItem(STORAGE_KEY)
          }
        }
      } catch (error) {
        console.error('Failed to parse saved draft:', error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [STORAGE_KEY])

  const [newStep, setNewStep] = useState('')
  const [bulkSteps, setBulkSteps] = useState('')
  const [newExample, setNewExample] = useState('')
  const [toolInput, setToolInput] = useState('')
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null)
  const [editingStepValue, setEditingStepValue] = useState('')
  const [editingExampleIndex, setEditingExampleIndex] = useState<number | null>(null)
  const [editingExampleValue, setEditingExampleValue] = useState('')
  const [showMobilePreview, setShowMobilePreview] = useState(false)
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({})

  const validateField = (name: string, value: string) => {
    const trimmed = value.trim()
    if (name === 'title') {
      if (!trimmed || trimmed.length < TITLE_MIN_LENGTH) {
        return `Titel muss mindestens ${TITLE_MIN_LENGTH} Zeichen haben.`
      }
    }
    if (name === 'description') {
      if (!trimmed || trimmed.length < DESCRIPTION_MIN_LENGTH) {
        return `Beschreibung muss mindestens ${DESCRIPTION_MIN_LENGTH} Zeichen haben.`
      }
    }
    return undefined
  }

  const validateForm = (data: Partial<KITrick>) => {
    const titleError = validateField('title', data.title || '')
    const descriptionError = validateField('description', data.description || '')

    const nextErrors: { title?: string; description?: string } = {}
    if (titleError) nextErrors.title = titleError
    if (descriptionError) nextErrors.description = descriptionError

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const getNormalizedData = (): Partial<KITrick> => ({
    ...formData,
    title: formData.title?.trim() || '',
    description: formData.description?.trim() || '',
    why_it_works: formData.why_it_works?.trim() || '',
    tools: (formData.tools || []).map(tool => tool.trim()).filter(Boolean),
    steps: (formData.steps || []).map(step => step.trim()).filter(Boolean),
    examples: (formData.examples || []).map(example => example.trim()).filter(Boolean)
  })

  const normalizedData = getNormalizedData()

  const submitIfValid = () => {
    const normalized = normalizedData
    if (!validateForm(normalized)) {
      return false
    }
    onSubmit(normalized)
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitIfValid()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'title' || name === 'description') {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }))
    }
  }

  const addStep = () => {
    if (newStep.trim()) {
      setFormData(prev => ({
        ...prev,
        steps: [...(prev.steps || []), newStep.trim()]
      }))
      setNewStep('')
    }
  }

  const addBulkSteps = () => {
    const lines = bulkSteps
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
    if (lines.length > 0) {
      setFormData(prev => ({
        ...prev,
        steps: [...(prev.steps || []), ...lines]
      }))
      setBulkSteps('')
    }
  }

  const removeStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps?.filter((_, i) => i !== index)
    }))
  }

  const addExample = () => {
    if (newExample.trim()) {
      setFormData(prev => ({
        ...prev,
        examples: [...(prev.examples || []), newExample.trim()]
      }))
      setNewExample('')
    }
  }

  const removeExample = (index: number) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples?.filter((_, i) => i !== index)
    }))
  }

  const addTool = () => {
    const trimmed = toolInput.trim()
    if (!trimmed) return
    setFormData(prev => ({
      ...prev,
      tools: Array.from(new Set([...(prev.tools || []), trimmed]))
    }))
    setToolInput('')
  }

  const removeTool = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools?.filter((_, i) => i !== index)
    }))
  }

  const handleToolKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addTool()
    }
  }

  const startEditStep = (index: number) => {
    setEditingStepIndex(index)
    setEditingStepValue(formData.steps?.[index] || '')
  }

  const saveStepEdit = () => {
    if (editingStepIndex === null) return
    const value = editingStepValue.trim()
    if (!value) {
      removeStep(editingStepIndex)
    } else {
      setFormData(prev => ({
        ...prev,
        steps: prev.steps?.map((step, idx) => (idx === editingStepIndex ? value : step))
      }))
    }
    setEditingStepIndex(null)
    setEditingStepValue('')
  }

  const cancelStepEdit = () => {
    setEditingStepIndex(null)
    setEditingStepValue('')
  }

  const startEditExample = (index: number) => {
    setEditingExampleIndex(index)
    setEditingExampleValue(formData.examples?.[index] || '')
  }

  const saveExampleEdit = () => {
    if (editingExampleIndex === null) return
    const value = editingExampleValue.trim()
    if (!value) {
      removeExample(editingExampleIndex)
    } else {
      setFormData(prev => ({
        ...prev,
        examples: prev.examples?.map((example, idx) => (idx === editingExampleIndex ? value : example))
      }))
    }
    setEditingExampleIndex(null)
    setEditingExampleValue('')
  }

  const cancelExampleEdit = () => {
    setEditingExampleIndex(null)
    setEditingExampleValue('')
  }

  const getFieldStatus = (value: string, minLength = 0): FieldStatus => {
    if (!value.trim()) return 'empty'
    if (value.trim().length < minLength) return 'incomplete'
    return 'complete'
  }

  const getListStatus = (list: string[] | undefined | null, minItems = 1): FieldStatus => {
    if (!list || list.length === 0) return 'empty'
    if (list.length < minItems) return 'incomplete'
    return 'complete'
  }

  const titleStatus = getFieldStatus(normalizedData.title || '', TITLE_MIN_LENGTH)
  const descriptionStatus = getFieldStatus(normalizedData.description || '', DESCRIPTION_MIN_LENGTH)
  const essentialsStatus: FieldStatus =
    titleStatus === 'complete' && descriptionStatus === 'complete'
      ? 'complete'
      : titleStatus === 'empty' && descriptionStatus === 'empty'
        ? 'empty'
        : 'incomplete'

  const stepsStatus = getListStatus(normalizedData.steps, 2)
  const examplesStatus = getListStatus(normalizedData.examples, 1)
  const toolsStatus = getListStatus(normalizedData.tools, 1)

  const checklistItems = [
    {
      label: `Titel hat mindestens ${TITLE_MIN_LENGTH} Zeichen`,
      done: titleStatus === 'complete'
    },
    {
      label: `Beschreibung hat mindestens ${DESCRIPTION_MIN_LENGTH} Zeichen`,
      done: descriptionStatus === 'complete'
    },
    {
      label: 'Mindestens zwei Schritte hinzugefügt',
      done: stepsStatus === 'complete'
    },
    {
      label: 'Mindestens ein Beispiel vorhanden',
      done: examplesStatus !== 'empty'
    },
    {
      label: 'Benötigte Tools aufgelistet',
      done: toolsStatus !== 'empty'
    }
  ]

  const StatusBadge = ({ status }: { status: FieldStatus }) => {
    const { label, variant, Icon } = statusMeta[status]
    return (
      <Badge variant={variant} className="text-xs">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    )
  }

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(360px,420px)]">
      <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in-0 duration-300">
        <section className="bg-card dark:bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Schritt 1
              </p>
              <h2 className="text-xl font-semibold text-foreground">
                Erzähl uns vom Kern deines Tricks
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Ein klarer Titel und eine prägnante Beschreibung helfen uns, deinen Beitrag schnell einzuordnen.
              </p>
            </div>
            <StatusBadge status={essentialsStatus} />
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                Titel *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                minLength={TITLE_MIN_LENGTH}
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring placeholder:text-muted-foreground"
                placeholder="ChatGPT schreibt perfekte Meeting-Notizen"
              />
              <div className="flex items-center justify-between mt-1 text-xs">
                <p className={errors.title ? 'text-destructive' : 'text-muted-foreground'}>
                  {errors.title ?? `Mindestens ${TITLE_MIN_LENGTH} Zeichen`}
                </p>
                <span className="text-muted-foreground">{formData.title?.length ?? 0} Zeichen</span>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
                Beschreibung *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring placeholder:text-muted-foreground"
                placeholder="Mit diesem Trick erstellt ChatGPT aus deinem Meeting-Transcript strukturierte Notizen mit Action Items in unter 30 Sekunden."
              />
              <div className="flex items-center justify-between mt-1 text-xs">
                <p className={errors.description ? 'text-destructive' : 'text-muted-foreground'}>
                  {errors.description ?? `Mindestens ${DESCRIPTION_MIN_LENGTH} Zeichen`}
                </p>
                <span className="text-muted-foreground">{formData.description?.length ?? 0} Zeichen</span>
              </div>
            </div>

            <div>
              <label htmlFor="why_it_works" className="block text-sm font-medium text-foreground mb-1">
                Warum es funktioniert (optional)
              </label>
              <textarea
                id="why_it_works"
                name="why_it_works"
                rows={3}
                value={formData.why_it_works}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring placeholder:text-muted-foreground"
                placeholder="ChatGPT kann transkribierte Gespräche strukturieren und nach Kategorien sortieren - spart 80% der Zeit gegenüber manueller Zusammenfassung."
              />
              <p className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
                <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                Teilen eines kurzen Hintergrunds macht deinen Trick nachvollziehbarer.
              </p>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1">
                Kategorie *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="bg-card dark:bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Schritt 2
              </p>
              <h2 className="text-xl font-semibold text-foreground">
                Zeige den Weg zum Ergebnis
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Zerlege deinen Trick in klare Schritte und füge Beispiele hinzu, damit andere ihn schnell nachbauen können.
              </p>
            </div>
            <StatusBadge status={stepsStatus} />
          </div>

          <div className="mt-6 space-y-5">
            <div className="rounded-lg border border-dashed border-border bg-muted/60 p-4">
              <div className="flex items-start gap-3">
                <Wand2 className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Tipp für gute Schritte
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Beschreibe jede Aktion in einem Satz. Ergänze, welches Tool oder welche Eingabe notwendig ist.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <textarea
                  value={newStep}
                  onChange={event => setNewStep(event.target.value)}
                  rows={2}
                  className="flex-1 px-4 py-2.5 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring placeholder:text-muted-foreground"
                  placeholder="1. Öffne ChatGPT und wähle GPT-4 Modell"
                />
                <Button type="button" onClick={addStep} variant="outline" className="h-11">
                  <Plus className="w-4 h-4" />
                  Hinzufügen
                </Button>
              </div>

              <div className="text-xs text-neutral-400 text-center my-3">oder</div>

              <div className="space-y-3">
                <textarea
                  value={bulkSteps}
                  onChange={event => setBulkSteps(event.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 text-neutral-900 dark:text-slate-100 border border-neutral-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-sky-400 focus:border-transparent placeholder:text-neutral-400 dark:placeholder:text-slate-500"
                  placeholder="Oder füge mehrere Schritte auf einmal ein (eine Zeile = ein Schritt)&#10;&#10;Beispiel:&#10;Öffne ChatGPT und wähle GPT-4&#10;Gib deinen Meeting-Transcript ein&#10;Prompt: 'Fasse die Key Points zusammen'"
                />
                <Button type="button" onClick={addBulkSteps} variant="outline" size="sm" className="w-full sm:w-auto">
                  <Plus className="w-4 h-4" />
                  Alle hinzufügen
                </Button>
              </div>

              <div className="space-y-3">
                {formData.steps?.map((step, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800/50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        {editingStepIndex === index ? (
                          <>
                            <textarea
                              value={editingStepValue}
                              onChange={event => setEditingStepValue(event.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 bg-white dark:bg-slate-800 text-neutral-900 dark:text-slate-100 border border-primary rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-sky-400 focus:border-transparent"
                            />
                            <div className="flex gap-2">
                              <Button type="button" size="sm" onClick={saveStepEdit}>
                                Speichern
                              </Button>
                              <Button type="button" size="sm" variant="secondary" onClick={cancelStepEdit}>
                                Abbrechen
                              </Button>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm leading-relaxed text-neutral-700 dark:text-slate-300">{step}</p>
                        )}
                      </div>
                      {editingStepIndex !== index && (
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => startEditStep(index)}
                            className="text-xs text-primary hover:underline"
                          >
                            Bearbeiten
                          </button>
                          <button
                            type="button"
                            onClick={() => removeStep(index)}
                            className="text-xs text-neutral-400 hover:text-neutral-600"
                          >
                            Entfernen
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-neutral-800">
                Beispiele (optional)
              </label>
              <p className="text-xs text-neutral-500">
                Zeig uns ein konkretes Ergebnis, einen Prompt oder einen Screenshot in Worten.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <textarea
                  value={newExample}
                  onChange={event => setNewExample(event.target.value)}
                  rows={2}
                  className="flex-1 px-4 py-2.5 bg-white text-neutral-900 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-neutral-400"
                  placeholder="Prompt-Beispiel: 'Analysiere dieses Meeting und erstelle: 1) Zusammenfassung, 2) Beschlüsse, 3) Action Items mit Verantwortlichen'"
                />
                <Button type="button" onClick={addExample} variant="outline" className="h-11">
                  <Plus className="w-4 h-4" />
                  Hinzufügen
                </Button>
              </div>

              <div className="space-y-3">
                {formData.examples?.map((example, index) => (
                  <div key={index} className="rounded-lg border border-green-100 dark:border-green-900/50 bg-green-50/80 dark:bg-green-900/20 p-4">
                    {editingExampleIndex === index ? (
                      <>
                        <textarea
                          value={editingExampleValue}
                          onChange={event => setEditingExampleValue(event.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 text-neutral-900 dark:text-slate-100 border border-primary rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-sky-400 focus:border-transparent"
                        />
                        <div className="mt-3 flex gap-2">
                          <Button type="button" size="sm" onClick={saveExampleEdit}>
                            Speichern
                          </Button>
                          <Button type="button" size="sm" variant="secondary" onClick={cancelExampleEdit}>
                            Abbrechen
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-green-500" />
                        <p className="flex-1 text-sm leading-relaxed text-green-900 dark:text-green-100">{example}</p>
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => startEditExample(index)}
                            className="text-xs text-primary hover:underline"
                          >
                            Bearbeiten
                          </button>
                          <button
                            type="button"
                            onClick={() => removeExample(index)}
                            className="text-xs text-green-700/70 hover:text-green-700"
                          >
                            Entfernen
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Schritt 3
              </p>
              <h2 className="text-xl font-semibold text-neutral-900">
                Was wird benötigt?
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                Liste die wichtigsten Tools oder Ressourcen auf, die man für deinen Trick braucht.
              </p>
            </div>
            <StatusBadge status={toolsStatus} />
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50/80 p-4">
              <div className="flex items-start gap-3">
                <ListChecks className="w-5 h-5 text-primary" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-neutral-800">Tools einzeln hinzufügen</p>
                  <p className="text-xs text-neutral-500">
                    Drücke Enter, um einen Tool-Namen als Tag zu speichern. Du kannst später jederzeit anpassen.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={toolInput}
                onChange={event => setToolInput(event.target.value)}
                onKeyDown={handleToolKeyDown}
                className="flex-1 px-4 py-2.5 bg-white text-neutral-900 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-neutral-400"
                placeholder="z.B. ChatGPT, Zapier, Midjourney"
              />
              <Button type="button" onClick={addTool} variant="outline" className="h-11">
                <Plus className="w-4 h-4" />
                Hinzufügen
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(formData.tools || []).length === 0 && (
                <p className="text-xs text-neutral-400">Füge mindestens ein Tool hinzu.</p>
              )}
              {formData.tools?.map((tool, index) => (
                <span
                  key={`${tool}-${index}`}
                  className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                >
                  {tool}
                  <button
                    type="button"
                    onClick={() => removeTool(index)}
                    className="text-primary/80 transition hover:text-primary"
                    aria-label={`${tool} entfernen`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-neutral-900">Bereit zum Einreichen?</h3>
              <p className="text-sm text-neutral-500">
                Wir prüfen deinen Beitrag manuell. Du erhältst eine Bestätigung, sobald wir ihn freigeschaltet haben.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowMobilePreview(prev => !prev)}
                className="w-full justify-center sm:w-auto lg:hidden"
              >
                Vorschau {showMobilePreview ? 'ausblenden' : 'anzeigen'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => window.history.back()}
                className="w-full justify-center sm:w-auto"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || !!errors.title || !!errors.description}
                className="w-full justify-center sm:w-auto"
              >
                {isSubmitting ? 'Wird eingereicht...' : 'Trick einreichen'}
              </Button>
            </div>
          </div>
        </section>

        {showMobilePreview && (
          <div className="lg:hidden space-y-4">
            <TrickPreview formData={normalizedData} />
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold text-neutral-900">Einreichungs-Checkliste</h3>
              </div>
              <ul className="space-y-3">
                {checklistItems.map(item => (
                  <li key={item.label} className="flex items-start gap-3 text-sm">
                    <span
                      className={`mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                        item.done ? 'border-green-500 bg-green-500/20 text-green-600' : 'border-neutral-300 text-neutral-400'
                      }`}
                    >
                      {item.done ? <CheckCircle2 className="w-3 h-3" /> : ''}
                    </span>
                    <span className={item.done ? 'text-neutral-600' : 'text-neutral-400'}>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </form>

      <aside className="mt-10 hidden lg:block">
        <div className="sticky top-24 space-y-5">
          <TrickPreview formData={normalizedData} />
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-semibold text-neutral-900">Einreichungs-Checkliste</h3>
            </div>
            <ul className="space-y-3">
              {checklistItems.map(item => (
                <li key={item.label} className="flex items-start gap-3 text-sm">
                  <span
                    className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                      item.done ? 'border-green-500 bg-green-500/10 text-green-600' : 'border-neutral-300 text-neutral-400'
                    }`}
                  >
                    {item.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : ''}
                  </span>
                  <span className={item.done ? 'text-neutral-600' : 'text-neutral-400'}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  )
}
