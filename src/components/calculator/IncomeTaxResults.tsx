"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';
import { ResultInterpretation } from '@/components/calc-panel/ResultInterpretation';

export function IncomeTaxResults({ 
  wages, 
  fedWithheld,
  taxOwed,
  effectiveRate
}: any) {
  const t = useTranslations('calculatorUI');
  const locale = useLocale();
  const isRefund = fedWithheld > taxOwed;
  const difference = Math.abs(fedWithheld - taxOwed);

  const marginalRates = [
    { bracket: '10%', from: 0, to: 11600 },
    { bracket: '12%', from: 11601, to: 47150 },
    { bracket: '22%', from: 47151, to: 100525 },
    { bracket: '24%', from: 100526, to: 191950 },
    { bracket: '32%', from: 191951, to: 243725 },
    { bracket: '35%', from: 243726, to: 609350 },
    { bracket: '37%', from: 609351, to: Infinity },
  ];

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800 mt-6">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
        <span>{isRefund ? t('results.estimatedTaxRefund') : t('results.estimatedTaxDue')}</span>
        <span className="text-xl">{formatCurrency(difference, 'USD', locale)}</span>
      </div>
      
      <div className="p-2 border border-gray-300 border-t-0 bg-white space-y-4">
        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr className="border-b border-gray-300 bg-gray-50">
              <td className="p-2 text-left">Total Income (AGI)</td>
              <td className="p-2 text-right font-bold">{formatCurrency(wages, 'USD', locale)}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="p-2 text-left">Estimated Federal Tax Owed</td>
              <td className="p-2 text-right">{formatCurrency(taxOwed, 'USD', locale)}</td>
            </tr>
            <tr className="border-b border-gray-300 bg-gray-50">
              <td className="p-2 text-left">Taxes Already Withheld</td>
              <td className="p-2 text-right">{formatCurrency(fedWithheld, 'USD', locale)}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="p-2 text-left font-bold">{isRefund ? 'Refund Amount' : 'Amount You Owe'}</td>
              <td className="p-2 text-right font-bold text-red-600">{formatCurrency(difference, 'USD', locale)}</td>
            </tr>
            <tr className="border-b border-gray-300 bg-gray-50">
              <td className="p-2 text-left">Effective Tax Rate</td>
              <td className="p-2 text-right">{effectiveRate.toFixed(2)}%</td>
            </tr>
            <tr>
              <td className="p-2 text-left">Marginal Tax Rate</td>
              <td className="p-2 text-right">
                {marginalRates.find(r => wages >= r.from && wages <= r.to)?.bracket || '—'}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Interpretation */}
        <ResultInterpretation
          type="tax"
          values={{ income: wages, taxOwed, fedWithheld, effectiveRate }}
          currencySymbol="$"
        />

        {/* Tax breakdown chart */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">How Your Tax is Calculated</p>
          <div className="space-y-1">
            {marginalRates.filter(r => wages >= r.from).map((r, i) => {
              const taxableInBracket = Math.min(wages, r.to) - r.from + 1
              if (taxableInBracket <= 0) return null
              const bracketTax = taxableInBracket * (parseInt(r.bracket) / 100)
              const pctOfTotal = (bracketTax / taxOwed) * 100
              return (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-12 text-right text-gray-500">{r.bracket}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-[#1c4587] rounded-full"
                      style={{ width: `${Math.min(100, pctOfTotal)}%` }}
                    />
                  </div>
                  <span className="w-20 text-right text-gray-600">{formatCurrency(bracketTax, 'USD', locale)}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
