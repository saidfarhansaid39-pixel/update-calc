'use client'

import React from 'react'
import { EnhancedResultExplanation } from '@/components/premium/EnhancedResultExplanation'
import { generateAIExplanation } from '@/lib/seo/ai-explanation'
import type { TierFeatures } from './types'
import type { PremiumCalculatorShellProps } from '@/components/premium/PremiumCalculatorShell'

interface EnhancedExplanationSectionProps {
  modeLevel: number
  tierFeatures: TierFeatures
  enhancedExplanation?: PremiumCalculatorShellProps['enhancedExplanation']
  calculator: PremiumCalculatorShellProps['calculator']
  mainValue?: number
  inputs?: Record<string, string>
}

export function EnhancedExplanationSection({ modeLevel, tierFeatures, enhancedExplanation, calculator, mainValue, inputs }: EnhancedExplanationSectionProps) {
  if (!(modeLevel >= 2 && tierFeatures.eduCharts && enhancedExplanation && mainValue !== undefined)) return null
  return (
    <div id="enhanced-results" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Results Explained</h2>
      <EnhancedResultExplanation
        value={mainValue as number} label={calculator.title}
        goodRange={enhancedExplanation.goodRange}
        benchmarks={enhancedExplanation.benchmarks}
        nextActions={enhancedExplanation.nextActions}
        optimizations={enhancedExplanation.optimizations}
        warnings={enhancedExplanation.warnings}
        resultInsights={enhancedExplanation.resultInsights}
        detailedExplanation={enhancedExplanation.detailedExplanation || (() => {
          const parsedInputs: Record<string, number> = {}
          if (inputs) Object.entries(inputs).forEach(([k, v]) => { const n = parseFloat(v); if (!isNaN(n)) parsedInputs[k] = n })
          const aiExp = generateAIExplanation(calculator.category, calculator.slug, mainValue as number, parsedInputs)
          return {
            whatItMeans: aiExp.whatItMeans,
            whyItMatters: aiExp.whyItMatters,
            whatAffectsIt: aiExp.whatAffectsIt,
            howToImprove: aiExp.howToImprove,
            detailedSections: aiExp.detailedSections,
          }
        })()}
      />
    </div>
  )
}
