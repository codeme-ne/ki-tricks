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
}

export const MinimalStatsGrid: React.FC<MinimalStatsGridProps> = ({
  stats,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 ${className}`}>
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