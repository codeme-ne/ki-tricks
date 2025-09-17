import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { TrickCardConfirmationEmail } from '@/emails/TrickCardConfirmationEmail'

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
}) : null

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Webhook secret from Stripe Dashboard
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 503 }
      )
    }

    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature') as string

    // Verify webhook signature
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Initialize Supabase with service role
    const supabase = await createClient()

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Extract metadata
        const { userId, trickId, month, year } = session.metadata || {}

        if (!userId || !trickId || !month || !year) {
          console.error('Missing metadata in checkout session:', session.id)
          break
        }

        // Update reservation status to confirmed
        const { data: reservation, error: updateError } = await supabase
          .from('trick_card_reservations')
          .update({
            status: 'confirmed',
            stripe_payment_intent_id: session.payment_intent as string,
            paid_at: new Date().toISOString(),
          })
          .eq('stripe_checkout_session_id', session.id)
          .select(`
            *,
            ki_tricks (
              id,
              title,
              slug,
              category
            )
          `)
          .single()

        if (updateError) {
          console.error('Failed to update reservation:', updateError)
          break
        }

        // Get user details
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('email, full_name')
          .eq('id', userId)
          .single()

        // Send confirmation email
        if (profile?.email && process.env.RESEND_API_KEY) {
          try {
            await resend!.emails.send({
              from: 'KI Tricks Platform <noreply@ki-tricks.com>',
              to: [profile.email],
              subject: 'Reservierung bestätigt - Trick-Karten Werbung',
              react: TrickCardConfirmationEmail({
                email: profile.email,
                userName: profile.full_name,
                trickTitle: reservation.ki_tricks?.title || 'Trick-Karte',
                month: parseInt(month),
                year: parseInt(year),
                price: 100,
                dashboardLink: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
              }),
            })
          } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError)
            // Don't fail the webhook if email fails
          }
        }

        // Activate reservation if it's for the current month
        const now = new Date()
        const currentMonth = now.getMonth() + 1
        const currentYear = now.getFullYear()

        if (parseInt(month) === currentMonth && parseInt(year) === currentYear) {
          await supabase
            .from('trick_card_reservations')
            .update({ status: 'active' })
            .eq('id', reservation.id)
        }

        console.log(`Payment confirmed for reservation ${reservation.id}`)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session

        // Update reservation status to cancelled
        await supabase
          .from('trick_card_reservations')
          .update({ status: 'cancelled' })
          .eq('stripe_checkout_session_id', session.id)

        console.log(`Checkout session expired: ${session.id}`)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Find and update reservation
        const { data: reservation } = await supabase
          .from('trick_card_reservations')
          .update({ status: 'cancelled' })
          .eq('stripe_payment_intent_id', paymentIntent.id)
          .select()
          .single()

        if (reservation) {
          console.log(`Payment failed for reservation ${reservation.id}`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Stripe requires raw body for webhook verification
export const config = {
  api: {
    bodyParser: false,
  },
}