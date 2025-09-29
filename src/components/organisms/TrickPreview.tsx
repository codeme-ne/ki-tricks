'use client'

import React from 'react'
import { Badge } from '@/components/atoms'
import { KITrick, categoryMetadata } from '@/lib/types/types'
import { Code2, Brain, Briefcase, BarChart3, PenTool, Palette, TrendingUp, BookOpen, Eye, Sparkles, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils/utils'

interface TrickPreviewProps {
  formData: Partial<KITrick>
  className?: string
}

export const TrickPreview = ({ formData, className }: TrickPreviewProps) => {
  const categoryMeta = categoryMetadata[formData.category || 'productivity']
  
  // Get category icon
  const getCategoryIcon = () => {
    const iconClass = "w-6 h-6"
    switch (formData.category) {
      case 'programming': return <Code2 className={iconClass} />
      case 'productivity': return <TrendingUp className={iconClass} />
      case 'content-creation': return <PenTool className={iconClass} />
      case 'data-analysis': return <BarChart3 className={iconClass} />
      case 'learning': return <Brain className={iconClass} />
      case 'business': return <Briefcase className={iconClass} />
      case 'marketing': return <TrendingUp className={iconClass} />
      case 'design': return <Palette className={iconClass} />
      default: return <BookOpen className={iconClass} />
    }
  }


  return (
    <div className={cn("space-y-6", className)}>
      {/* Preview Header with subtle animation */}
      <div className="relative bg-blue-50 border border-blue-200 rounded-lg p-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 animate-pulse" />
        <div className="relative flex items-center gap-3 flex-wrap">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <Eye className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-blue-900 break-words">
              Vorschau-Modus
            </p>
            <p className="text-xs text-blue-700 break-words">
              So wird dein Trick auf der Plattform angezeigt
            </p>
          </div>
          <div className="ml-auto shrink-0">
            <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Preview Card */}
  <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/10">
        {/* Card Header */}
  <div className="p-6 border-b border-border">
          {/* Category and Icon */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="text-neutral-400 transition-colors">
              {getCategoryIcon()}
            </div>
            <Badge className={categoryMeta.color}>
              {categoryMeta.label}
            </Badge>
            {formData.title && (
              <div className="ml-auto">
                <Badge variant="new-subtle">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Bereit
                </Badge>
              </div>
            )}
          </div>

          {/* Title with accent border */}
          <div className="relative mb-4">
            <div className="absolute left-0 inset-y-0 w-1 rounded-full bg-gradient-to-b from-primary-400 to-primary-600" />
            <h1 className="text-2xl font-bold text-neutral-900 leading-tight pl-4 break-words">
              {formData.title || (
                <span className="text-neutral-400 italic break-words">
                  Kein Titel angegeben
                </span>
              )}
            </h1>
          </div>

          {/* Badges Row - removed difficulty, time, and impact */}
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-neutral-900 break-words">
              Beschreibung
            </h3>
            <div className="prose prose-neutral max-w-none">
              {formData.description ? (
                <p className="text-neutral-700 leading-relaxed break-words">
                  {formData.description}
                </p>
              ) : (
                <p className="text-neutral-400 italic break-words">
                  Keine Beschreibung angegeben
                </p>
              )}
            </div>
          </div>

          {/* Warum es funktioniert */}
          {formData.why_it_works && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-amber-900 flex items-center gap-2 break-words">
                <Brain className="w-5 h-5" />
                Warum es funktioniert
              </h3>
              <p className="text-amber-800 leading-relaxed break-words">
                {formData.why_it_works}
              </p>
            </div>
          )}

          {/* Tools */}
          {formData.tools && formData.tools.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-neutral-900 break-words">
                Benötigte Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData.tools.map((tool, idx) => (
                  <Badge key={idx} variant="info" className="text-sm break-words max-w-full whitespace-normal">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Steps */}
          {formData.steps && formData.steps.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-neutral-900 break-words">
                Schritt-für-Schritt Anleitung
              </h3>
              <div className="space-y-3">
                {formData.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      {idx + 1}
                    </div>
                    <p className="text-neutral-700 leading-relaxed pt-0.5 break-words">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examples */}
          {formData.examples && formData.examples.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-neutral-900 break-words">
                Praktische Beispiele
              </h3>
              <div className="space-y-3">
                {formData.examples.map((example, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full mt-2" />
                    <p className="text-green-800 leading-relaxed break-words">
                      {example}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State for Optional Sections */}
          {(!formData.steps || formData.steps.length === 0) && 
           (!formData.examples || formData.examples.length === 0) && 
           !formData.why_it_works && (
            <div className="text-center py-8 text-neutral-400">
              <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm break-words">
                Füge Schritte, Beispiele oder eine Erklärung hinzu, um deinen Trick noch hilfreicher zu machen
              </p>
            </div>
          )}
        </div>

        {/* Card Footer */}
  <div className="bg-muted/50 px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-neutral-400 flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <span className="break-words">Kategorie: {categoryMeta.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="break-words whitespace-nowrap">Bereit zur Einreichung</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}