"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';
import { ResultInterpretation } from '@/components/calc-panel/ResultInterpretation';

export function SalaryResults({ results }: any) {
  const t = useTranslations('calculatorUI');
  const locale = useLocale();
  if (!results) return null;

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center border border-[#3b7b13]">
        <span className="text-xl">{t('results.result')}</span>
      </div>
      
      <div className="bg-white border border-gray-300 border-t-0 p-4 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">Hourly</p>
            <p className="text-sm font-bold text-gray-900">{formatCurrency(results.unadjusted.hourly, 'USD', locale)}</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">Weekly</p>
            <p className="text-sm font-bold text-gray-900">{formatCurrency(results.unadjusted.weekly, 'USD', locale)}</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">Monthly</p>
            <p className="text-sm font-bold text-gray-900">{formatCurrency(results.unadjusted.monthly, 'USD', locale)}</p>
          </div>
        </div>

        {/* Interpretation */}
        <ResultInterpretation
          type="salary"
          values={{
            hourly: results.unadjusted.hourly,
            monthly: results.unadjusted.monthly,
            annual: results.unadjusted.annual,
          }}
          currencySymbol="$"
        />

        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-[#1c4587] text-white">
              <th className="p-1 border border-gray-400 text-center font-normal"></th>
              <th className="p-1 border border-gray-400 text-center font-bold">Unadjusted</th>
              <th className="p-1 border border-gray-400 text-center font-bold">Holidays & vacation<br/>days adjusted</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="p-1 border border-gray-300 text-left">Hourly</td>
              <td className="p-1 border border-gray-300">{formatCurrency(results.unadjusted.hourly, 'USD', locale)}</td>
              <td className="p-1 border border-gray-300">{formatCurrency(results.adjusted.hourly, 'USD', locale)}</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="p-1 border border-gray-300 text-left">Daily</td>
              <td className="p-1 border border-gray-300">{formatCurrency(results.unadjusted.daily, 'USD', locale)}</td>
              <td className="p-1 border border-gray-300">{formatCurrency(results.adjusted.daily, 'USD', locale)}</td>
            </tr>
            <tr className="bg-white">
              <td className="p-1 border border-gray-300 text-left">Weekly</td>
              <td className="p-1 border border-gray-300">{formatCurrency(results.unadjusted.weekly, 'USD', locale)}</td>
              <td className="p-1 border border-gray-300">{formatCurrency(results.adjusted.weekly, 'USD', locale)}</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="p-1 border border-gray-300 text-left">Bi-weekly</td>
              <td className="p-1 border border-gray-300">{formatCurrency(results.unadjusted.biWeekly, 'USD', locale)}</td>
              <td className="p-1 border border-gray-300">{formatCurrency(results.adjusted.biWeekly, 'USD', locale)}</td>
            </tr>
            <tr className="bg-white">
              <td className="p-1 border border-gray-300 text-left">Semi-monthly</td>
              <td className="p-1 border border-gray-300">{formatCurrency(results.unadjusted.semiMonthly, 'USD', locale)}</td>
              <td className="p-1 border border-gray-300">{formatCurrency(results.adjusted.semiMonthly, 'USD', locale)}</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="p-1 border border-gray-300 text-left">Monthly</td>
              <td className="p-1 border border-gray-300">{formatCurrency(results.unadjusted.monthly, 'USD', locale)}</td>
              <td className="p-1 border border-gray-300">{formatCurrency(results.adjusted.monthly, 'USD', locale)}</td>
            </tr>
            <tr className="bg-white">
              <td className="p-1 border border-gray-300 text-left">Quarterly</td>
              <td className="p-1 border border-gray-300">{formatCurrency(results.unadjusted.quarterly, 'USD', locale)}</td>
              <td className="p-1 border border-gray-300">{formatCurrency(results.adjusted.quarterly, 'USD', locale)}</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="p-1 border border-gray-300 text-left">Annual</td>
              <td className="p-1 border border-gray-300">{formatCurrency(results.unadjusted.annual, 'USD', locale)}</td>
              <td className="p-1 border border-gray-300">{formatCurrency(results.adjusted.annual, 'USD', locale)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
