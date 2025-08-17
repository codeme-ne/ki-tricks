'use client'

import { useState } from 'react'
import { Button, Badge } from '@/components/atoms'
import { TrickPreview } from '@/components/organisms/TrickPreview'
import { KITrick, Category, Difficulty, Impact } from '@/lib/types/types'
import { Plus, X, Eye, Edit } from 'lucide-react'

interface TrickFormProps {
  onSubmit: (data: Partial<KITrick>) => void
  isSubmitting?: boolean
  initialData?: Partial<KITrick>
}

const categories: { value: Category; label: string }[] = [
  { value: 'productivity', label: 'Produktivität' },
  { value: 'content-creation', label: 'Content-Erstellung' },
  { value: 'programming', label: 'Programmierung' },
  { value: 'design', label: 'Design' },
  { value: 'data-analysis', label: 'Datenanalyse' },
  { value: 'learning', label: 'Lernen' },
  { value: 'business', label: 'Business' },
  { value: 'marketing', label: 'Marketing' }
]

const difficulties: { value: Difficulty; label: string }[] = [
  { value: 'beginner', label: 'Anfänger' },
  { value: 'intermediate', label: 'Fortgeschritten' },
  { value: 'advanced', label: 'Experte' }
]

const impacts: { value: Impact; label: string }[] = [
  { value: 'low', label: 'Niedrig' },
  { value: 'medium', label: 'Mittel' },
  { value: 'high', label: 'Hoch' }
]

export const TrickForm = ({ onSubmit, isSubmitting = false, initialData = {} }: TrickFormProps) => {
  const [formData, setFormData] = useState<Partial<KITrick>>({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || 'productivity',
    difficulty: initialData.difficulty || 'beginner',
    tools: ['Claude', 'Claude Code'],
    timeToImplement: initialData.timeToImplement || '',
    impact: initialData.impact || 'medium',
    steps: initialData.steps || [],
    examples: initialData.examples || [],
    'Warum es funktioniert': initialData['Warum es funktioniert'] || ''
  })

  const [newStep, setNewStep] = useState('')
  const [newExample, setNewExample] = useState('')
  const [previewMode, setPreviewMode] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, 'success' | 'warning' | 'danger'> = {
      'beginner': 'success',
      'intermediate': 'warning',
      'advanced': 'danger'
    }
    return colors[difficulty] || 'primary'
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

  // Preview Mode Component
  if (previewMode) {
    return (
      <div className="space-y-6 animate-in fade-in-0 duration-300">
        {/* Preview Component */}
        <TrickPreview formData={formData} />

        {/* Actions */}
        <div className="flex justify-between bg-neutral-800 border border-neutral-700 rounded-lg p-4">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => setPreviewMode(false)}
            className="transition-all duration-200 hover:scale-105"
          >
            <Edit className="w-4 h-4 mr-2" />
            Zurück zur Bearbeitung
          </Button>
          <Button 
            type="button" 
            variant="primary" 
            onClick={() => onSubmit(formData)}
            disabled={isSubmitting}
            className="transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
          >
            {isSubmitting ? 'Wird eingereicht...' : 'Trick einreichen'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in-0 duration-300">
      {/* Basis-Informationen */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Basis-Informationen</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-300 mb-1">
              Titel *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-neutral-700 text-neutral-100 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-neutral-400"
              placeholder="z.B. Automatische Meeting-Zusammenfassungen mit ChatGPT"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-300 mb-1">
              Beschreibung *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-neutral-700 text-neutral-100 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-neutral-400"
              placeholder="Kurze Beschreibung des Tricks..."
            />
          </div>

          <div>
            <label htmlFor="Warum es funktioniert" className="block text-sm font-medium text-neutral-300 mb-1">
              Warum es funktioniert (optional)
            </label>
            <textarea
              id="Warum es funktioniert"
              name="Warum es funktioniert"
              rows={2}
              value={formData['Warum es funktioniert']}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-neutral-700 text-neutral-100 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-neutral-400"
              placeholder="Erkläre kurz das Prinzip hinter diesem Trick..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-neutral-300 mb-1">
                Kategorie *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-neutral-700 text-neutral-100 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-neutral-400"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-neutral-300 mb-1">
                Schwierigkeit *
              </label>
              <select
                id="difficulty"
                name="difficulty"
                required
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-neutral-700 text-neutral-100 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-neutral-400"
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>{diff.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="timeToImplement" className="block text-sm font-medium text-neutral-300 mb-1">
                Umsetzungszeit *
              </label>
              <input
                type="text"
                id="timeToImplement"
                name="timeToImplement"
                required
                value={formData.timeToImplement}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-neutral-700 text-neutral-100 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-neutral-400"
                placeholder="z.B. 15 Minuten"
              />
            </div>

            <div>
              <label htmlFor="impact" className="block text-sm font-medium text-neutral-300 mb-1">
                Impact *
              </label>
              <select
                id="impact"
                name="impact"
                required
                value={formData.impact}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-neutral-700 text-neutral-100 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-neutral-400"
              >
                {impacts.map(imp => (
                  <option key={imp.value} value={imp.value}>{imp.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Schritte */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Schritt-für-Schritt Anleitung (optional)</h2>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <textarea
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              rows={2}
              className="flex-1 px-4 py-2 bg-neutral-700 text-neutral-100 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-neutral-400"
              placeholder="Schritt hinzufügen..."
            />
            <Button type="button" onClick={addStep} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {formData.steps?.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-neutral-800/50 rounded-lg"
              >
                <span className="text-sm font-medium text-neutral-500">{index + 1}.</span>
                <p className="flex-1 text-sm">{step}</p>
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-neutral-400 hover:text-neutral-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Beispiele */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Beispiele (optional)</h2>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <textarea
              value={newExample}
              onChange={(e) => setNewExample(e.target.value)}
              rows={2}
              className="flex-1 px-4 py-2 bg-neutral-700 text-neutral-100 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-neutral-400"
              placeholder="Beispiel hinzufügen..."
            />
            <Button type="button" onClick={addExample} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {formData.examples?.map((example, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-neutral-800/50 rounded-lg"
              >
                <span className="text-sm">•</span>
                <p className="flex-1 text-sm">{example}</p>
                <button
                  type="button"
                  onClick={() => removeExample(index)}
                  className="text-neutral-400 hover:text-neutral-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => setPreviewMode(true)}
            className="transition-all duration-200 hover:scale-105 flex items-center justify-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            Vorschau anzeigen
          </Button>
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => window.history.back()}
              className="transition-all duration-200 hover:scale-105"
            >
              Abbrechen
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isSubmitting}
              className="transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            >
              {isSubmitting ? 'Wird eingereicht...' : 'Trick einreichen'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}