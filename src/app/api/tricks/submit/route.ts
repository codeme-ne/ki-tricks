import { NextRequest, NextResponse } from 'next/server'
import { SubmissionsService } from '@/lib/services/submissions.service'
import { sendNewTrickNotification } from '@/lib/utils/email-notifications'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { trickData, submitterInfo } = body
    
    if (!trickData || !trickData.title || !trickData.description) {
      return NextResponse.json(
        { error: 'Titel und Beschreibung sind erforderlich' },
        { status: 400 }
      )
    }
    
    // Submit trick to Supabase
    const submission = await SubmissionsService.submitTrick(trickData, submitterInfo)
    
    // Send notification email (non-blocking)
    sendNewTrickNotification({
      title: trickData.title,
      description: trickData.description,
      category: trickData.category,
      difficulty: trickData.difficulty || 'intermediate'
    }).catch(console.error)
    
    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        status: submission.status,
        qualityScore: submission.quality_score
      }
    })
  } catch (error) {
    console.error('Error submitting trick:', error)
    return NextResponse.json(
      { error: 'Fehler beim Einreichen des Tricks' },
      { status: 500 }
    )
  }
}