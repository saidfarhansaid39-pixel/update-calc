"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';
import { AmortizationSchedule } from '@/components/calc-panel/AmortizationSchedule';
import { ResultInterpretation } from '@/components/calc-panel/ResultInterpretation';

export function InterestRateResults({ results }: any) {
  const t = useTranslations('calculatorUI');
  const locale = useLocale();
  if (!results) return null;

  const { interestRate, totalPayments, totalInterest, principalPercentage, interestPercentage } = results;
  const months = results.months || 360;
  const termYears = months / 12;

  const circumference = 2 * Math.PI * 40;
  const interestDash = (interestPercentage / 100) * circumference;
  const principalDash = circumference - interestDash;

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + months);
  const payoffDateStr = payoffDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="w-full font-sans text-[13px] text-gray-800 flex flex-col gap-6">
      {/* Results Panel */}
      <div className="flex-1">
        <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center border border-[#3b7b13] rounded-t">
          <span className="text-[15px]">{t('results.resultLabel')}</span>
          <span className="text-xl">${totalPayments.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
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
                <td className="p-1.5 text-left font-medium text-gray-700">Total Payments</td>
                <td className="p-1.5 text-right text-gray-700">{formatCurrency(totalPayments / months, 'USD', locale)}</td>
                <td className="p-1.5 text-right text-gray-700">{formatCurrency(totalPayments, 'USD', locale)}</td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="p-1.5 text-left text-gray-600">Interest</td>
                <td className="p-1.5 text-right text-gray-600">{formatCurrency(totalInterest / months, 'USD', locale)}</td>
                <td className="p-1.5 text-right text-gray-600">{formatCurrency(totalInterest, 'USD', locale)}</td>
              </tr>
              <tr className="font-bold border-b border-gray-400 bg-gray-200">
                <td className="p-1.5 text-left text-gray-800">Total of {months} monthly payments</td>
                <td className="p-1.5 text-right text-gray-800">{formatCurrency(totalPayments / months, 'USD', locale)}</td>
                <td className="p-1.5 text-right text-red-600">{formatCurrency(totalPayments, 'USD', locale)}</td>
              </tr>
            </tbody>
          </table>

          {/* Payoff summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-400">Interest Rate</p>
              <p className="text-sm font-bold text-gray-900">{interestRate.toFixed(3)}%</p>
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
              <p className="text-sm font-bold text-gray-900">{termYears.toFixed(0)} years ({months} payments)</p>
            </div>
          </div>

          {/* Interpretation */}
          <ResultInterpretation
            type="loan"
            values={{
              monthlyPayment: totalPayments / months,
              totalPayments,
              totalInterest,
              principal: totalPayments - totalInterest,
              loanAmount: totalPayments - totalInterest,
              term: termYears,
            }}
            currencySymbol="$"
          />

          {/* SVG Charts */}
          <div className="w-full flex gap-4 mt-4">
            {/* Line Chart Mock */}
            <div className="flex-1">
              <h3 className="text-center font-bold mb-2">Loan Amortization Graph</h3>
              <div className="relative w-full aspect-video bg-white">
                <svg viewBox="0 0 200 100" className="w-full h-full border-l border-b border-gray-400">
                   <line x1="0" y1="25" x2="200" y2="25" stroke="#e5e7eb" strokeWidth="1" />
                   <line x1="0" y1="50" x2="200" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                   <line x1="0" y1="75" x2="200" y2="75" stroke="#e5e7eb" strokeWidth="1" />
                   <path d="M 0,0 L 200,100" fill="none" stroke="#2563eb" strokeWidth="2" />
                   <path d="M 0,100 L 200,0" fill="none" stroke="#16a34a" strokeWidth="2" />
                   <path d="M 0,100 Q 100,50 200,0" fill="none" stroke="#dc2626" strokeWidth="2" />
                </svg>
                <div className="absolute top-0 left-2 bg-white/80 text-[10px] p-1 shadow">
                   <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#2563eb]"></div>Balance</div>
                   <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#dc2626]"></div>Interest</div>
                   <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#16a34a]"></div>Payment</div>
                </div>
                <div className="absolute -left-8 top-0 text-[10px] text-gray-500 h-full flex flex-col justify-between items-end pb-4">
                  <span>$30K</span>
                  <span>$20K</span>
                  <span>$10K</span>
                  <span>$0</span>
                </div>
                <div className="absolute -bottom-4 left-0 w-full flex justify-between text-[10px] text-gray-500 px-1">
                  <span>0</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                </div>
                <div className="absolute -bottom-8 w-full text-center text-[10px] text-gray-600">Year</div>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="flex-1 flex flex-col items-center">
              <h3 className="font-bold mb-2">Payment Breakdown</h3>
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1c4587" strokeWidth="20" strokeDasharray={`${principalDash} ${circumference}`} strokeDashoffset={0} />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a0d24c" strokeWidth="20" strokeDasharray={`${interestDash} ${circumference}`} strokeDashoffset={-principalDash} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-[10px] pointer-events-none drop-shadow-md">
                  <span className="font-bold relative top-2 right-2">{interestPercentage.toFixed(0)}%</span>
                  <span className="font-bold relative bottom-2 left-2">{principalPercentage.toFixed(0)}%</span>
                </div>
              </div>
              
              <div className="mt-4 flex flex-col text-[11px] gap-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#1c4587] mr-2"></div>
                  <span>{t('results.principal')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#a0d24c] mr-2"></div>
                  <span>{t('results.interest')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amortization schedule */}
          <div className="mt-4">
            <AmortizationSchedule
              principal={totalPayments - totalInterest}
              rate={interestRate}
              term={termYears}
              periodsPerYear={12}
              currencySymbol="$"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
