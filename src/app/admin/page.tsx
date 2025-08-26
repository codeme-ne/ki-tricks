'use client'

import { useState, useEffect } from 'react'
import { PageContainer } from '@/components/layout'
import { Button } from '@/components/atoms'
import { AdminAuth } from '@/lib/utils/admin-auth'
import { 
  Clock, 
  CheckCircle, 
  PlusCircle, 
  BarChart3, 
  ArrowRight,
  LogOut,
  Settings
} from 'lucide-react'
import Link from 'next/link'

interface AdminStats {
  pendingCount: number
  approvedToday: number
  rejectedToday: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      const authToken = await AdminAuth.authenticateWithPrompt()
      if (!authToken) {
        setError('Authentifizierung fehlgeschlagen')
        setLoading(false)
        return
      }

      // Get basic stats
      const response = await fetch('/api/tricks', {
        headers: {
          'Authorization': `Basic ${authToken}`
        }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          AdminAuth.clearSession()
          setError('Session abgelaufen. Bitte neu anmelden.')
        } else {
          throw new Error('Fehler beim Laden der Statistiken')
        }
        return
      }
      
      AdminAuth.extendSession()
      
      const tricks = await response.json()
      const today = new Date().toDateString()
      
      setStats({
        pendingCount: tricks.filter((t: any) => t.status !== 'rejected').length,
        approvedToday: 0, // Would need additional API to track daily approvals
        rejectedToday: 0  // Would need additional API to track daily rejections
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleLogout = () => {
    AdminAuth.clearSession()
    window.location.reload()
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-400">Lade Admin-Dashboard...</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-100 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-lg text-neutral-400">
              Verwaltung der KI-Tricks Plattform
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Abmelden
          </Button>
        </div>

        {error ? (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 mb-8">
            <p className="text-red-300">{error}</p>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            {stats && (
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-800/50 rounded-lg">
                      <Clock className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-neutral-400">Wartende Tricks</p>
                      <p className="text-2xl font-bold text-neutral-100">{stats.pendingCount}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-800/50 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-neutral-400">Heute freigegeben</p>
                      <p className="text-2xl font-bold text-neutral-100">{stats.approvedToday}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-800/50 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-neutral-400">Analytics</p>
                      <p className="text-sm text-neutral-500">Detaillierte Statistiken</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Actions */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Moderation */}
              <div className="bg-card border border-border rounded-lg p-6 transition-shadow hover:shadow-lg hover:shadow-black/10">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-100 mb-2">
                      Tricks moderieren
                    </h3>
                    <p className="text-neutral-400 mb-4">
                      Eingereichte Tricks prüfen, freigeben oder ablehnen
                    </p>
                    {stats && stats.pendingCount > 0 && (
                      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-300">
                          ⏳ {stats.pendingCount} Tricks warten auf Moderation
                        </p>
                      </div>
                    )}
                  </div>
                  <Clock className="w-8 h-8 text-blue-400 flex-shrink-0" />
                </div>
                <Link 
                  href="/admin/tricks/pending"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  Zur Moderation
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {/* Analytics */}
              <div className="bg-card border border-border rounded-lg p-6 transition-shadow hover:shadow-lg hover:shadow-black/10">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-100 mb-2">
                      Analytics & Statistiken
                    </h3>
                    <p className="text-neutral-400 mb-4">
                      Detaillierte Einblicke in Einreichungen und Performance
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-400 flex-shrink-0" />
                </div>
                <Link 
                  href="/admin/analytics"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  Analytics öffnen
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Secondary Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <PlusCircle className="w-5 h-5 text-neutral-400 mr-2" />
                  <h4 className="font-medium text-neutral-100">Neuer Trick</h4>
                </div>
                <p className="text-sm text-neutral-400 mb-3">
                  Manuell einen neuen Trick hinzufügen
                </p>
                <Link 
                  href="/admin/tricks/new"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Trick erstellen →
                </Link>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Settings className="w-5 h-5 text-neutral-400 mr-2" />
                  <h4 className="font-medium text-neutral-100">Einstellungen</h4>
                </div>
                <p className="text-sm text-neutral-400 mb-3">
                  Plattform-Konfiguration verwalten
                </p>
                <span className="text-sm text-neutral-400">
                  Coming soon
                </span>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <CheckCircle className="w-5 h-5 text-neutral-400 mr-2" />
                  <h4 className="font-medium text-neutral-100">Merge Tricks</h4>
                </div>
                <p className="text-sm text-neutral-400 mb-3">
                  Freigegebene Tricks in die Hauptdatenbank übernehmen
                </p>
                <button 
                  onClick={() => alert('Führe `npm run merge-tricks` im Terminal aus')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Script ausführen →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  )
}