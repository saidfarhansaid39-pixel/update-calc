'use client'

import React from 'react'
import { AlertTriangle, Info } from 'lucide-react'
import type { InputRange } from '@/lib/quality/calculator-quality'

interface InputRangeValidatorProps {
  ranges: Record<string, InputRange>
  inputs?: Record<string, string>
}

export function InputRangeValidator({ ranges, inputs }: InputRangeValidatorProps) {
  if (!inputs || !Object.keys(ranges).length) return null

  const warnings: { field: string; message: string; hint?: string }[] = []

  for (const [fieldName, range] of Object.entries(ranges)) {
    const rawValue = inputs[fieldName]
    if (!rawValue) continue
    const numValue = parseFloat(rawValue)
    if (isNaN(numValue)) continue

    if (numValue < range.min) {
      warnings.push({
        field: range.label || fieldName,
        message: `Value (${numValue}) is below the typical minimum (${range.min}${range.unit ? ' ' + range.unit : ''})`,
        hint: range.hint,
      })
    } else if (numValue > range.max) {
      warnings.push({
        field: range.label || fieldName,
        message: `Value (${numValue}) exceeds the typical maximum (${range.max}${range.unit ? ' ' + range.unit : ''})`,
        hint: range.hint,
      })
    }
  }

  if (!warnings.length) return null

  return (
    <div className="space-y-1.5">
      {warnings.map((w, i) => (
        <div
          key={i}
          className="flex items-start gap-2 p-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-xs"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 dark:text-amber-200">
              <span className="font-medium">{w.field}:</span> {w.message}
            </p>
            {w.hint && (
              <p className="flex items-center gap-1 mt-0.5 text-amber-600 dark:text-amber-400">
                <Info className="w-3 h-3" />
                {w.hint}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
