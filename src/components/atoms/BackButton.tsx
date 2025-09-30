'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from './Button'

export const BackButton = () => {
  const router = useRouter()

  return (
    <Button
      variant="primary"
      size="sm"
      onClick={() => router.push('/tricks')}
  className="gap-2 bg-white dark:bg-gray-900 hover:bg-neutral-50 dark:hover:bg-gray-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-gray-700 w-auto shrink-0"
      aria-label="Zurück zur Tricks-Übersicht"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">Zurück</span>
    </Button>
  )
}