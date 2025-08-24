'use client'

import { useState } from 'react'
import { Button, Badge } from '@/components/atoms'
import { TrickPreview } from '@/components/organisms/TrickPreview'
import { KITrick, Category } from '@/lib/types/types'
import { categoryLabels, departmentTags, industryTags } from '@/lib/constants/constants'
import { Plus, X, Eye, Edit } from 'lucide-react'

interface TrickFormProps {
  onSubmit: (data: Partial<KITrick>) => void
  isSubmitting?: boolean
  initialData?: Partial<KITrick>
}

const categories: { value: Category; label: string }[] = [
  { value: 'vertrieb', label: categoryLabels['vertrieb'] },
  { value: 'marketing', label: categoryLabels['marketing'] },
  { value: 'personal', label: categoryLabels['personal'] },
  { value: 'finanzen', label: categoryLabels['finanzen'] },
  { value: 'operations', label: categoryLabels['operations'] },
  { value: 'it-entwicklung', label: categoryLabels['it-entwicklung'] },
  { value: 'kundenservice', label: categoryLabels['kundenservice'] },
  { value: 'produktion', label: categoryLabels['produktion'] }
]

export const TrickForm = ({ onSubmit, isSubmitting = false, initialData = {} }: TrickFormProps) => {
  const [formData, setFormData] = useState<Partial<KITrick>>({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || 'vertrieb',
    tools: initialData.tools || ['Claude', 'Claude Code'],
    departmentTags: initialData.departmentTags || [],
    industryTags: initialData.industryTags || [],
    steps: initialData.steps || [],
    examples: initialData.examples || [],
    'Warum es funktioniert': initialData['Warum es funktioniert'] || ''
  })

  const [newStep, setNewStep] = useState('')
  const [newExample, setNewExample] = useState('')
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(initialData.departmentTags || [])
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(initialData.industryTags || [])
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


  const toggleDepartment = (dept: string) => {
    setSelectedDepartments(prev => {
      const newDepts = prev.includes(dept) 
        ? prev.filter(d => d !== dept)
        : [...prev, dept]
      setFormData(current => ({ ...current, departmentTags: newDepts }))
      return newDepts
    })
  }

  const toggleIndustry = (ind: string) => {
    setSelectedIndustries(prev => {
      const newInds = prev.includes(ind)
        ? prev.filter(i => i !== ind)
        : [...prev, ind]
      setFormData(current => ({ ...current, industryTags: newInds }))
      return newInds
    })
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

          {/* Department Tags */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Abteilungen (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {departmentTags.map(dept => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => toggleDepartment(dept)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedDepartments.includes(dept)
                      ? 'bg-primary-600 text-white border border-primary-500'
                      : 'bg-neutral-700 text-neutral-300 border border-neutral-600 hover:bg-neutral-600'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Industry Tags */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Branchen (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {industryTags.map(ind => (
                <button
                  key={ind}
                  type="button"
                  onClick={() => toggleIndustry(ind)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedIndustries.includes(ind)
                      ? 'bg-primary-600 text-white border border-primary-500'
                      : 'bg-neutral-700 text-neutral-300 border border-neutral-600 hover:bg-neutral-600'
                  }`}
                >
                  {ind}
                </button>
              ))}
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