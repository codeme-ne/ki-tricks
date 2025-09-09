'use client'

import React from 'react'

interface StatProps {
  value: number
  label: string
  suffix?: string
}

const Stat: React.FC<StatProps> = ({ value, label, suffix = '' }) => {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-bold text-neutral-900">
        {value}{suffix}
      </div>
      <div className="text-sm text-neutral-500 mt-1">
        {label}
      </div>
    </div>
  )
}

interface MinimalStatsGridProps {
  stats: Array<{
    value: number
    label: string
    suffix?: string
  }>
  className?: string
  columns?: 1 | 2 | 3 | 4
}

export const MinimalStatsGrid: React.FC<MinimalStatsGridProps> = ({
  stats,
  className = '',
  columns,
}) => {
  // Choose grid columns to keep the group visually centered.
  const colCount = columns ?? Math.min(Math.max(stats.length, 1), 4)
  // Enumerate Tailwind classes explicitly to avoid purge issues.
  const gridClass =
    colCount === 1
      ? 'grid-cols-1'
      : colCount === 2
      ? 'grid-cols-2 md:grid-cols-2'
      : colCount === 3
      ? 'grid-cols-1 sm:grid-cols-3 md:grid-cols-3'
      : 'grid-cols-2 md:grid-cols-4'

  return (
    <div className={`grid ${gridClass} gap-8 justify-items-center ${className}`}>
      {stats.map((stat) => (
        <Stat
          key={stat.label}
          value={stat.value}
          label={stat.label}
          suffix={stat.suffix}
        />
      ))}
    </div>
  )
}

export default MinimalStatsGrid
