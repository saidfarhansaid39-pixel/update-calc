"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';
import { AmortizationSchedule } from '@/components/calc-panel/AmortizationSchedule';
import { ResultInterpretation } from '@/components/calc-panel/ResultInterpretation';

export function AmortizationResults({ 
  loanAmount, 
  totalPayments,
  totalInterest,
  monthlyPayment,
  numMonths
}: any) {
  const t = useTranslations('calculatorUI');
  const locale = useLocale();
  const principalPercent = (loanAmount / totalPayments) * 100 || 0;
  const interestPercent = (totalInterest / totalPayments) * 100 || 0;
  const dashPrincipal = (principalPercent / 100) * 251.2;
  const dashInterest = (interestPercent / 100) * 251.2;
  const termYears = numMonths / 12;
  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + numMonths);
  const payoffDateStr = payoffDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
        <span>{t('results.monthlyPayLabel')}</span>
        <span className="text-xl">{formatCurrency(monthlyPayment, 'USD', locale)}</span>
      </div>
      
      <div className="p-2 border border-gray-300 border-t-0 bg-white space-y-4">
        {/* Monthly + Total breakdown */}
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="p-1.5 text-left font-medium text-gray-500"></th>
              <th className="p-1.5 text-right font-medium text-gray-500">Monthly</th>
              <th className="p-1.5 text-right font-medium text-gray-500">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="p-1.5 text-left font-medium text-gray-700">Principal &amp; Interest</td>
              <td className="p-1.5 text-right text-gray-700">{formatCurrency(monthlyPayment, 'USD', locale)}</td>
              <td className="p-1.5 text-right text-gray-700">{formatCurrency(totalPayments, 'USD', locale)}</td>
            </tr>
          </tbody>
        </table>

        {/* Payoff summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">Loan Amount</p>
            <p className="text-sm font-bold text-gray-900">{formatCurrency(loanAmount, 'USD', locale)}</p>
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
            <p className="text-xs text-gray-400">Term</p>
            <p className="text-sm font-bold text-gray-900">{termYears.toFixed(0)} years ({numMonths} payments)</p>
          </div>
        </div>

        {/* Interpretation */}
        <ResultInterpretation
          type="loan"
          values={{ monthlyPayment, totalPayments, totalInterest, principal: loanAmount, loanAmount, term: termYears }}
          currencySymbol="$"
        />

        {/* Donut chart */}
        <div className="flex justify-center items-center my-4">
          <div className="w-24 h-24 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1a5ec4" strokeWidth="20" strokeDasharray={`${dashPrincipal} 251.2`} strokeDashoffset="0" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#90be5c" strokeWidth="20" strokeDasharray={`${dashInterest} 251.2`} strokeDashoffset={`-${dashPrincipal}`} />
              <circle cx="50" cy="50" r="30" fill="white" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-gray-600">
              {Math.round(principalPercent)}%
            </div>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-white" style={{transform: 'translate(-25px, -15px)'}}>
              {Math.round(interestPercent)}%
            </div>
          </div>
          <div className="flex flex-col text-xs space-y-1 ml-4 font-bold">
            <div className="flex items-center">
              <div className="w-3 h-3 mr-2 bg-[#1a5ec4]"></div>
              <span>{t('results.principal')}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-2 bg-[#90be5c]"></div>
              <span>{t('results.interest')}</span>
            </div>
          </div>
        </div>

        {/* Amortization schedule */}
        <div className="mt-4">
          <AmortizationSchedule
            principal={loanAmount}
            rate={0}
            term={termYears}
            periodsPerYear={12}
            currencySymbol="$"
          />
        </div>
      </div>
    </div>
  );
}
