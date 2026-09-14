'use client'

import React, { useMemo } from 'react'
import { getMortgageTerms, getLoanTerms, getInvestmentTerms } from '@/components/premium/MultiTermData'
import { useCurrency } from '@/lib/context/CurrencyContext'

interface MultiTermComparisonProps {
  calculatorType: string
  inputs: Record<string, any>
  currentTerm?: number
}

export function MultiTermComparison({ calculatorType, inputs, currentTerm }: MultiTermComparisonProps) {
  const { currencySymbol } = useCurrency()
  const comparisons = useMemo(() => {
    const n = (v: any) => parseFloat(v) || 0
    switch (calculatorType) {
      case 'mortgage': {
        const price = n(inputs.homePrice)
        const down = n(inputs.downPayment)
        const rate = n(inputs.rate)
        return getMortgageTerms(price - down, rate)
      }
      case 'loan': {
        const principal = n(inputs.principal) || n(inputs.amount)
        const rate = n(inputs.rate)
        return getLoanTerms(principal, rate)
      }
      case 'investment': {
        const initial = n(inputs.initial)
        const monthly = n(inputs.monthly)
        const rate = n(inputs.rate)
        return getInvestmentTerms(initial, monthly, rate)
      }
      default:
        return []
    }
  }, [calculatorType, inputs])

  if (comparisons.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Compare Terms
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {comparisons.map((item) => {
          const isCurrent = currentTerm !== undefined && item.term === currentTerm
          return (
            <div
              key={item.term}
              className={`rounded-lg p-3 border transition-all ${
                isCurrent
                  ? 'border-[#1a3a8a] bg-[#1a3a8a]/5 dark:bg-[#06b6d4]/10 dark:border-[#06b6d4] ring-1 ring-[#1a3a8a]/20 dark:ring-[#06b6d4]/20'
                  : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900'
              }`}
            >
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {item.label}
                {isCurrent && (
                  <span className="ml-1 text-[#1a3a8a] dark:text-[#06b6d4]">· Current</span>
                )}
              </p>
              {calculatorType === 'investment' ? (
                <>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {currencySymbol}{item.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    +{currencySymbol}{item.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })} growth
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-[#1a3a8a] dark:text-[#06b6d4]">
                    {currencySymbol}{item.monthlyPayment.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    /mo · {currencySymbol}{item.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })} interest
                  </p>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
