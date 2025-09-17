import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { WelcomeEmail } from '@/emails/WelcomeEmail'

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Validation schema
const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  source: z.string().optional().default('website'),
  leadMagnet: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const { email, source, leadMagnet } = subscribeSchema.parse(body)

    // Initialize Supabase client
    const supabase = await createClient()

    // Check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email)
      .single()

    if (existingSubscriber) {
      // If already subscribed and active, return success
      if (existingSubscriber.status === 'active') {
        return NextResponse.json(
          {
            success: true,
            message: 'Du bist bereits für den Newsletter angemeldet!'
          },
          { status: 200 }
        )
      }

      // If unsubscribed, reactivate
      if (existingSubscriber.status === 'unsubscribed') {
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({
            status: 'active',
            subscribed_at: new Date().toISOString(),
            source,
            lead_magnet: leadMagnet
          })
          .eq('id', existingSubscriber.id)

        if (updateError) {
          throw updateError
        }

        return NextResponse.json(
          {
            success: true,
            message: 'Willkommen zurück! Du bist wieder für den Newsletter angemeldet.'
          },
          { status: 200 }
        )
      }
    }

    // Generate verification token (optional for double opt-in)
    const verificationToken = Math.random().toString(36).substring(2, 15)

    // Add to Supabase
    const { data: newSubscriber, error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        status: 'active', // For now, skip double opt-in
        source,
        lead_magnet: leadMagnet,
        verification_token: verificationToken,
        verified_at: new Date().toISOString(), // Auto-verify for now
      })
      .select()
      .single()

    if (insertError) {
      // Handle duplicate email error
      if (insertError.code === '23505') {
        return NextResponse.json(
          {
            success: false,
            message: 'Diese E-Mail-Adresse ist bereits registriert.'
          },
          { status: 409 }
        )
      }
      throw insertError
    }

    // Send welcome email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const { data: emailData, error: emailError } = await resend!.emails.send({
          from: 'KI Tricks Platform <noreply@ki-tricks.com>',
          to: [email],
          subject: 'Willkommen bei KI Tricks! 🎉',
          react: WelcomeEmail({
            email,
            leadMagnet: leadMagnet || 'Die 50 besten KI-Tricks',
            downloadLink: leadMagnet ?
              `${process.env.NEXT_PUBLIC_APP_URL}/download/${leadMagnet}` :
              `${process.env.NEXT_PUBLIC_APP_URL}/download/ki-tricks-guide`
          }),
        })

        // Store Resend contact ID if available
        if (emailData?.id) {
          await supabase
            .from('newsletter_subscribers')
            .update({ resend_contact_id: emailData.id })
            .eq('id', newSubscriber.id)
        }

        // Add to Resend audience if audience ID is configured
        if (process.env.RESEND_AUDIENCE_ID) {
          try {
            await resend!.contacts.create({
              email,
              audienceId: process.env.RESEND_AUDIENCE_ID,
              firstName: email.split('@')[0], // Use email prefix as name
            })
          } catch (audienceError) {
            console.error('Failed to add to Resend audience:', audienceError)
            // Don't fail the request if audience addition fails
          }
        }
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError)
        // Don't fail the subscription if email fails
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Erfolgreich angemeldet! Prüfe deine E-Mails für weitere Informationen.'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Newsletter subscription error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ungültige Eingabedaten.',
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

// GET endpoint to check subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email parameter required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('status, subscribed_at')
      .eq('email', email)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { subscribed: false },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        subscribed: data.status === 'active',
        status: data.status,
        subscribedAt: data.subscribed_at
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Newsletter status check error:', error)
    return NextResponse.json(
      { success: false, message: 'Error checking subscription status' },
      { status: 500 }
    )
  }
}