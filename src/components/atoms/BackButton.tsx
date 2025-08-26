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
  className="gap-2 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200 w-auto shrink-0"
      aria-label="Zurück zur Tricks-Übersicht"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">Zurück</span>
    </Button>
  )
}