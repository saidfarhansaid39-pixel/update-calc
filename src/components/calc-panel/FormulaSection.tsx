"use client"

import React from 'react'
import { useTranslations } from 'next-intl'

/**
 * Formula Section component for math/scientific calculators
 * Per seo.txt #30-31: Display formulas where useful,
 * explain each variable, use accessible markup,
 * do not expose implementation code as the formula.
 *
 * Example props:
 * {
 *   name: "BMI Calculator",
 *   formula: "BMR = 10 × weight(kg) + 6.25 × height(cm) – 5 × age(y) + 5 (male)\n         BMR = 10 × weight(kg) + 6.25 × height(cm) – 5 × age(y) – 1 (female)",
 *   variables: [
 *     { name: "weight", description: "Body weight in kilograms (kg)", unit: "kg" },
 *     { name: "height", description: "Height in centimeters (cm)", unit: "cm" },
 *     { name: "age", description: "Age in years" },
 *     { name: "gender", description: "Gender (male/female affects formula constant)" }
 *   ],
 *   description: "BMR (Basal Metabolic Rate) estimates daily calorie needs at rest."
 * }
 */

export function FormulaSection({ 
  name, 
  formula, 
  variables, 
  description 
}: { 
  name?: string
  formula: string
  variables: Array<{ name: string; description: string; unit?: string }> | Record<string, string>
  description?: string
}) {
  const t = useTranslations('calculatorUI')
  
  const varEntries = Array.isArray(variables) 
    ? variables 
    : Object.entries(variables).map(([name, description]) => ({ name, description }))

  // No formula data (registry entries don't carry one) — render nothing
  // instead of an empty section with raw translation keys.
  if (!formula) return null

  return (
    <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {name ? t('formulaNamed', { name }) : t('formula')}
      </h2>
      
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {description}
        </p>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
          {t('theFormula')}
        </h3>
        <p className="text-lg font-medium text-gray-800 dark:text-white break-all">
          {formula}
        </p>
        
        {varEntries.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('variables', { count: varEntries.length })}
            </h4>
            <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-300 space-y-2">
              {varEntries.map((varObj, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <strong className="font-medium text-gray-800 dark:text-white flex-shrink-0">{varObj.name}:</strong>
                  <span className="flex-1 text-gray-600 dark:text-gray-300">
                    {varObj.description}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}