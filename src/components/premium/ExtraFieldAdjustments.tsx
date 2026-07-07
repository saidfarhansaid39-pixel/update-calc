'use client'

import React, { useMemo } from 'react'
import { computeAdjustments, type ExtraFieldAdjustment } from '@/lib/extra-field-adjustments'
import { TrendingUp, TrendingDown, Minus, AlertCircle, Info } from 'lucide-react'

interface ExtraFieldAdjustmentsProps {
  hubSlug: string
  mainValue?: number
  extraFields: Record<string, string>
}

export function ExtraFieldAdjustments({ hubSlug, mainValue, extraFields }: ExtraFieldAdjustmentsProps) {
  const adjustments = useMemo(
    () => computeAdjustments(hubSlug, mainValue, extraFields),
    [hubSlug, mainValue, extraFields],
  )

  if (!adjustments.length) return null

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        <Info className="w-3 h-3" />
        Adjustments
      </p>
      <div className="space-y-2">
        {adjustments.map((adj, i) => (
          <AdjustmentRow key={i} adjustment={adj} />
        ))}
      </div>
    </div>
  )
}

function AdjustmentRow({ adjustment }: { adjustment: ExtraFieldAdjustment }) {
  const Icon = adjustment.impact === 'positive' ? TrendingUp : adjustment.impact === 'negative' ? TrendingDown : Minus
  const colorClass = adjustment.impact === 'positive'
    ? 'text-green-600 dark:text-green-400'
    : adjustment.impact === 'negative'
    ? 'text-red-500 dark:text-red-400'
    : 'text-gray-500 dark:text-gray-400'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${colorClass}`} />
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-200">{adjustment.label}</p>
            {adjustment.originalValue && (
              <p className="text-xs text-gray-400 mt-0.5">
                <span className="line-through">{adjustment.originalLabel}: {adjustment.originalValue}</span>
              </p>
            )}
            <p className={`text-sm font-semibold mt-0.5 ${colorClass}`}>
              {adjustment.adjustedLabel}: {adjustment.adjustedValue}
            </p>
            {adjustment.explanation && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">{adjustment.explanation}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
