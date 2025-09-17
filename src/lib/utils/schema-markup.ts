import { KITrick } from '@/lib/types/types'

// Generate Organization Schema
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KI-Tricks',
    description: 'Die führende Plattform für bewährte KI-Tricks, Workflows und Automationen',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ki-tricks.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ki-tricks.com'}/logo.png`,
    sameAs: [
      'https://twitter.com/ki_tricks',
      'https://github.com/ki-tricks',
      'https://linkedin.com/company/ki-tricks'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'kontakt@ki-tricks.com'
    }
  }
}

// Generate Website Schema
export function generateWebsiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ki-tricks.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KI-Tricks',
    description: 'Bewährte KI-Tricks mit Schritt-für-Schritt-Anleitungen',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/tricks?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'KI-Tricks',
      url: baseUrl
    }
  }
}

// Generate Article Schema for individual tricks
export function generateTrickArticleSchema(trick: KITrick, category: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ki-tricks.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: trick.title,
    description: trick.description.split('\n')[0], // First paragraph as description
    author: {
      '@type': 'Organization',
      name: 'KI-Tricks Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'KI-Tricks',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    datePublished: trick.published_at || trick.created_at,
    dateModified: trick.updated_at,
    url: `${baseUrl}/trick/${trick.slug}`,
    mainEntityOfPage: `${baseUrl}/trick/${trick.slug}`,
    articleSection: category,
    keywords: [...trick.tools, category, 'KI', 'AI', 'Automation'].join(', '),
    about: {
      '@type': 'Thing',
      name: category,
      description: `KI-Tricks für ${category}`
    },
    mentions: trick.tools.map(tool => ({
      '@type': 'SoftwareApplication',
      name: tool,
      applicationCategory: 'AI Tool'
    }))
  }
}

// Generate HowTo Schema for step-by-step tricks
export function generateHowToSchema(trick: KITrick) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ki-tricks.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: trick.title,
    description: trick.description.split('\n')[0],
    totalTime: 'PT5M', // Estimated 5 minutes
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'EUR',
      value: '0'
    },
    supply: trick.tools.map(tool => ({
      '@type': 'HowToSupply',
      name: tool
    })),
    tool: trick.tools.map(tool => ({
      '@type': 'HowToTool',
      name: tool
    })),
    step: trick.steps?.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: `Schritt ${index + 1}`,
      text: step,
      url: `${baseUrl}/trick/${trick.slug}#step-${index + 1}`
    })) || []
  }
}

// Generate Collection Schema for category pages
export function generateCategoryCollectionSchema(
  category: string,
  tricks: KITrick[],
  categoryDescription: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ki-tricks.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category} KI-Tricks`,
    description: categoryDescription,
    url: `${baseUrl}/tricks?categories=${category}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: tricks.length,
      itemListElement: tricks.slice(0, 10).map((trick, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${baseUrl}/trick/${trick.slug}`,
        name: trick.title,
        description: trick.description.split('\n')[0]
      }))
    }
  }
}

// Generate FAQ Schema for common questions
export function generateFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Für wen ist KI-Tricks gedacht?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Für Professionals, die mit wenig Zeit schnelle, verlässliche Ergebnisse brauchen – z. B. Consultants, Marketer, Produktteams und Solo-Maker.'
        }
      },
      {
        '@type': 'Question',
        name: 'Sind die Anleitungen kostenlos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ja. Alle veröffentlichten Tricks sind frei zugänglich.'
        }
      },
      {
        '@type': 'Question',
        name: 'Wie werden Tricks ausgewählt?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tricks werden auf Praxistauglichkeit geprüft, klar dokumentiert und kategorisiert. Community-Einsendungen werden redaktionell gesichtet.'
        }
      },
      {
        '@type': 'Question',
        name: 'Kann ich eigene Tricks einreichen?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Gerne – über die Seite "Trick einreichen" können Beiträge vorgeschlagen werden.'
        }
      }
    ]
  }
}

// Generate Software Application Schema for AI tools
export function generateSoftwareApplicationSchema(toolName: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: toolName,
    description: description,
    applicationCategory: 'AI Tool',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock'
    }
  }
}

// Generate BreadcrumbList Schema
export function generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ki-tricks.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${baseUrl}${crumb.url}`
    }))
  }
}

// Generate Review Schema for future user reviews
export function generateAggregateRatingSchema(
  itemName: string,
  averageRating: number,
  reviewCount: number,
  bestRating: number = 5
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'CreativeWork',
      name: itemName
    },
    ratingValue: averageRating,
    reviewCount: reviewCount,
    bestRating: bestRating,
    worstRating: 1
  }
}

// Generate Course Schema for future premium content
export function generateCourseSchema(
  title: string,
  description: string,
  provider: string = 'KI-Tricks'
) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ki-tricks.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description: description,
    provider: {
      '@type': 'Organization',
      name: provider,
      url: baseUrl
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      instructor: {
        '@type': 'Organization',
        name: provider
      }
    }
  }
}

// Utility function to safely stringify JSON-LD
export function safeJSONStringify(obj: any): string {
  try {
    return JSON.stringify(obj, null, 2)
  } catch (error) {
    console.warn('Failed to stringify schema object:', error)
    return '{}'
  }
}