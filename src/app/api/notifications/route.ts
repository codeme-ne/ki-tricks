import { NextRequest, NextResponse } from 'next/server'

// This endpoint will be called from the client-side to send email notifications
// since EmailJS only works in browser environment

interface NotificationData {
  trickTitle: string
  trickDescription: string
  trickCategory: string
  trickDifficulty: string
  submissionTime: string
}

export async function POST(request: NextRequest) {
  try {
    const { trickTitle, trickDescription, trickCategory, trickDifficulty }: NotificationData = await request.json()
    
    // Log the notification request
    console.log('Admin notification requested for trick:', trickTitle)
    
    // Return success - the actual email sending will be handled on client-side
    return NextResponse.json({
      success: true,
      message: 'Notification request received',
      data: {
        trickTitle,
        trickDescription,
        trickCategory,
        trickDifficulty,
        submissionTime: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Error processing notification request:', error)
    return NextResponse.json(
      { error: 'Failed to process notification request' },
      { status: 500 }
    )
  }
}