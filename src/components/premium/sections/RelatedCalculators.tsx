'use client'

import React from 'react'
import { RelatedCalculatorCarousel } from '@/components/premium/RelatedCalculatorCarousel'
import type { CalculatorEntry } from '@calcuniverse/calculator-registry'

interface RelatedCalculatorsProps {
  calculators: CalculatorEntry[]
  hubSlug: string
}

export function RelatedCalculators({ calculators, hubSlug }: RelatedCalculatorsProps) {
  if (calculators.length === 0) return null
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
      <RelatedCalculatorCarousel
        calculators={calculators}
        hubPath={hubSlug}
        title="Related Calculators"
      />
    </div>
  )
}
