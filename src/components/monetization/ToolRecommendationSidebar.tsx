'use client'

import React from 'react'
import { Sparkles, TrendingUp, Star } from 'lucide-react'
import { ToolRecommendation } from './AffiliateLink'

interface ToolRecommendationSidebarProps {
  trickId?: string
  category?: string
  tools?: string[]
  className?: string
}

export const ToolRecommendationSidebar: React.FC<ToolRecommendationSidebarProps> = ({
  trickId,
  category,
  tools = [],
  className = ''
}) => {
  // Get recommended tools based on category and current tools
  const getRecommendedTools = () => {
    const recommendations = [
      {
        tool: 'notion',
        title: 'Notion',
        description: 'All-in-one workspace für Notizen, Aufgaben und Datenbanken',
        price: 'Kostenlos starten',
        features: [
          'Unbegrenzte Seiten für Einzelpersonen',
          'KI-Assistent integriert',
          'Templates für jeden Anwendungsfall',
          'Real-time Collaboration'
        ],
        categories: ['productivity', 'business', 'learning']
      },
      {
        tool: 'canva',
        title: 'Canva',
        description: 'Design-Tool für Grafiken, Präsentationen und Social Media',
        price: 'Kostenlos starten',
        features: [
          'Über 1 Million Templates',
          'KI-Design-Assistent',
          'Brand Kit für Konsistenz',
          'Automatische Größenänderung'
        ],
        categories: ['design', 'content-creation', 'marketing']
      },
      {
        tool: 'grammarly',
        title: 'Grammarly',
        description: 'KI-Schreibassistent für Grammatik und Stil',
        price: 'Kostenlos testen',
        features: [
          'Grammatik- und Rechtschreibprüfung',
          'Stil-Verbesserungen',
          'Tonfall-Anpassung',
          'Plagiatsprüfung (Premium)'
        ],
        categories: ['content-creation', 'productivity', 'business']
      },
      {
        tool: 'zapier',
        title: 'Zapier',
        description: 'Automatisierung zwischen 5000+ Apps',
        price: 'Kostenlos starten',
        features: [
          '100 Tasks/Monat kostenlos',
          '5000+ App-Integrationen',
          'Multi-Step Workflows',
          'AI-powered Automation'
        ],
        categories: ['productivity', 'business', 'programming']
      }
    ]

    // Filter recommendations based on category
    let filtered = recommendations
    if (category) {
      filtered = recommendations.filter(rec =>
        rec.categories.includes(category)
      )
    }

    // Remove tools that are already mentioned in the current trick
    if (tools.length > 0) {
      filtered = filtered.filter(rec =>
        !tools.some(tool => tool.toLowerCase().includes(rec.tool))
      )
    }

    return filtered.slice(0, 2) // Show max 2 recommendations
  }

  const recommendedTools = getRecommendedTools()

  if (recommendedTools.length === 0) {
    return null
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 text-gray-900 font-semibold">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <span>Empfohlene Tools</span>
      </div>

      {/* Tool recommendations */}
      <div className="space-y-4">
        {recommendedTools.map((tool, index) => (
          <ToolRecommendation
            key={tool.tool}
            tool={tool.tool}
            title={tool.title}
            description={tool.description}
            price={tool.price}
            features={tool.features}
            trickId={trickId}
            position={`sidebar_${index + 1}`}
          />
        ))}
      </div>

      {/* Popular tools section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2 text-gray-900 font-semibold mb-4">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span>Beliebteste Tools</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">ChatGPT</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-gray-500">4.8</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Claude</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-gray-500">4.9</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Notion</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-gray-500">4.7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter upsell */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900 mb-1">
            💡 Neue Tools entdecken
          </div>
          <div className="text-xs text-gray-600 mb-3">
            Erhalte wöchentlich Empfehlungen für die besten KI-Tools
          </div>
          <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors">
            Newsletter abonnieren
          </button>
        </div>
      </div>
    </div>
  )
}

export default ToolRecommendationSidebar