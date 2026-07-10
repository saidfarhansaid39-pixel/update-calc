'use client'

import React from 'react'
import { Check, Copy } from 'lucide-react'

interface FormulaStepsSectionProps {
  modeLevel: number
  formula?: string
  steps?: { label: string; value: string }[]
  copiedValue: string | null
  onCopyValue: (text: string, label: string) => void
}

export function FormulaStepsSection({ modeLevel, formula, steps, copiedValue, onCopyValue }: FormulaStepsSectionProps) {
  if (!(modeLevel >= 1 && (formula || (steps && steps.length > 0)))) return null
  return (
    <div id="formula" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Formula & Calculation</h2>
      {formula && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{formula}</p>
        </div>
      )}
      {steps && steps.length > 0 && (
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1a3a8a]/10 text-[#06b6d4] flex items-center justify-center text-xs font-bold">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 dark:text-gray-400">{step.label}</p>
                <div className="flex items-center gap-1">
                  <p className="font-mono font-medium text-gray-900 dark:text-white">{step.value}</p>
                  <button onClick={() => onCopyValue(`${step.label}: ${step.value}`, `step-${i}`)} className="p-1 text-gray-400 hover:text-[#06b6d4] transition-colors" aria-label={`Copy ${step.label}`}>
                    {copiedValue === `step-${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
