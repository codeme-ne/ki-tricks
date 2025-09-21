'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'

interface PipelineMetrics {
  newsItems: number
  processedItems: number
  guides: number
  pendingGuides: number
  publishedGuides: number
  lastFetch?: string
  lastProcessed?: string
}

export default function PipelineDashboard() {
  const [metrics, setMetrics] = useState<PipelineMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)

  async function fetchMetrics() {
    const supabase = createClient()

    try {
      // Get news items count
      const { count: newsCount } = await supabase
        .from('news_items')
        .select('*', { count: 'exact', head: true })

      // Get processed items count
      const { count: processedCount } = await supabase
        .from('news_items')
        .select('*', { count: 'exact', head: true })
        .eq('processed', true)

      // Get guides counts
      const { count: totalGuides } = await supabase
        .from('guides')
        .select('*', { count: 'exact', head: true })

      const { count: pendingGuides } = await supabase
        .from('guides')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      const { count: publishedGuides } = await supabase
        .from('guides')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')

      // Get latest timestamps
      const { data: latestNews } = await supabase
        .from('news_items')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      const { data: latestProcessed } = await supabase
        .from('news_items')
        .select('updated_at')
        .eq('processed', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      setMetrics({
        newsItems: newsCount || 0,
        processedItems: processedCount || 0,
        guides: totalGuides || 0,
        pendingGuides: pendingGuides || 0,
        publishedGuides: publishedGuides || 0,
        lastFetch: latestNews?.created_at,
        lastProcessed: latestProcessed?.updated_at
      })
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  async function runPipeline() {
    setRunning(true)
    try {
      const response = await fetch('/api/pipeline/run', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || ''}`
        }
      })

      const result = await response.json()
      console.log('Pipeline result:', result)

      // Refresh metrics after pipeline run
      await fetchMetrics()
    } catch (error) {
      console.error('Error running pipeline:', error)
    } finally {
      setRunning(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Pipeline Dashboard</h1>
          <p>Loading metrics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Pipeline Dashboard</h1>
          <button
            onClick={runPipeline}
            disabled={running}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? 'Running Pipeline...' : 'Run Pipeline Now'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="News Items"
            value={metrics?.newsItems || 0}
            subtitle={`${metrics?.processedItems || 0} processed`}
          />
          <MetricCard
            title="Total Guides"
            value={metrics?.guides || 0}
            subtitle={`${metrics?.pendingGuides || 0} pending`}
          />
          <MetricCard
            title="Published"
            value={metrics?.publishedGuides || 0}
            subtitle="Live guides"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Pipeline Status</h2>
          <div className="space-y-2">
            <StatusRow
              label="Last Feed Fetch"
              value={metrics?.lastFetch ? format(new Date(metrics.lastFetch), 'PPpp') : 'Never'}
            />
            <StatusRow
              label="Last Processing"
              value={metrics?.lastProcessed ? format(new Date(metrics.lastProcessed), 'PPpp') : 'Never'}
            />
            <StatusRow
              label="Processing Rate"
              value={`${((metrics?.processedItems || 0) / Math.max(metrics?.newsItems || 1, 1) * 100).toFixed(1)}%`}
            />
            <StatusRow
              label="Publishing Rate"
              value={`${((metrics?.publishedGuides || 0) / Math.max(metrics?.guides || 1, 1) * 100).toFixed(1)}%`}
            />
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Pipeline Configuration</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Schedule</span>
              <span>Every 6 hours (0 */6 * * *)</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Fetch Timeout</span>
              <span>30 seconds per feed</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Rate Limiting</span>
              <span>15 minutes between fetches per domain</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Batch Size</span>
              <span>5 items per curator run</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, subtitle }: { title: string; value: number; subtitle: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  )
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b">
      <span className="font-medium">{label}</span>
      <span className="text-gray-600">{value}</span>
    </div>
  )
}