'use client'

import React from 'react'

export interface RangeSegment {
  label: string
  min: number
  max: number
  color: string
}

export interface RangeVisualizerProps {
  value: number
  ranges: RangeSegment[]
  formatValue?: (v: number) => string
  label?: string
}

export function RangeVisualizer({ value, ranges, formatValue, label }: RangeVisualizerProps) {
  const totalMin = Math.min(...ranges.map(r => r.min))
  const totalMax = Math.max(...ranges.map(r => r.max))
  const clamped = Math.max(totalMin, Math.min(totalMax, value))
  const pct = totalMax > totalMin ? ((clamped - totalMin) / (totalMax - totalMin)) * 100 : 50
  const current = ranges.find(r => value >= r.min && value <= r.max)
    ?? ranges.reduce((prev, curr) => Math.abs(value - ((curr.min + curr.max) / 2)) < Math.abs(value - ((prev.min + prev.max) / 2)) ? curr : prev)

  const fmt = formatValue ?? ((v: number) => v.toFixed(1))

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{fmt(value)}</span>
            {current && (
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                style={{ backgroundColor: current.color + '20', color: current.color }}
              >
                {current.label}
              </span>
            )}
          </div>
        </div>
      )}
      <div className="relative h-3 w-full rounded-full overflow-hidden flex">
        {ranges.map((r, i) => {
          const startPct = ((r.min - totalMin) / (totalMax - totalMin)) * 100
          const endPct = ((r.max - totalMin) / (totalMax - totalMin)) * 100
          const width = endPct - startPct
          return (
            <div
              key={i}
              className="h-full relative"
              style={{ width: `${width}%`, backgroundColor: r.color }}
              title={`${r.label}: ${r.min}-${r.max}`}
            />
          )
        })}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-gray-200 border-2 border-gray-400 dark:border-gray-500 rounded-full shadow-md z-10 transition-[left] duration-200"
          style={{ left: `calc(${pct}% - 10px)` }}
          aria-hidden="true"
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500">
        <span>{fmt(totalMin)}</span>
        <span>{fmt(totalMax)}</span>
      </div>
      {current && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {ranges.map((r, i) => (
            <span
              key={i}
              className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                r.label === current.label
                  ? 'font-semibold border-current'
                  : 'opacity-50 border-transparent'
              }`}
              style={{ color: r.color, borderColor: r.label === current.label ? r.color : undefined }}
            >
              {r.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
