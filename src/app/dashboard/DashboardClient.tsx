'use client'

import React, { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/atoms'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrickCardReservation } from '@/components/organisms/TrickCardReservation'
import { DashboardHeader } from '@/components/organisms/DashboardHeader'
import {
  Calendar,
  CreditCard,
  BarChart3,
  Settings,
  Plus,
  Eye,
  DollarSign,
  TrendingUp
} from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

interface DashboardClientProps {
  user: User
  profile: any
  campaigns: any[]
  reservations: any[]
}

export default function DashboardClient({
  user,
  profile,
  campaigns,
  reservations
}: DashboardClientProps) {
  const [selectedTab, setSelectedTab] = useState('overview')

  // Calculate stats
  const activeReservations = reservations.filter(r => r.status === 'active').length
  const totalSpent = reservations
    .filter(r => r.status === 'active' || r.status === 'expired')
    .reduce((sum, r) => sum + (r.price || 0), 0)
  const upcomingReservations = reservations.filter(r => r.status === 'confirmed').length

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Willkommen zurück, {profile?.full_name || user.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600 mt-2">
            Verwalte deine Trick-Karten Reservierungen und sieh deine Performance.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Aktive Reservierungen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{activeReservations}</span>
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Kommende Reservierungen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{upcomingReservations}</span>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Ausgaben gesamt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{totalSpent}€</span>
                <DollarSign className="w-5 h-5 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Kampagnen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{campaigns.length}</span>
                <BarChart3 className="w-5 h-5 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="reservations">Reservierungen</TabsTrigger>
            <TabsTrigger value="new-booking">Neu buchen</TabsTrigger>
            <TabsTrigger value="settings">Einstellungen</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Aktuelle Reservierungen</CardTitle>
              </CardHeader>
              <CardContent>
                {reservations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      Du hast noch keine Trick-Karten Reservierungen.
                    </p>
                    <Button
                      onClick={() => setSelectedTab('new-booking')}
                      className="inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Erste Reservierung anlegen
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reservations.slice(0, 3).map((reservation) => (
                      <div
                        key={reservation.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div>
                          <h4 className="font-semibold">
                            {reservation.ki_tricks?.title || 'Trick-Karte'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {format(new Date(reservation.created_at), 'PPP', { locale: de })}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                            ${reservation.status === 'active' ? 'bg-green-100 text-green-800' :
                              reservation.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'}`}>
                            {reservation.status === 'active' ? 'Aktiv' :
                             reservation.status === 'confirmed' ? 'Bestätigt' :
                             reservation.status}
                          </span>
                          <p className="text-sm font-semibold mt-1">{reservation.price}€</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alle Reservierungen</CardTitle>
              </CardHeader>
              <CardContent>
                {reservations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Keine Reservierungen vorhanden.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4">Trick-Karte</th>
                          <th className="text-left py-2 px-4">Monat</th>
                          <th className="text-left py-2 px-4">Status</th>
                          <th className="text-right py-2 px-4">Preis</th>
                          <th className="text-center py-2 px-4">Aktionen</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.map((reservation) => (
                          <tr key={reservation.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium">
                                  {reservation.ki_tricks?.title || 'Trick-Karte'}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {reservation.ki_tricks?.category}
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {reservation.month}/{reservation.year}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                ${reservation.status === 'active' ? 'bg-green-100 text-green-800' :
                                  reservation.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                  reservation.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                                  'bg-red-100 text-red-800'}`}>
                                {reservation.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-semibold">
                              {reservation.price}€
                            </td>
                            <td className="py-3 px-4 text-center">
                              {reservation.ki_tricks && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(`/trick/${reservation.ki_tricks.slug}`, '_blank')}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* New Booking Tab */}
          <TabsContent value="new-booking">
            <TrickCardReservation userId={user.id} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profil-Einstellungen</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-Mail
                    </label>
                    <input
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vollständiger Name
                    </label>
                    <input
                      type="text"
                      placeholder="Dein Name"
                      defaultValue={profile?.full_name || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unternehmen
                    </label>
                    <input
                      type="text"
                      placeholder="Dein Unternehmen (optional)"
                      defaultValue={profile?.company || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <Button type="submit">
                    Einstellungen speichern
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}