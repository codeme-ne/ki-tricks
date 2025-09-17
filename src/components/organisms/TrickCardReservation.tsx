'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/atoms'
import { Calendar, CreditCard, Info, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format, addMonths } from 'date-fns'
import { de } from 'date-fns/locale'

interface TrickCardReservationProps {
  userId: string
}

export const TrickCardReservation: React.FC<TrickCardReservationProps> = ({ userId }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedTrick, setSelectedTrick] = useState<string>('')
  const [tricks, setTricks] = useState<any[]>([])
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  // Fetch available tricks
  useEffect(() => {
    const fetchTricks = async () => {
      const { data, error } = await supabase
        .from('ki_tricks')
        .select('id, title, category, slug')
        .eq('status', 'published')
        .order('title')

      if (data) {
        setTricks(data)
      }
    }

    fetchTricks()
  }, [supabase])

  // Check available slots for selected month
  useEffect(() => {
    const checkAvailability = async () => {
      const { data, error } = await supabase
        .from('trick_card_reservations')
        .select('trick_id')
        .eq('month', selectedMonth)
        .eq('year', selectedYear)
        .in('status', ['confirmed', 'active'])

      if (data) {
        const reservedTrickIds = data.map(r => r.trick_id)
        const available = tricks.filter(t => !reservedTrickIds.includes(t.id))
        setAvailableSlots(available)
      }
    }

    if (tricks.length > 0) {
      checkAvailability()
    }
  }, [selectedMonth, selectedYear, tricks, supabase])

  const handleReservation = async () => {
    if (!selectedTrick) {
      setError('Bitte wähle eine Trick-Karte aus')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Create Stripe checkout session via API
      const response = await fetch('/api/dashboard/reserve-trick-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          trickId: selectedTrick,
          month: selectedMonth,
          year: selectedYear,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Fehler bei der Reservierung')
      }

      // Redirect to Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setIsLoading(false)
    }
  }

  // Generate next 6 months options
  const monthOptions = Array.from({ length: 6 }, (_, i) => {
    const date = addMonths(new Date(), i)
    return {
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      label: format(date, 'MMMM yyyy', { locale: de }),
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Neue Trick-Karten Reservierung</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Trick-Karten Werbung</p>
              <p>
                Buche eine prominente Platzierung für deine KI-Tricks.
                Deine Karte wird den ganzen Monat hervorgehoben angezeigt.
              </p>
              <p className="mt-2">
                <strong>Preis:</strong> 100€ pro Monat und Trick-Karte
              </p>
            </div>
          </div>
        </div>

        {/* Month Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Monat auswählen
          </label>
          <select
            value={`${selectedMonth}-${selectedYear}`}
            onChange={(e) => {
              const [month, year] = e.target.value.split('-').map(Number)
              setSelectedMonth(month)
              setSelectedYear(year)
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            {monthOptions.map((option) => (
              <option key={`${option.month}-${option.year}`} value={`${option.month}-${option.year}`}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Trick Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trick-Karte auswählen
          </label>
          {availableSlots.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                Für {monthOptions.find(o => o.month === selectedMonth && o.year === selectedYear)?.label}
                sind keine Slots mehr verfügbar.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Bitte wähle einen anderen Monat.
              </p>
            </div>
          ) : (
            <select
              value={selectedTrick}
              onChange={(e) => setSelectedTrick(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Wähle eine Trick-Karte --</option>
              {availableSlots.map((trick) => (
                <option key={trick.id} value={trick.id}>
                  {trick.title} ({trick.category})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Available Slots Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            <strong>Verfügbare Slots:</strong> {availableSlots.length} von {tricks.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Pro Monat kann jede Trick-Karte nur einmal als Werbung gebucht werden.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedTrick('')
              setError('')
            }}
            disabled={isLoading}
          >
            Zurücksetzen
          </Button>
          <Button
            onClick={handleReservation}
            disabled={isLoading || !selectedTrick || availableSlots.length === 0}
            className="inline-flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verarbeite...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Zur Bezahlung (100€)
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default TrickCardReservation