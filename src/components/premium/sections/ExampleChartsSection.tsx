'use client'

import React from 'react'
import { DynamicExampleChartGenerator as ExampleChartGenerator } from '@/components/premium/DynamicCharts'
import type { TierFeatures } from './types'
import type { PremiumCalculatorShellProps } from '@/components/premium/PremiumCalculatorShell'

interface ExampleChartsSectionProps {
  modeLevel: number
  tierFeatures: TierFeatures
  examples?: PremiumCalculatorShellProps['examples']
  exampleChartType?: PremiumCalculatorShellProps['exampleChartType']
}

export function ExampleChartsSection({ modeLevel, tierFeatures, examples, exampleChartType }: ExampleChartsSectionProps) {
  if (!(modeLevel >= 2 && tierFeatures.examples && examples)) return null
  return (
    <div id="examples" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Example Calculations</h2>
      <noscript className="block text-sm text-gray-500 dark:text-gray-400 mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        These interactive example charts require JavaScript. Example levels available: Beginner ({examples.beginner.label}: {examples.beginner.output}), Typical ({examples.typical.label}: {examples.typical.output}), Advanced ({examples.advanced.label}: {examples.advanced.output}){examples.realworld ? `, Real-World (${examples.realworld.label}: ${examples.realworld.output})` : ''}.
      </noscript>
      <ExampleChartGenerator
        beginner={examples.beginner} typical={examples.typical}
        advanced={examples.advanced} realworld={examples.realworld}
        chartType={exampleChartType}
      />
    </div>
  )
}
