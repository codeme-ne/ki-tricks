import { trackAffiliateClick } from '@/lib/analytics'

// Affiliate link configuration
export interface AffiliateConfig {
  baseUrl: string
  affiliateId?: string
  params?: Record<string, string>
  trackingCode?: string
}

// Supported affiliate programs
export const AFFILIATE_PROGRAMS: Record<string, AffiliateConfig> = {
  // AI Tools
  openai: {
    baseUrl: 'https://openai.com',
    // Note: OpenAI doesn't have a public affiliate program yet
    // This is prepared for when they launch one
  },
  anthropic: {
    baseUrl: 'https://www.anthropic.com',
    // Note: Anthropic doesn't have a public affiliate program yet
  },
  perplexity: {
    baseUrl: 'https://www.perplexity.ai',
    // Note: Add affiliate params when available
  },
  notion: {
    baseUrl: 'https://affiliate-program.notion.so',
    affiliateId: 'YOUR_NOTION_AFFILIATE_ID', // Replace with actual ID
    params: {
      via: 'ki-tricks'
    }
  },
  canva: {
    baseUrl: 'https://partner.canva.com',
    affiliateId: 'YOUR_CANVA_AFFILIATE_ID', // Replace with actual ID
  },
  grammarly: {
    baseUrl: 'https://www.grammarly.com',
    // ShareASale network - add tracking
    trackingCode: 'YOUR_SHAREASALE_ID'
  },

  // Productivity Tools
  zapier: {
    baseUrl: 'https://zapier.com',
    affiliateId: 'YOUR_ZAPIER_AFFILIATE_ID'
  },
  airtable: {
    baseUrl: 'https://airtable.com',
    affiliateId: 'YOUR_AIRTABLE_AFFILIATE_ID'
  },

  // Learning Platforms
  coursera: {
    baseUrl: 'https://click.linksynergy.com/deeplink',
    affiliateId: 'YOUR_COURSERA_AFFILIATE_ID'
  },
  udemy: {
    baseUrl: 'https://www.udemy.com',
    affiliateId: 'YOUR_UDEMY_AFFILIATE_ID'
  },

  // Generic affiliate networks
  amazon: {
    baseUrl: 'https://www.amazon.de',
    affiliateId: 'YOUR_AMAZON_ASSOCIATE_ID',
    params: {
      tag: 'YOUR_AMAZON_TAG'
    }
  }
}

// Build affiliate URL
export function buildAffiliateUrl(
  tool: string,
  destination: string = '',
  context: {
    trickId?: string
    position?: string
    campaign?: string
  } = {}
): string {
  const affiliate = AFFILIATE_PROGRAMS[tool.toLowerCase()]

  if (!affiliate) {
    // Return original URL if no affiliate program configured
    return destination || `https://www.${tool.toLowerCase()}.com`
  }

  let url = new URL(affiliate.baseUrl)

  // Add destination path
  if (destination && !destination.startsWith('http')) {
    url.pathname = destination
  } else if (destination) {
    url = new URL(destination)
  }

  // Add affiliate parameters
  if (affiliate.affiliateId) {
    url.searchParams.append('ref', affiliate.affiliateId)
  }

  if (affiliate.params) {
    Object.entries(affiliate.params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

  // Add tracking parameters
  if (context.trickId) {
    url.searchParams.append('utm_source', 'ki-tricks')
    url.searchParams.append('utm_medium', 'affiliate')
    url.searchParams.append('utm_campaign', context.campaign || 'trick-recommendation')
    url.searchParams.append('utm_content', context.trickId)
  }

  return url.toString()
}

// Track affiliate click and redirect
export function handleAffiliateClick(
  tool: string,
  destination: string = '',
  context: {
    trickId?: string
    position?: string
    campaign?: string
  } = {}
): string {
  // Track the click for analytics
  trackAffiliateClick(tool, context.position || 'unknown', context.trickId)

  // Return the affiliate URL
  return buildAffiliateUrl(tool, destination, context)
}

// Component helper for affiliate links
export interface AffiliateLinkProps {
  tool: string
  destination?: string
  children: React.ReactNode
  className?: string
  trickId?: string
  position?: string
  campaign?: string
  target?: string
  rel?: string
}

// Get commission info for display
export function getCommissionInfo(tool: string): {
  hasProgram: boolean
  commissionRate?: string
  network?: string
} {
  const affiliate = AFFILIATE_PROGRAMS[tool.toLowerCase()]

  if (!affiliate) {
    return { hasProgram: false }
  }

  // Commission rates (approximate - update with actual rates)
  const rates: Record<string, string> = {
    notion: '50%',
    canva: '50%',
    grammarly: '30%',
    zapier: '25%',
    airtable: '20%',
    coursera: '10-45%',
    udemy: '15%',
    amazon: '1-10%'
  }

  const networks: Record<string, string> = {
    notion: 'Direct',
    canva: 'Direct',
    grammarly: 'ShareASale',
    zapier: 'Direct',
    coursera: 'LinkShare',
    udemy: 'Direct',
    amazon: 'Amazon Associates'
  }

  return {
    hasProgram: true,
    commissionRate: rates[tool.toLowerCase()],
    network: networks[tool.toLowerCase()]
  }
}

// Get popular affiliate tools for the sidebar
export function getPopularAffiliateTools(): Array<{
  name: string
  description: string
  category: string
  commissionRate: string
  hasFreeTier: boolean
}> {
  return [
    {
      name: 'Notion',
      description: 'All-in-one workspace for notes, tasks, and databases',
      category: 'Productivity',
      commissionRate: '50%',
      hasFreeTier: true
    },
    {
      name: 'Canva',
      description: 'Design tool for graphics, presentations, and social media',
      category: 'Design',
      commissionRate: '50%',
      hasFreeTier: true
    },
    {
      name: 'Grammarly',
      description: 'AI-powered writing assistant for grammar and style',
      category: 'Writing',
      commissionRate: '30%',
      hasFreeTier: true
    },
    {
      name: 'Zapier',
      description: 'Automation platform connecting 5000+ apps',
      category: 'Automation',
      commissionRate: '25%',
      hasFreeTier: true
    }
  ]
}

// Validate affiliate configuration
export function validateAffiliateSetup(): {
  configured: string[]
  missing: string[]
  warnings: string[]
} {
  const configured: string[] = []
  const missing: string[] = []
  const warnings: string[] = []

  Object.entries(AFFILIATE_PROGRAMS).forEach(([tool, config]) => {
    if (config.affiliateId && !config.affiliateId.startsWith('YOUR_')) {
      configured.push(tool)
    } else if (config.affiliateId?.startsWith('YOUR_')) {
      missing.push(tool)
    } else {
      warnings.push(`${tool}: No affiliate program available yet`)
    }
  })

  return { configured, missing, warnings }
}