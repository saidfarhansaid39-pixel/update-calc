'use client'

import React from 'react'
import { Check, Copy } from 'lucide-react'

interface ExampleSectionProps {
  modeLevel: number
  example?: { label: string; value: string }[]
  copiedValue: string | null
  onCopyValue: (text: string, label: string) => void
}

export function ExampleSection({ modeLevel, example, copiedValue, onCopyValue }: ExampleSectionProps) {
  if (!(modeLevel >= 1 && example && example.length > 0)) return null
  return (
    <div id="example" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Example Calculation</h2>
      <div className="space-y-2">
        {example.map((step, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-gray-600 dark:text-gray-400">{step.label}</p>
              <div className="flex items-center gap-1">
                <p className="font-mono font-medium text-gray-900 dark:text-white">{step.value}</p>
                <button onClick={() => onCopyValue(`${step.label}: ${step.value}`, `example-${i}`)} className="p-1 text-gray-400 hover:text-amber-600 transition-colors" aria-label={`Copy ${step.label}`}>
                  {copiedValue === `example-${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
