import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { Category } from '@/lib/types/types'

interface BreadcrumbItem {
  label: string
  href: string
  current?: boolean
}

interface BreadcrumbNavProps {
  category?: Category
  categoryLabel?: string
  trickTitle?: string
  items?: BreadcrumbItem[]
}

export const BreadcrumbNav = ({ 
  category, 
  categoryLabel, 
  trickTitle, 
  items 
}: BreadcrumbNavProps) => {
  // Fallback zu altem Interface für Rückwärtskompatibilität
  const breadcrumbItems = items || [
    ...(category && categoryLabel ? [
      { label: 'Alle Tricks', href: '/tricks' },
      { label: categoryLabel, href: `/tricks?categories=${category}` }
    ] : []),
    ...(trickTitle ? [{ label: trickTitle, href: '', current: true }] : [])
  ]

  if (breadcrumbItems.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      {/* Mobile: Vertical Layout */}
      <div className="block sm:hidden">
        <ol className="space-y-1">
          {/* Home Link */}
          <li className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Link 
              href="/" 
              className="flex items-center hover:text-primary transition-colors"
              aria-label="Zur Startseite"
            >
              <Home className="h-3 w-3 mr-1" />
              <span className="sr-only">Startseite</span>
            </Link>
            
            {breadcrumbItems.slice(0, -1).map((item, index) => (
              <div key={item.href} className="flex items-center space-x-2">
                <ChevronRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                <Link 
                  href={item.href}
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </li>
          
          {/* Current Page */}
          {breadcrumbItems.length > 0 && breadcrumbItems[breadcrumbItems.length - 1].current && (
            <li className="text-foreground font-medium text-sm leading-tight">
              <span aria-current="page">
                {breadcrumbItems[breadcrumbItems.length - 1].label}
              </span>
            </li>
          )}
        </ol>
      </div>

      {/* Desktop: Horizontal Layout */}
      <ol className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
        {/* Home Link */}
        <li>
          <Link 
            href="/" 
            className="flex items-center hover:text-primary transition-colors"
            aria-label="Zur Startseite"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Startseite</span>
          </Link>
        </li>
        
        {breadcrumbItems.map((item, index) => (
          <li key={item.href || index} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            {item.current ? (
              <span 
                className="text-foreground font-medium truncate max-w-[300px] lg:max-w-[400px]"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="hover:text-primary transition-colors truncate max-w-[200px] lg:max-w-[300px]"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}