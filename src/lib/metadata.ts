import { Metadata } from 'next'

interface PageMetadata {
  title: string
  description: string
  keywords?: string
  canonical?: string
  noindex?: boolean
  ogImage?: string
}

export function generateMetadata({
  title,
  description,
  keywords,
  canonical,
  noindex = false,
  ogImage
}: PageMetadata): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ki-tricks.com'
  const fullTitle = `${title} | KI-Tricks Platform`
  const defaultOgImage = `${siteUrl}/og-image.jpg`
  
  return {
    title: fullTitle,
    description,
    keywords,
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      type: 'website',
      locale: 'de_DE',
      url: canonical || siteUrl,
      siteName: 'KI-Tricks Platform',
      images: [
        {
          url: ogImage || defaultOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: '@codeme_ne',
      images: [ogImage || defaultOgImage],
    },
    alternates: {
      canonical: canonical || siteUrl,
    },
    other: {
      'theme-color': '#ffffff',
      'color-scheme': 'light',
    },
  }
}

// Strukturierte Daten für KI-Tricks
export function generateTrickStructuredData(trick: {
  title: string
  description: string
  category: string
  difficulty: string
  timeEstimate: string
  url: string
  datePublished?: string
  dateModified?: string
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ki-tricks.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: trick.title,
    description: trick.description,
    url: `${siteUrl}${trick.url}`,
    datePublished: trick.datePublished || new Date().toISOString(),
    dateModified: trick.dateModified || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'KI-Tricks Platform',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'KI-Tricks Platform',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}${trick.url}`,
    },
    articleSection: trick.category,
    keywords: `KI-Tricks, ${trick.category}, ${trick.difficulty}, Künstliche Intelligenz`,
    about: {
      '@type': 'Thing',
      name: 'Künstliche Intelligenz',
    },
    teaches: trick.title,
    educationalLevel: trick.difficulty,
    timeRequired: trick.timeEstimate,
  }
}

// Strukturierte Daten für die Tricks-Übersichtsseite
export function generateTricksCollectionStructuredData(tricks: Array<{
  title: string
  description: string
  category: string
  url: string
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ki-tricks.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'KI-Tricks Sammlung',
    description: 'Umfassende Sammlung praktischer KI-Tipps und Tricks für den Arbeitsalltag',
    url: `${siteUrl}/tricks`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: tricks.length,
      itemListElement: tricks.map((trick, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Article',
          name: trick.title,
          description: trick.description,
          url: `${siteUrl}${trick.url}`,
          about: {
            '@type': 'Thing',
            name: trick.category,
          },
        },
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Startseite',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'KI-Tricks',
          item: `${siteUrl}/tricks`,
        },
      ],
    },
  }
}