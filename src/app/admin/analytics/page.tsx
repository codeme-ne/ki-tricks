'use client'

import { useState, useEffect } from 'react'
import { PageContainer } from '@/components/layout'
import { Button, Badge } from '@/components/atoms'
import { AdminAuth } from '@/lib/utils/admin-auth'
import { ArrowLeft, TrendingUp, Users, Clock, CheckCircle, X, BarChart } from 'lucide-react'
import Link from 'next/link'

interface AnalyticsData {
  totals: {
    pending: number
    approved: number
    rejected: number
    published: number
  }
  categories: Record<string, number>
  recentSubmissions: Array<{
    date: string
    count: number
  }>
  avgProcessingTime: number
  approvalRate: number
  mostActiveCategories: Array<{
    category: string
    count: number
    percentage: number
  }>
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  const fetchAnalytics = async () => {
    try {
      const authToken = await AdminAuth.authenticateWithPrompt()
      if (!authToken) {
        setError('Authentifizierung fehlgeschlagen')
        setLoading(false)
        return
      }

      const response = await fetch(`/api/analytics?range=${timeRange}`, {
        headers: {
          'Authorization': `Basic ${authToken}`
        }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          AdminAuth.clearSession()
          setError('Session abgelaufen. Bitte neu anmelden.')
        } else {
          throw new Error('Fehler beim Laden der Analytics')
        }
        return
      }
      
      // Extend session on successful request
      AdminAuth.extendSession()
      
      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'productivity': 'Produktivität',
      'content-creation': 'Content-Erstellung',
      'programming': 'Programmierung',
      'design': 'Design',
      'data-analysis': 'Datenanalyse',
      'learning': 'Lernen',
      'business': 'Business',
      'marketing': 'Marketing'
    }
    return labels[category] || category
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-400">Lade Analytics...</p>
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <div className="text-center py-16">
          <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400">{error}</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-100 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zum Admin-Bereich
          </Link>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-neutral-100 mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-lg text-neutral-400">
                Übersicht über eingereichte Tricks und Moderationsstatistiken
              </p>
            </div>
            
            <div>
              <label htmlFor="timeRange" className="block text-sm font-medium text-neutral-300 mb-1">
                Zeitraum
              </label>
              <select
                id="timeRange"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
                className="px-3 py-2 bg-neutral-700 text-neutral-100 border border-neutral-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="7d">Letzte 7 Tage</option>
                <option value="30d">Letzte 30 Tage</option>
                <option value="90d">Letzte 90 Tage</option>
              </select>
            </div>
          </div>
        </div>

        {analytics && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-800/50 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-400">Wartend</p>
                    <p className="text-2xl font-bold text-neutral-100">{analytics.totals.pending}</p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-800/50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-400">Freigegeben</p>
                    <p className="text-2xl font-bold text-neutral-100">{analytics.totals.approved}</p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-800/50 rounded-lg">
                    <X className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-400">Abgelehnt</p>
                    <p className="text-2xl font-bold text-neutral-100">{analytics.totals.rejected}</p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-800/50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-400">Approval Rate</p>
                    <p className="text-2xl font-bold text-neutral-100">{analytics.approvalRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Top Categories */}
              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <BarChart className="w-5 h-5 mr-2" />
                  Beliebteste Kategorien
                </h3>
                <div className="space-y-4">
                  {analytics.mostActiveCategories.map((item, index) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <span className="text-sm font-medium text-neutral-300 w-4 text-center mr-3">
                          {index + 1}
                        </span>
                        <span className="text-sm text-neutral-100">
                          {getCategoryLabel(item.category)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-neutral-700 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-neutral-100 w-8 text-right">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Aktivität der letzten Tage
                </h3>
                <div className="space-y-3">
                  {analytics.recentSubmissions.map((item) => (
                    <div key={item.date} className="flex justify-between items-center">
                      <span className="text-sm text-neutral-400">
                        {new Date(item.date).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit'
                        })}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-neutral-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(100, (item.count / Math.max(...analytics.recentSubmissions.map(s => s.count))) * 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-neutral-100 w-6 text-right">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Zusammenfassung</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600">
                    {analytics.totals.pending + analytics.totals.approved + analytics.totals.rejected}
                  </p>
                  <p className="text-sm text-neutral-400 mt-1">
                    Gesamte Einreichungen ({timeRange === '7d' ? '7 Tage' : timeRange === '30d' ? '30 Tage' : '90 Tage'})
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {analytics.avgProcessingTime.toFixed(1)}h
                  </p>
                  <p className="text-sm text-neutral-400 mt-1">
                    Ø Bearbeitungszeit
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {analytics.totals.published}
                  </p>
                  <p className="text-sm text-neutral-400 mt-1">
                    Veröffentlichte Tricks
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  )
}