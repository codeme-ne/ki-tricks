import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { verifyUnsubscribeToken } from '@/lib/auth/unsubscribe-tokens'

const unsubscribeSchema = z.object({
  token: z.string().min(1, 'Token is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = unsubscribeSchema.parse(body)

    // Verify and decode token
    let email: string
    let subscriberId: string

    try {
      const result = verifyUnsubscribeToken(token)
      email = result.email
      subscriberId = result.subscriberId
    } catch (tokenError) {
      return NextResponse.json(
        {
          success: false,
          message: tokenError instanceof Error ? tokenError.message : 'Ungültiger oder abgelaufener Abmelde-Link.'
        },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Check if subscriber exists and token matches
    const { data: subscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id, status, verification_token')
      .eq('id', subscriberId)
      .eq('email', email)
      .single()

    if (checkError || !subscriber) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dieser Abonnent wurde nicht gefunden.'
        },
        { status: 404 }
      )
    }

    // Verify token matches (prevents replay attacks)
    if (!subscriber.verification_token || subscriber.verification_token !== token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ungültiger oder bereits verwendeter Abmelde-Link.'
        },
        { status: 401 }
      )
    }

    // Already unsubscribed
    if (subscriber.status === 'unsubscribed') {
      return NextResponse.json(
        {
          success: true,
          message: 'Du bist bereits vom Newsletter abgemeldet.'
        },
        { status: 200 }
      )
    }

    // Update status to unsubscribed and invalidate token
    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'unsubscribed',
        updated_at: new Date().toISOString(),
        verification_token: null, // Invalidate token to prevent reuse
      })
      .eq('id', subscriberId)

    if (updateError) {
      throw updateError
    }

    // TODO: Optional - Remove from Resend audience if configured
    // if (process.env.RESEND_API_KEY && subscriber.resend_contact_id) {
    //   try {
    //     await resend.contacts.remove({
    //       audienceId: process.env.RESEND_AUDIENCE_ID,
    //       id: subscriber.resend_contact_id
    //     })
    //   } catch (error) {
    //     console.error('Failed to remove from Resend:', error)
    //   }
    // }

    return NextResponse.json(
      {
        success: true,
        message: 'Du wurdest erfolgreich vom Newsletter abgemeldet.'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Unsubscribe error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ungültige Anfrage.',
          errors: error.errors
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.'
      },
      { status: 500 }
    )
  }
}

// GET endpoint removed for security (prevents email enumeration)