'use client'

import React from 'react'

interface Explanation {
  summary: string
  details: string[]
  tips: string[]
}

interface ExplanationSectionProps {
  modeLevel: number
  explanation?: Explanation | null
}

export function ExplanationSection({ modeLevel, explanation }: ExplanationSectionProps) {
  if (!(modeLevel >= 1 && explanation)) return null
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Your Results Explained</h2>
      <div className="prose dark:prose-invert max-w-none text-sm">
        <p className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: explanation.summary }} />
        {explanation.details.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {explanation.details.map((d, i) => (
              <li key={i} className="text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: d }} />
            ))}
          </ul>
        )}
      </div>
      {explanation.tips.length > 0 && (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1.5">Tips</p>
          <ul className="space-y-1">
            {explanation.tips.map((tip, i) => (
              <li key={i} className="text-xs text-amber-600 dark:text-amber-400 flex items-start gap-1.5">
                <span className="mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
