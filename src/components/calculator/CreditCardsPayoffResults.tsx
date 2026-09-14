"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';
import { ResultInterpretation } from '@/components/calc-panel/ResultInterpretation';

export function CreditCardsPayoffResults({ results }: any) {
  const t = useTranslations('calculatorUI');
  const locale = useLocale();
  if (!results) return null;

  if (results.error) {
    return (
      <div className="w-full font-sans text-[13px] text-gray-800 mt-4 md:mt-0 p-4 border border-red-400 bg-red-50 text-red-800 rounded">
        <strong>Error:</strong> {results.error}
      </div>
    );
  }

  const { totalMonths, totalInterest, totalPaid, cardStats, schedule } = results;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const timeString = years > 0 ? `${years} years and ${months} months` : `${months} months`;
  const totalPrincipal = cardStats.reduce((s: number, c: any) => s + c.balance, 0);
  const avgMonthlyPayment = totalPaid / totalMonths;

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + totalMonths);
  const payoffDateStr = payoffDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800 mt-4 md:mt-0">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
        <span className="text-[16px]">{t('results.resultLabel')}</span>
      </div>
      
      <div className="bg-white border border-gray-300 border-t-0 p-4 leading-relaxed">
        <p className="mb-2 text-[16px]">
          Using the <strong>Debt Avalanche</strong> method, it will take you <strong>{timeString}</strong> ({totalMonths} months) to pay off all your credit cards!
        </p>

        {/* Payoff summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">Total Debt</p>
            <p className="text-sm font-bold text-gray-900">{formatCurrency(totalPrincipal, 'USD', locale)}</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">Total Interest</p>
            <p className="text-sm font-bold text-red-600">{formatCurrency(totalInterest, 'USD', locale)}</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">Payoff Date</p>
            <p className="text-sm font-bold text-gray-900">{payoffDateStr}</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">Monthly Payment</p>
            <p className="text-sm font-bold text-gray-900">{formatCurrency(avgMonthlyPayment, 'USD', locale)}</p>
          </div>
        </div>

        {/* Interpretation */}
        <ResultInterpretation
          type="debt"
          values={{
            balance: totalPrincipal,
            monthly: avgMonthlyPayment,
            totalInterest,
          }}
          currencySymbol="$"
        />

        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="bg-[#e4eedb] border border-[#599e28] p-4 text-center rounded">
            <div className="text-[14px] text-gray-700">{t('results.totalInterestPaid')}</div>
            <div className="text-[24px] font-bold text-[#1c4587]">
              {formatCurrency(totalInterest, 'USD', locale)}
            </div>
          </div>
          <div className="bg-gray-100 border border-gray-300 p-4 text-center rounded">
            <div className="text-[14px] text-gray-700">{t('results.totalAmountPaid')}</div>
            <div className="text-[24px] font-bold text-gray-800">
              {formatCurrency(totalPaid, 'USD', locale)}
            </div>
          </div>
        </div>

        <h3 className="font-bold text-[16px] text-[#1c4587] mb-2 mt-4">Card Payoff Summary</h3>
        <table className="w-full border-collapse text-left text-[13px] border border-gray-300 mb-6">
          <thead>
            <tr className="bg-[#466a9b] text-white">
              <th className="p-2 border border-gray-300 font-bold">Credit Card</th>
              <th className="p-2 border border-gray-300 font-bold">Payoff Time</th>
              <th className="p-2 border border-gray-300 font-bold">Total Interest Paid</th>
            </tr>
          </thead>
          <tbody className="bg-[#f2f2f2]">
            {cardStats.map((stat: any, idx: number) => (
              <tr key={idx} className="border-b border-white hover:bg-[#e6e6e6]">
                <td className="p-2 font-bold">{stat.name || `Card ${idx + 1}`}</td>
                <td className="p-2">{stat.monthsToPayoff} months</td>
                <td className="p-2">{formatCurrency(stat.interestPaid, 'USD', locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-3 bg-blue-50 text-blue-900 border border-blue-200 rounded text-[12px]">
          <strong>Note on Debt Avalanche:</strong> This method saves you money by aggressively paying off the highest interest cards first while maintaining minimum payments on the rest.
        </div>
      </div>
    </div>
  );
}
