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
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-neutral-300">
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
          <span className="text-neutral-100 font-medium truncate max-w-[200px]">
            {trickTitle}
          </span>
        </li>
      </ol>
    </nav>
  )
}