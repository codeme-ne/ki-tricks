# Component Implementation Examples

Diese Datei enthält konkrete Implementierungsbeispiele für die neuen Komponenten der Trick-Detail-Seiten.

## 1. BreadcrumbNav Komponente

```tsx
// app/components/molecules/BreadcrumbNav.tsx
'use client'

import Link from 'next/link'
import { Category, categoryMetadata } from '@/app/lib/types'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbNavProps {
  category: Category
  title: string
  className?: string
}

export function BreadcrumbNav({ category, title, className = '' }: BreadcrumbNavProps) {
  const truncatedTitle = title.length > 30 ? `${title.substring(0, 30)}...` : title
  
  return (
    <nav className={`py-4 text-sm text-neutral-500 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link 
            href="/" 
            className="hover:text-neutral-700 transition-colors"
          >
            AI Tricks
          </Link>
        </li>
        <li>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </li>
        <li>
          <Link 
            href={`/tricks?categories=${category}`} 
            className="hover:text-neutral-700 transition-colors"
          >
            {categoryMetadata[category].label}
          </Link>
        </li>
        <li>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </li>
        <li>
          <span className="text-neutral-900 font-medium" aria-current="page">
            {truncatedTitle}
          </span>
        </li>
      </ol>
    </nav>
  )
}
```

## 2. TrickMeta Komponente

```tsx
// app/components/molecules/TrickMeta.tsx
import { AITrick } from '@/app/lib/types'
import { Clock, Wrench, Calendar, Zap } from 'lucide-react'

interface TrickMetaProps {
  trick: AITrick
  className?: string
}

