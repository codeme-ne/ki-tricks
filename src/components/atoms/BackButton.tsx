'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from './Button'

export const BackButton = () => {
  const router = useRouter()

  return (
    <Button
      variant="primary"
      onClick={() => router.push('/tricks')}
      className="gap-2 bg-neutral-800/80 hover:bg-neutral-700 text-white border-neutral-600 backdrop-blur-sm"
      aria-label="Zurück zur Tricks-Übersicht"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">Zurück</span>
    </Button>
  )
}