"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';
import { ResultInterpretation } from '@/components/calc-panel/ResultInterpretation';

export function RentResults({ results }: any) {
  const t = useTranslations('calculatorUI');
  const locale = useLocale();
  if (!results) return null;

  const ratioColor = results.rentToIncomeRatio > 0
    ? results.rentToIncomeRatio <= 30 ? 'text-green-700'
      : results.rentToIncomeRatio <= 36 ? 'text-yellow-700' : 'text-red-700'
    : '';

  const ratioBg = results.rentToIncomeRatio > 0
    ? results.rentToIncomeRatio <= 30 ? 'bg-green-50'
      : results.rentToIncomeRatio <= 36 ? 'bg-yellow-50' : 'bg-red-50'
    : '';

  const ratioLabel = results.rentToIncomeRatio > 0
    ? results.rentToIncomeRatio <= 30 ? t('results.withinRecommendedRange')
      : results.rentToIncomeRatio <= 36 ? t('results.slightlyAboveRecommended') : t('results.aboveRecommendedLimit')
    : '';

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800 mt-4 md:mt-0">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
        <span className="text-[16px]">{t('sections.rentAffordabilityResults')}</span>
      </div>
      
      <div className="bg-white border border-gray-300 border-t-0 p-4 space-y-4">
        <p className="mb-4">Based on your income and debts, here are the monthly rent budgets you can afford:</p>

        {/* Payoff summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className={`p-2 rounded-lg border ${ratioBg || 'bg-white border-gray-200'}`}>
            <p className="text-xs text-gray-400">{t('results.rentToIncomeRatio')}</p>
            <p className={`text-sm font-bold ${ratioColor}`}>
              {results.rentToIncomeRatio.toFixed(1)}%
              {ratioLabel && <span className="block text-xs font-normal">{ratioLabel}</span>}
            </p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">{t('results.recommendedBudget')}</p>
            <p className="text-sm font-bold text-green-700">{formatCurrency(results.recommended, 'USD', locale)}</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">{t('results.conservativeBudget')}</p>
            <p className="text-sm font-bold text-gray-700">{formatCurrency(results.conservative, 'USD', locale)}</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">{t('results.maximumBudget')}</p>
            <p className="text-sm font-bold text-red-600">{formatCurrency(results.maximum, 'USD', locale)}</p>
          </div>
        </div>
        
        <table className="w-full text-sm border-collapse">
          <tbody>
            {results.rentAmount > 0 && (
              <tr className={`border-b border-gray-200 ${ratioBg}`}>
                <td className="p-3 text-left font-bold">
                  <div className="text-[15px]">{t('results.yourRentToIncomeRatio')}</div>
                  <div className={`text-[11px] font-normal ${ratioColor}`}>{ratioLabel}</div>
                </td>
                <td className={`p-3 text-right font-bold text-[18px] ${ratioColor}`}>
                  {results.rentToIncomeRatio.toFixed(1)}%
                </td>
              </tr>
            )}
            <tr className="border-b border-gray-200 bg-green-50">
              <td className="p-3 text-left font-bold text-green-800">
                <div className="text-[15px]">{t('results.recommendedBudget')}</div>
                <div className="text-[11px] font-normal text-green-700">{t('results.usingStandard30Rule')}</div>
              </td>
              <td className="p-3 text-right font-bold text-[18px] text-green-700">
                {formatCurrency(results.recommended, 'USD', locale)}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 text-left">
                <div className="font-bold text-gray-700">{t('results.conservativeBudget')}</div>
                <div className="text-[11px] text-gray-500">{t('results.using25Allocation')}</div>
              </td>
              <td className="p-3 text-right font-bold text-[16px] text-gray-700">
                {formatCurrency(results.conservative, 'USD', locale)}
              </td>
            </tr>
            <tr className="">
              <td className="p-3 text-left">
                <div className="font-bold text-red-700">{t('results.maximumBudgetDti')}</div>
                <div className="text-[11px] text-red-500">{t('results.maxDtiMinusDebts')}</div>
              </td>
              <td className="p-3 text-right font-bold text-[16px] text-red-600">
                {formatCurrency(results.maximum, 'USD', locale)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Interpretation */}
        <ResultInterpretation
          type="budget"
          values={{
            income: results.recommended * 3,
            needs: results.recommended,
            wants: results.maximum - results.recommended,
            savings: results.conservative,
          }}
          currencySymbol="$"
        />

        {results.rentAmount > 0 && results.totalDti > 0 && (
          <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
            Total DTI (rent + debts): <strong>{results.totalDti.toFixed(1)}%</strong>
            {results.totalDti > 43 ? ' — exceeds 43% threshold' : ' — within 43% threshold'}
          </div>
        )}

        {results.maximum < results.recommended && (
          <div className="mt-4 p-3 bg-red-50 text-red-800 border border-red-200 rounded text-xs">
            <strong>Note:</strong> Your high monthly debt is lowering your maximum allowed rent significantly. You may find it difficult to get approved for the recommended rent amount.
          </div>
        )}
      </div>
    </div>
  );
}
