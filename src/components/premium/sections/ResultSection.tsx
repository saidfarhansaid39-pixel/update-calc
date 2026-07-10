'use client'

import React from 'react'
import { ResultTabs } from '@/components/premium/ResultTabs'
import { ResultQualityBadge } from '@/components/premium/ResultQualityBadge'
import { InputRangeValidator } from '@/components/premium/InputRangeValidator'
import { getQualityInfo, getInputRanges } from '@/lib/quality/calculator-quality'

interface ResultSectionProps {
  showTabs?: boolean
  modeLevel: number
  result: React.ReactNode
  charts?: React.ReactNode
  breakdown?: React.ReactNode
  schedule?: React.ReactNode
  inputs?: Record<string, string>
  slug: string
  category: string
}

export function ResultSection({ showTabs, modeLevel, result, charts, breakdown, schedule, inputs, slug, category }: ResultSectionProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 sm:p-6 flex flex-col justify-center max-w-full overflow-x-auto">
      {showTabs && modeLevel >= 1 ? (
        <ResultTabs
          mainResult={result}
          charts={charts}
          breakdown={breakdown}
          schedule={schedule}
          inputs={inputs}
          slug={slug}
        />
      ) : (
        <div className="space-y-3">
          {result}
          <ResultQualityBadge quality={getQualityInfo(slug, category)} />
          <InputRangeValidator ranges={getInputRanges(slug) || {}} inputs={inputs} />
        </div>
      )}
    </div>
  )
}
