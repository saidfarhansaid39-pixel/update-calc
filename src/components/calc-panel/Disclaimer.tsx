"use client";

import React from 'react';

/**
 * Reusable trust disclaimer component for YMYL (Your Money Your Life) calculators
 * 
 * Per seo.txt #35-36: Financial/Health calculators should include trust disclaimers
 * to satisfy Google's quality guidelines and avoid "thin content" penalties.
 */

/**
 * Financial calculator disclaimer - shows mortgage-specific trust signals
 * Formula: standard amortization M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
 */
export function FinancialDisclaimer() {
  return (
    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Mortgage calculations use the standard amortization formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]<br/>
        where M = monthly payment, P = loan principal, i = monthly interest rate, and n = number of payments. Results are estimates based on input values.
      </p>
      <p className="mt-2 text-[10px] font-medium px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
        This calculator is for informational purposes only and not a substitute for professional financial advice. Consult a qualified financial advisor for personalized guidance.
      </p>
    </div>
  )
}

/**
 * Health calculator disclaimer - shows BMR/formula trust signals
 */
export function HealthDisclaimer() {
  return (
    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        BMR (Basal Metabolic Rate) calculations use the Mifflin-St Jeor formula:<br/>
        • Men: BMR = 10 × weight(kg) + 6.25 × height(cm) – 5 × age(y) + 5<br/>
        • Women: BMR = 10 × weight(kg) + 6.25 × height(cm) – 5 × age(y) – 1<br/>
        Results estimate daily calorie needs at rest.
      </p>
      <p className="mt-2 text-[10px] font-medium px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
        This calculator is for informational purposes only and not medical advice. Consult a healthcare professional before making health decisions based on calculator results.
      </p>
    </div>
  )
}

/**
 * Engineering calculator disclaimer - shows formula trust signals
 */
export function EngineeringDisclaimer() {
  return (
    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Engineering calculations follow industry-standard formulas and codes (e.g., Ohm's law V=IR,<br/>
        beam deflection formulas per building codes, Newton's second law F=ma). Results are estimates.<br/>
        Verify critical designs with professional engineering consultation.
      </p>
      <p className="mt-2 text-[10px] font-medium px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
        This calculator provides estimates only and does not imply professional engineering certification. Verify design decisions with a qualified engineer.
      </p>
    </div>
  )
}