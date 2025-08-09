import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Category } from '@/lib/types/types'

interface BreadcrumbNavProps {
  category: Category
  categoryLabel: string
  trickTitle: string
}

export const BreadcrumbNav = ({ category, categoryLabel, trickTitle }: BreadcrumbNavProps) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      {/* Mobile: Vertical Layout */}
      <div className="block sm:hidden">
        <ol className="space-y-1">
          <li className="flex items-center space-x-2 text-xs text-neutral-400">
            <Link 
              href="/tricks" 
              className="hover:text-primary-400 transition-colors"
            >
              KI Tricks
            </Link>
            <ChevronRight className="h-3 w-3 text-neutral-500" />
            <Link 
              href={`/tricks?categories=${category}`}
              className="hover:text-primary-400 transition-colors"
            >
              {categoryLabel}
            </Link>
          </li>
          <li className="text-neutral-100 font-medium text-sm leading-tight">
            {trickTitle}
          </li>
        </ol>
      </div>

      {/* Desktop: Horizontal Layout */}
      <ol className="hidden sm:flex items-center space-x-2 text-sm text-neutral-300">
        <li>
          <Link 
            href="/tricks" 
            className="hover:text-primary-400 transition-colors"
          >
            KI Tricks
          </Link>
        </li>
        <li className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-neutral-500" />
          <Link 
            href={`/tricks?categories=${category}`}
            className="hover:text-primary-400 transition-colors"
          >
            {categoryLabel}
          </Link>
        </li>
        <li className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-neutral-500" />
          <span className="text-neutral-100 font-medium truncate max-w-[300px] lg:max-w-[400px]">
            {trickTitle}
          </span>
        </li>
      </ol>
    </nav>
  )
}