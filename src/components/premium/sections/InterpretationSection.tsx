'use client'

import React from 'react'

interface InterpretationSectionProps {
  modeLevel: number
  interpretation?: string
}

export function InterpretationSection({ modeLevel, interpretation }: InterpretationSectionProps) {
  if (!(modeLevel >= 1 && interpretation)) return null
  return (
    <div id="what-this-means" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What This Means</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{interpretation}</p>
    </div>
  )
}
