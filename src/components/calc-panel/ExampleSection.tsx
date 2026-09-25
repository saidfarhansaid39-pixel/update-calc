"use client"

import React from 'react'
import { useTranslations } from 'next-intl'

/**
 * Reusable Example Section component for calculator pages
 * Per seo.txt #31: Add meaningful examples calculated by the same engine
 * Do not hardcode example results that can become inconsistent with the calculator.
 */

export function ExampleSection({ 
  calculationTitle, 
  formula, 
  exampleInput, 
  exampleResult 
}: { 
  calculationTitle: string
  formula: string
  exampleInput: Record<string, number | string>
  exampleResult: Record<string, number | string>
}) {
  const t = useTranslations('calculatorUI')

  // No example data (registry entries don't carry any) — render nothing
  // instead of an empty section with raw translation keys.
  if (!formula && Object.keys(exampleInput).length === 0 && Object.keys(exampleResult).length === 0) return null

  return (
    <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {t('example', { name: calculationTitle })}
      </h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
          {calculationTitle}
        </h3>
        {formula && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-mono">
            {formula}
          </p>
        )}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('inputValues')} 
            </p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm whitespace-pre">
{Object.entries(exampleInput).map(([key, value]) => `${key}: ${value}`).join('\n')}
            </pre>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('finalResult')} 
            </p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm whitespace-pre">
{Object.entries(exampleResult).map(([key, value]) => `${key}: ${value}`).join('\n')}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}