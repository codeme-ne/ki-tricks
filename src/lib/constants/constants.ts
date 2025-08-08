import { Category } from '../types/types'

// Category labels for German translation
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
  'learning': '🎓',
  'business': '💼',
  'marketing': '📢'
}

// Difficulty labels for German translation
export const difficultyLabels = {
  'beginner': 'Anfänger',
  'intermediate': 'Fortgeschritten',
  'advanced': 'Experte'
}

// Difficulty variants for Badge component
export const difficultyVariants = {
  'beginner': 'success' as const,
  'intermediate': 'warning' as const,
  'advanced': 'danger' as const
}