"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';
import { ResultInterpretation } from '@/components/calc-panel/ResultInterpretation';

export function DebtConsolidationResults({ results }: any) {
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

  const { oldDebts, newLoan, savings } = results;

  const isRecommended = savings.totalInterest > 0;
  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + newLoan.months);
  const payoffDateStr = payoffDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800 mt-4 md:mt-0">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
        <span className="text-[16px]">{t('results.resultLabel')}</span>
      </div>
      
      <div className="bg-white border border-gray-300 border-t-0 p-4 leading-relaxed">
        
        {isRecommended ? (
          <p className="mb-4 text-[16px]">
            Based on the details provided, consolidating your debts into a single loan will save you <strong className="text-[#599e28]">{formatCurrency(savings.totalInterest, 'USD', locale)}</strong> in total interest!
          </p>
        ) : (
          <p className="mb-4 text-[16px]">
            Based on the details provided, consolidating your debts will <strong className="text-red-600">cost you more</strong> over the long run. You will pay <strong className="text-red-600">{formatCurrency(Math.abs(savings.totalInterest), 'USD', locale)}</strong> more in interest and fees.
          </p>
        )}

        {/* Payoff summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">New Monthly Payment</p>
            <p className="text-sm font-bold text-gray-900">{formatCurrency(newLoan.monthlyPayment, 'USD', locale)}</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">Payoff Date</p>
            <p className="text-sm font-bold text-gray-900">{payoffDateStr}</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">Total Interest</p>
            <p className="text-sm font-bold text-red-600">{formatCurrency(newLoan.totalCost - newLoan.principal, 'USD', locale)}</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">Payoff Term</p>
            <p className="text-sm font-bold text-gray-900">{newLoan.months} months ({(newLoan.months / 12).toFixed(1)} years)</p>
          </div>
        </div>

        {/* Interpretation */}
        <ResultInterpretation
          type="debt"
          values={{
            balance: newLoan.principal,
            monthly: newLoan.monthlyPayment,
            totalInterest: newLoan.totalCost - newLoan.principal,
          }}
          currencySymbol="$"
        />

        <h3 className="font-bold text-[16px] text-black border-b pb-1 mb-2">Before Consolidation</h3>
        <div className="grid grid-cols-[1fr_auto] gap-y-1 mb-6 text-sm">
          <div>Total combined debt:</div>
          <div className="font-bold text-right">{formatCurrency(oldDebts.totalPrincipal, 'USD', locale)}</div>
          
          <div>Combined monthly payments:</div>
          <div className="font-bold text-right">{formatCurrency(oldDebts.monthlyPayment, 'USD', locale)}</div>
          
          <div>Time to pay off:</div>
          <div className="font-bold text-right">{oldDebts.months} months</div>
          
          <div>Total interest paid:</div>
          <div className="font-bold text-right">{formatCurrency(oldDebts.totalInterest, 'USD', locale)}</div>
        </div>

        <h3 className="font-bold text-[16px] text-black border-b pb-1 mb-2">After Consolidation</h3>
        <div className="grid grid-cols-[1fr_auto] gap-y-1 mb-6 text-sm">
          <div>New loan amount:</div>
          <div className="font-bold text-right">{formatCurrency(newLoan.principal, 'USD', locale)}</div>
          
          <div>New monthly payment:</div>
          <div className="font-bold text-right text-[#1c4587]">{formatCurrency(newLoan.monthlyPayment, 'USD', locale)}</div>
          
          <div>Time to pay off:</div>
          <div className="font-bold text-right">{newLoan.months} months</div>
          
          <div>Total interest & fees paid:</div>
          <div className="font-bold text-right">{formatCurrency(newLoan.totalCost, 'USD', locale)}</div>
          
          {newLoan.fee > 0 && (
            <>
              <div className="text-gray-500 pl-4 text-xs">- Includes upfront fee:</div>
              <div className="text-gray-500 text-right text-xs">{formatCurrency(newLoan.fee, 'USD', locale)}</div>
            </>
          )}
        </div>

        <h3 className="font-bold text-[16px] text-black border-b pb-1 mb-2">The Difference</h3>
        <div className="grid grid-cols-[1fr_auto] gap-y-1 text-sm">
          <div>Monthly payment difference:</div>
          <div className={`font-bold text-right ${savings.monthlyPayment > 0 ? 'text-[#599e28]' : savings.monthlyPayment < 0 ? 'text-red-600' : ''}`}>
            {savings.monthlyPayment > 0 ? 'Save ' : (savings.monthlyPayment < 0 ? 'Pay Extra ' : '')}
            {formatCurrency(Math.abs(savings.monthlyPayment), 'USD', locale)}
          </div>
          
          <div>Total cost difference:</div>
          <div className={`font-bold text-right ${savings.totalInterest > 0 ? 'text-[#599e28]' : savings.totalInterest < 0 ? 'text-red-600' : ''}`}>
            {savings.totalInterest > 0 ? 'Save ' : (savings.totalInterest < 0 ? 'Cost Extra ' : '')}
            {formatCurrency(Math.abs(savings.totalInterest), 'USD', locale)}
          </div>
          
          <div>Time difference:</div>
          <div className="font-bold text-right">
            {savings.months > 0 ? `Pay off ${savings.months} months sooner` : (savings.months < 0 ? `Take ${Math.abs(savings.months)} months longer` : 'Same payoff time')}
          </div>
        </div>

      </div>
    </div>
  );
}
