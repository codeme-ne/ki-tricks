import { Category } from '../types/types'

// Category labels for German translation (aligned with Category union)
export const categoryLabels: Record<Category, string> = {
  'productivity': 'Produktivität',
  'content-creation': 'Content-Erstellung',
  'programming': 'Programmierung',
  'design': 'Design',
  'data-analysis': 'Datenanalyse',
  'learning': 'Lernen',
  'business': 'Business',
  'marketing': 'Marketing'
}

// Category emojis for visual representation
export const categoryEmojis: Record<Category, string> = {
  'productivity': '🚀',
  'content-creation': '✍️',
  'programming': '💻',
  'design': '🎨',
  'data-analysis': '📊',
  'learning': '📚',
  'business': '💼',
  'marketing': '📈'
}

// Optional icon mapping for categories used across pages
export const categoryIcons: Record<Category, string> = {
  'programming': '/icons/categories/programming-code.svg',
  'business': '/icons/categories/business-briefcase.svg',
  'productivity': '/icons/categories/productivity-calendar.svg',
  'learning': '/icons/categories/learning-book.svg',
  'marketing': '/icons/categories/marketing-megaphone.svg',
  'content-creation': '/icons/categories/content-camera.svg',
  'data-analysis': '/icons/categories/data-stats.svg',
  'design': '/icons/categories/design-palette.svg'
}
