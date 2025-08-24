import { Category } from '../types/types'

// Category labels for German translation
export const categoryLabels: Record<Category, string> = {
  'vertrieb': 'Vertrieb',
  'marketing': 'Marketing',
  'personal': 'Personal',
  'finanzen': 'Finanzen',
  'operations': 'Operations',
  'it-entwicklung': 'IT & Entwicklung',
  'kundenservice': 'Kundenservice',
  'produktion': 'Produktion'
}

// Category emojis for visual representation
export const categoryEmojis: Record<Category, string> = {
  'vertrieb': '💰',
  'marketing': '📢',
  'personal': '👥',
  'finanzen': '💶',
  'operations': '⚙️',
  'it-entwicklung': '💻',
  'kundenservice': '🎧',
  'produktion': '🏭'
}

// Department tags for DACH companies
export const departmentTags = [
  'Vertrieb',
  'Marketing',
  'HR',
  'Finanzen',
  'IT',
  'Kundenservice',
  'Produktion',
  'Einkauf',
  'Logistik',
  'Qualitätssicherung'
]

// Industry tags for DACH companies
export const industryTags = [
  'Automotive',
  'Maschinenbau',
  'Finanzdienstleistungen',
  'E-Commerce',
  'SaaS',
  'Gesundheitswesen',
  'Einzelhandel',
  'Beratung',
  'Logistik',
  'Fertigung'
]