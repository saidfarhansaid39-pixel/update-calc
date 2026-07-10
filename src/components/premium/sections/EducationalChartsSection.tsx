'use client'

import React from 'react'
import {
  DynamicFormulaChart as FormulaChart,
  DynamicConceptDiagram as ConceptDiagram,
  DynamicProcessFlowChart as ProcessFlowChart,
} from '@/components/premium/DynamicCharts'
import type { TierFeatures } from './types'
import type { PremiumCalculatorShellProps } from '@/components/premium/PremiumCalculatorShell'

interface EducationalChartsSectionProps {
  modeLevel: number
  tierFeatures: TierFeatures
  formula?: string
  formulaVariables?: PremiumCalculatorShellProps['formulaVariables']
  conceptNodes?: PremiumCalculatorShellProps['conceptNodes']
  conceptEdges?: PremiumCalculatorShellProps['conceptEdges']
  processSteps?: PremiumCalculatorShellProps['processSteps']
}

export function EducationalChartsSection({ modeLevel, tierFeatures, formula, formulaVariables, conceptNodes, conceptEdges, processSteps }: EducationalChartsSectionProps) {
  if (!(modeLevel >= 2 && tierFeatures.eduCharts && (formulaVariables || conceptNodes || processSteps))) return null
  return (
    <div id="educational-charts" className="space-y-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Educational Visualizations</h2>
      <noscript className="block text-sm text-gray-500 dark:text-gray-400 mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        These interactive educational visualizations require JavaScript. {formulaVariables && formulaVariables.length > 0 && `Formula variables include: ${formulaVariables.map(v => `${v.name} (${v.value})`).join(', ')}.`} {conceptNodes && conceptNodes.length > 0 && `Key concepts: ${conceptNodes.map(n => n.label).join(', ')}.`} {processSteps && processSteps.length > 0 && `Process steps: ${processSteps.map(s => s.label).join(' → ')}.`}
      </noscript>
      {formulaVariables && <FormulaChart formula={formula || ''} variables={formulaVariables} />}
      {conceptNodes && conceptNodes.length > 0 && <ConceptDiagram nodes={conceptNodes} edges={conceptEdges || []} />}
      {processSteps && <ProcessFlowChart steps={processSteps} />}
    </div>
  )
}
