"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';
import { ResultInterpretation } from '@/components/calc-panel/ResultInterpretation';

export function SocialSecurityResults({ results }: any) {
  const t = useTranslations('calculatorUI');
  const locale = useLocale();
  if (!results) return null;

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800 mt-4 md:mt-0">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
        <span className="text-[16px]">{t('results.resultLabel')}</span>
      </div>
      
      <div className="bg-white border border-gray-300 border-t-0 p-4 leading-relaxed space-y-4">
        {results.type === 'ideal' && (
          <div>
            <p className="mb-2">Based on your inputs (life expectancy of {results.lifeExpectancy}), the financially ideal age to begin claiming Social Security benefits is:</p>
            <div className="text-center my-4">
              <span className="text-[28px] font-bold text-[#1c4587]">Age {results.bestAge}</span>
            </div>
            <p>At this age, the projected total lifetime value of your accumulated benefits, assuming a {results.returnRate}% annual return and {results.cola}% annual COLA, reaches its maximum.</p>

            {/* Payoff summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-400">Optimal Age</p>
                <p className="text-sm font-bold text-gray-900">{results.bestAge}</p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-400">Life Expectancy</p>
                <p className="text-sm font-bold text-gray-900">{results.lifeExpectancy}</p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-400">Return Rate</p>
                <p className="text-sm font-bold text-gray-900">{results.returnRate}%</p>
              </div>
            </div>

            {/* Interpretation */}
            <ResultInterpretation
              type="social_security"
              values={{
                bestAge: results.bestAge,
                lifeExpectancy: results.lifeExpectancy,
                monthlyBenefit: 0,
              }}
              currencySymbol="$"
            />
          </div>
        )}

        {results.type === 'compare' && (
          <div>
            <p className="mb-2">Comparing Option 1 (Claiming at {results.age1}) vs Option 2 (Claiming at {results.age2}):</p>
            <div className="text-center my-4">
              <div className="text-[16px] font-bold text-gray-700">The break-even age is:</div>
              <span className="text-[28px] font-bold text-[#1c4587]">Age {results.breakEvenAge}</span>
            </div>
            <p>If you live past age {results.breakEvenAge}, you will accumulate more total wealth by waiting until age {results.age2} to claim your benefits. If you expect to live shorter than this, claiming at age {results.age1} is financially optimal.</p>

            {/* Payoff summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-400">Option 1 Age</p>
                <p className="text-sm font-bold text-gray-900">{results.age1}</p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-400">Option 2 Age</p>
                <p className="text-sm font-bold text-gray-900">{results.age2}</p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-400">Break-Even Age</p>
                <p className="text-sm font-bold text-[#1c4587]">{results.breakEvenAge}</p>
              </div>
            </div>

            {/* Interpretation */}
            <ResultInterpretation
              type="social_security"
              values={{
                bestAge: results.breakEvenAge,
                lifeExpectancy: results.lifeExpectancy,
                monthlyBenefit: 0,
              }}
              currencySymbol="$"
            />

            <div className="mt-4 p-3 bg-blue-50 text-blue-900 border border-blue-200 rounded text-xs">
              <strong>Note:</strong> This calculation accounts for the opportunity cost of investing the earlier smaller payments at {results.returnRate}% versus waiting for the higher delayed payments.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
