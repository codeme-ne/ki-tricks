import { Category } from '../types/types'

// Category labels (German) for Category union
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
  'productivity': '�',
  'content-creation': '✍️',
  'programming': '�',
  'design': '🎨',
  'data-analysis': '📊',
  'learning': '�',
  'business': '💼',
  'marketing': '📈'
}