/**
 * Types for duplicate trick detection and warning dialog
 */

export interface SimilarTrick {
  trick: {
    id: string
    title: string
    description: string
  } | null
  overallSimilarity: number
}

export interface DuplicateWarning {
  error: 'duplicate_detected'
  message: string
  similarTricks: SimilarTrick[]
}

export interface DuplicateDialogProps {
  warning: DuplicateWarning | null
  onClose: () => void
  onSubmitAnyway: () => void
  isSubmitting: boolean
}