export function TrickMeta({ trick, className = '' }: TrickMetaProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  const metaItems = [
    {
      icon: Clock,
      label: 'Zeitaufwand',
      value: trick.timeToImplement,
      color: 'text-blue-600'
    },
    {
      icon: Wrench,
      label: 'Tools',
      value: trick.tools.join(', '),
      color: 'text-green-600'
    },
    {
      icon: Zap,
      label: 'Impact',
      value: trick.impact === 'high' ? 'Hoch' : trick.impact === 'medium' ? 'Mittel' : 'Niedrig',
      color: trick.impact === 'high' ? 'text-green-600' : trick.impact === 'medium' ? 'text-amber-600' : 'text-gray-600'
    },
    {
      icon: Calendar,
      label: 'Veröffentlicht',
      value: formatDate(trick.createdAt),
      color: 'text-gray-600'
    }
  ]

  return (
    <div className={`p-6 bg-neutral-50 rounded-lg border border-neutral-200 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metaItems.map((item, index) => (
          <div key={index} className="flex items-start space-x-3">
            <item.icon className={`w-5 h-5 mt-0.5 ${item.color} flex-shrink-0`} />
            <div className="min-w-0 flex-1">
              <dt className="text-sm font-medium text-neutral-700 mb-1">
                {item.label}
              </dt>
              <dd className="text-sm text-neutral-900 font-semibold">
                {item.value}
              </dd>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 3. StepCard Komponente

```tsx
// app/components/molecules/StepCard.tsx
import { CheckCircle } from 'lucide-react'

interface StepCardProps {
  step: string
  number: number
  isCompleted?: boolean
  className?: string
}

export function StepCard({ step, number, isCompleted = false, className = '' }: StepCardProps) {
  return (
    <div className={`group relative ${className}`}>
      <div className="flex items-start space-x-4 p-6 bg-white border border-neutral-200 rounded-lg transition-all duration-200 hover:shadow-md hover:border-primary-200">
        {/* Step Number */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
          isCompleted 
            ? 'bg-green-100 text-green-700' 
            : 'bg-primary-100 text-primary-700 group-hover:bg-primary-200'
        }`}>
          {isCompleted ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            number
          )}
        </div>
        
        {/* Step Content */}
        <div className="flex-1 min-w-0">
          <p className="text-neutral-700 leading-relaxed">
            {step}
          </p>
        </div>
      </div>
      
      {/* Connecting Line for multiple steps */}
      <div className="absolute left-5 top-16 w-0.5 h-6 bg-neutral-200 -z-10 group-last:hidden" />
    </div>
  )
}
```

## 4. ExampleCard Komponente

```tsx
// app/components/molecules/ExampleCard.tsx
import { Lightbulb } from 'lucide-react'

interface ExampleCardProps {
  example: string
  className?: string
}

export function ExampleCard({ example, className = '' }: ExampleCardProps) {
  return (
    <div className={`relative p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-r-lg ${className}`}>
      <div className="flex items-start space-x-3">
        <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-neutral-700 italic leading-relaxed">
          "{example}"
        </p>
      </div>
    </div>
  )
}
```

## 5. BackButton Komponente

```tsx
// app/components/atoms/BackButton.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/atoms'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  fallbackHref?: string
  className?: string
}

export function BackButton({ fallbackHref = '/tricks', className = '' }: BackButtonProps) {
  const router = useRouter()
  
  const handleBack = () => {
    // Try to go back in history, fallback to tricks page
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackHref)
    }
  }
  
  return (
    <Button 
      variant="text" 
      size="sm"
      onClick={handleBack}
      className={`text-primary-600 hover:text-primary-700 ${className}`}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Zurück
    </Button>
  )
}
```

## 6. TrickHeader Komponente

```tsx
// app/components/organisms/TrickHeader.tsx
import { AITrick, categoryMetadata, difficultyMetadata, impactMetadata } from '@/app/lib/types'
import { Badge } from '@/app/components/atoms'
import { BackButton } from '@/app/components/atoms/BackButton'
import { TrickMeta } from '@/app/components/molecules/TrickMeta'

interface TrickHeaderProps {
  trick: AITrick
  className?: string
}

export function TrickHeader({ trick, className = '' }: TrickHeaderProps) {
  return (
    <header className={`mb-8 ${className}`}>
      {/* Back Button */}
      <div className="mb-6">
        <BackButton />
      </div>
      
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-6 leading-tight">
        {trick.title}
      </h1>
      
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Badge className={categoryMetadata[trick.category].color}>
          <span className="mr-2">{categoryMetadata[trick.category].icon}</span>
          {categoryMetadata[trick.category].label}
        </Badge>
        <Badge className={difficultyMetadata[trick.difficulty].color}>
          {difficultyMetadata[trick.difficulty].label}
        </Badge>
        <Badge className={impactMetadata[trick.impact].color}>
          {impactMetadata[trick.impact].label}
        </Badge>
      </div>
      
      {/* Meta Information */}
      <TrickMeta trick={trick} />
    </header>
  )
}
```

## 7. Haupt-Page Komponente

```tsx
// app/trick/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getTrickBySlug, getRelatedTricks } from '@/app/lib/mock-data'
import { PageContainer } from '@/app/components/layout'
import { BreadcrumbNav } from '@/app/components/molecules/BreadcrumbNav'
import { TrickHeader } from '@/app/components/organisms/TrickHeader'
import { TrickContent } from '@/app/components/organisms/TrickContent'
import { RelatedTricks } from '@/app/components/organisms/RelatedTricks'

interface TrickDetailPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: TrickDetailPageProps): Promise<Metadata> {
  const trick = getTrickBySlug(params.slug)
  
  if (!trick) {
    return {
      title: 'Trick nicht gefunden | AI Tricks'
    }
  }
  
  return {
    title: `${trick.title} | AI Tricks`,
    description: trick.description,
    openGraph: {
      title: trick.title,
      description: trick.description,
      type: 'article',
      publishedTime: trick.createdAt.toISOString(),
      modifiedTime: trick.updatedAt.toISOString(),
      tags: [trick.category, ...trick.tools],
    },
    keywords: [trick.category, ...trick.tools, 'AI', 'Tricks', 'Produktivität'].join(', ')
  }
}

export default function TrickDetailPage({ params }: TrickDetailPageProps) {
  const trick = getTrickBySlug(params.slug)
  
  if (!trick) {
    notFound()
  }
  
  const relatedTricks = getRelatedTricks(trick, 3)
  
  return (
    <PageContainer className="max-w-4xl">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav category={trick.category} title={trick.title} />
      
      {/* Main Content */}
      <article>
        <TrickHeader trick={trick} />
        <TrickContent trick={trick} />
      </article>
      
      {/* Related Tricks */}
      {relatedTricks.length > 0 && (
        <RelatedTricks currentTrick={trick} tricks={relatedTricks} />
      )}
    </PageContainer>
  )
}

// Generate static params for all tricks
export function generateStaticParams() {
  return mockTricks.map((trick) => ({
    slug: trick.slug,
  }))
}
```

## Layout Responsiveness Examples

### Mobile Layout (< 640px)
```css
/* Breadcrumb Navigation */
.breadcrumb-mobile {
  @apply text-xs px-4 py-3;
}

/* Header */
.trick-header-mobile {
  @apply px-4 space-y-4;
}

.trick-title-mobile {
  @apply text-2xl leading-tight;
}

/* Meta Grid */
.trick-meta-mobile {
  @apply grid-cols-1 gap-3 p-4;
}

/* Steps */
.step-card-mobile {
  @apply p-4 space-x-3;
}

.step-number-mobile {
  @apply w-8 h-8 text-xs;
}
```

### Tablet Layout (640px - 1024px)
```css
.trick-header-tablet {
  @apply px-6 space-y-6;
}

.trick-meta-tablet {
  @apply grid-cols-2 gap-4 p-6;
}

.related-tricks-tablet {
  @apply grid-cols-2 gap-6;
}
```

### Desktop Layout (> 1024px)
```css
.trick-container-desktop {
  @apply max-w-4xl mx-auto px-8;
}

.related-tricks-desktop {
  @apply grid-cols-3 gap-8;
}

.trick-content-desktop {
  @apply prose prose-lg max-w-none;
}
```

## Animation Examples

```css
/* Fade-in Animation für Sections */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-animate {
  animation: fadeInUp 0.6s ease-out forwards;
}

/* Staggered Animation für Steps */
.step-card:nth-child(1) { animation-delay: 0.1s; }
.step-card:nth-child(2) { animation-delay: 0.2s; }
.step-card:nth-child(3) { animation-delay: 0.3s; }

/* Hover Effects */
.step-card:hover {
  @apply shadow-md border-primary-200 transform -translate-y-1;
  transition: all 0.2s ease-out;
}
```

Diese Implementierungsbeispiele bieten eine konkrete Grundlage für die Entwicklung der Trick-Detail-Seiten und folgen den bestehenden Design-Patterns der AI Tricks Platform.