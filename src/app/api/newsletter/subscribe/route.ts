import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { WelcomeEmail } from '@/emails/WelcomeEmail'
import { generateUnsubscribeToken } from '@/lib/auth/unsubscribe-tokens'

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

    // Initialize Supabase client with service role to bypass RLS
    const supabase = await createClient()
    
    // Create service role client for insert (bypasses RLS)
    const { createClient: createServiceClient } = await import('@supabase/supabase-js')
    const supabaseAdmin = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabaseAdmin
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
        const { error: updateError } = await supabaseAdmin
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

    // Add to Supabase first (we need the ID for token generation)
    const { data: newSubscriber, error: insertError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert({
        email,
        status: 'active', // For now, skip double opt-in
        source,
        lead_magnet: leadMagnet,
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

    // Generate secure unsubscribe token
    const unsubscribeToken = generateUnsubscribeToken(email, newSubscriber.id)

    // Store token in database
    const { error: tokenUpdateError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .update({ verification_token: unsubscribeToken })
      .eq('id', newSubscriber.id)

    if (tokenUpdateError) {
      console.error('Failed to store unsubscribe token:', tokenUpdateError)
      throw new Error('Could not save subscription details. Please try again.')
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
              `${process.env.NEXT_PUBLIC_APP_URL}/download/ki-tricks-guide`,
            unsubscribeToken,
            baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://ki-tricks.com'
          }),
        })

        // Store Resend contact ID if available
        if (emailData?.id) {
          await supabaseAdmin
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

// GET endpoint removed for security (prevents email enumeration)