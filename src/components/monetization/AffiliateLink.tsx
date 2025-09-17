'use client'

import React from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { handleAffiliateClick, AffiliateLinkProps } from '@/lib/utils/affiliate-links'

export const AffiliateLink: React.FC<AffiliateLinkProps> = ({
  tool,
  destination = '',
  children,
  className = '',
  trickId,
  position = 'content',
  campaign,
  target = '_blank',
  rel = 'noopener noreferrer sponsored'
}) => {
  const handleClick = () => {
    const url = handleAffiliateClick(tool, destination, {
      trickId,
      position,
      campaign
    })

    // Open in new tab for external links
    if (target === '_blank') {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = url
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1 ${className}`}
      type="button"
    >
      {children}
      <ExternalLink className="w-3 h-3 opacity-60" />
    </button>
  )
}

// Tool recommendation card component
interface ToolRecommendationProps {
  tool: string
  title: string
  description: string
  price?: string
  features: string[]
  trickId?: string
  position?: string
  className?: string
}

export const ToolRecommendation: React.FC<ToolRecommendationProps> = ({
  tool,
  title,
  description,
  price = 'Kostenlos verfügbar',
  features,
  trickId,
  position = 'recommendation_card',
  className = ''
}) => {
  return (
    <div className={`border border-gray-200 rounded-lg p-4 bg-gray-50/50 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap ml-2">
          {price}
        </span>
      </div>

      <ul className="text-sm text-gray-600 mb-4 space-y-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <AffiliateLink
        tool={tool}
        trickId={trickId}
        position={position}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors text-center"
      >
        {tool} ausprobieren
      </AffiliateLink>

      <p className="text-xs text-gray-500 mt-2 text-center">
        * Affiliate-Link: Wir erhalten eine kleine Provision, wenn du über diesen Link kaufst.
      </p>
    </div>
  )
}

// Inline tool mention component
interface InlineToolMentionProps {
  tool: string
  children: React.ReactNode
  trickId?: string
  className?: string
}

export const InlineToolMention: React.FC<InlineToolMentionProps> = ({
  tool,
  children,
  trickId,
  className = ''
}) => {
  return (
    <AffiliateLink
      tool={tool}
      trickId={trickId}
      position="inline_mention"
      className={`text-blue-600 hover:text-blue-800 underline font-medium ${className}`}
    >
      {children}
    </AffiliateLink>
  )
}

export default AffiliateLink