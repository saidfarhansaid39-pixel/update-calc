"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';
import { ResultInterpretation } from '@/components/calc-panel/ResultInterpretation';

export function HouseAffordabilityResults({ results }: any) {
  const t = useTranslations('calculatorUI');
  const locale = useLocale();
  if (!results) return null;

  const downPct = results.homePrice > 0 ? (results.downPayment / results.homePrice) * 100 : 0;

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800 mt-4 md:mt-0">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
        <span className="text-[16px]">{t('sections.affordabilityResults')}</span>
      </div>
      
      <div className="bg-white border border-gray-300 border-t-0 p-4 space-y-4">
        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr className="border-b border-gray-300 bg-gray-50">
              <td className="p-3 text-left font-bold text-lg">{t('results.homePrice')}</td>
              <td className="p-3 text-right font-bold text-lg text-green-700">{formatCurrency(results.homePrice, 'USD', locale)}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="p-2 text-left">Loan Amount</td>
              <td className="p-2 text-right">{formatCurrency(results.loanAmount, 'USD', locale)}</td>
            </tr>
            <tr className="border-b border-gray-300 bg-gray-50">
              <td className="p-2 text-left">Down Payment</td>
              <td className="p-2 text-right">{formatCurrency(results.downPayment, 'USD', locale)} ({downPct.toFixed(1)}%)</td>
            </tr>
            <tr>
              <td className="p-2 text-left font-bold">{t('results.monthlyHousingCost')}</td>
              <td className="p-2 text-right font-bold">{formatCurrency(results.monthlyCost, 'USD', locale)}</td>
            </tr>
          </tbody>
        </table>

        {/* Payoff summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">{t('results.homePrice')}</p>
            <p className="text-sm font-bold text-gray-900">{formatCurrency(results.homePrice, 'USD', locale)}</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">{t('results.downPayment')}</p>
            <p className="text-sm font-bold text-blue-600">{formatCurrency(results.downPayment, 'USD', locale)} ({downPct.toFixed(1)}%)</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">{t('results.loanAmount')}</p>
            <p className="text-sm font-bold text-gray-900">{formatCurrency(results.loanAmount, 'USD', locale)}</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">{t('results.monthlyHousingCost')}</p>
            <p className="text-sm font-bold text-[#d62828]">{formatCurrency(results.monthlyCost, 'USD', locale)}</p>
          </div>
        </div>

        {/* Interpretation */}
        <ResultInterpretation
          type="budget"
          values={{
            income: results.monthlyCost * 3,
            needs: results.monthlyCost,
            wants: 0,
            savings: 0,
          }}
          currencySymbol="$"
        />
      </div>
    </div>
  );
}
