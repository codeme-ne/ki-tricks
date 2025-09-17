import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
}) : null

// Validation schema
const reservationSchema = z.object({
  userId: z.string().uuid(),
  trickId: z.string().uuid(),
  month: z.number().min(1).max(12),
  year: z.number().min(2025),
})

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { success: false, message: 'Payment system not configured' },
        { status: 503 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const { userId, trickId, month, year } = reservationSchema.parse(body)

    // Initialize Supabase client
    const supabase = await createClient()

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user || user.id !== userId) {
      return NextResponse.json(
        { success: false, message: 'Nicht authentifiziert' },
        { status: 401 }
      )
    }

    // Check if slot is already reserved
    const { data: existingReservation } = await supabase
      .from('trick_card_reservations')
      .select('id')
      .eq('trick_id', trickId)
      .eq('month', month)
      .eq('year', year)
      .in('status', ['pending', 'confirmed', 'active'])
      .single()

    if (existingReservation) {
      return NextResponse.json(
        { success: false, message: 'Dieser Slot ist bereits reserviert' },
        { status: 409 }
      )
    }

    // Get trick details
    const { data: trick, error: trickError } = await supabase
      .from('ki_tricks')
      .select('id, title, slug')
      .eq('id', trickId)
      .single()

    if (trickError || !trick) {
      return NextResponse.json(
        { success: false, message: 'Trick-Karte nicht gefunden' },
        { status: 404 }
      )
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    const monthNames = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ]

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Trick-Karten Werbung: ${trick.title}`,
              description: `Prominente Platzierung für ${monthNames[month - 1]} ${year}`,
              metadata: {
                trickId,
                month: month.toString(),
                year: year.toString(),
              },
            },
            unit_amount: 10000, // 100€ in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      customer_email: profile?.email || user.email,
      metadata: {
        userId,
        trickId,
        month: month.toString(),
        year: year.toString(),
      },
    })

    // Create pending reservation
    const { data: reservation, error: insertError } = await supabase
      .from('trick_card_reservations')
      .insert({
        user_id: userId,
        trick_id: trickId,
        month,
        year,
        price: 100,
        status: 'pending',
        stripe_checkout_session_id: session.id,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Failed to create reservation:', insertError)
      // Cancel Stripe session if database insert fails
      try {
        await stripe.checkout.sessions.expire(session.id)
      } catch (cancelError) {
        console.error('Failed to cancel Stripe session:', cancelError)
      }

      throw new Error('Fehler beim Erstellen der Reservierung')
    }

    return NextResponse.json(
      {
        success: true,
        checkoutUrl: session.url,
        sessionId: session.id,
        reservationId: reservation.id,
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Reservation error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ungültige Eingabedaten',
          errors: error.errors,
        },
        { status: 400 }
      )
    }

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Zahlungsfehler: ' + error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten',
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check reservation status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Session ID required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get reservation by session ID
    const { data: reservation, error } = await supabase
      .from('trick_card_reservations')
      .select(`
        *,
        ki_tricks (
          id,
          title,
          slug,
          category
        )
      `)
      .eq('stripe_checkout_session_id', sessionId)
      .single()

    if (error || !reservation) {
      return NextResponse.json(
        { success: false, message: 'Reservierung nicht gefunden' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        reservation,
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Get reservation error:', error)
    return NextResponse.json(
      { success: false, message: 'Fehler beim Abrufen der Reservierung' },
      { status: 500 }
    )
  }
}