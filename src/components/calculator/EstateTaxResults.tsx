"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';
import { ResultInterpretation } from '@/components/calc-panel/ResultInterpretation';

export function EstateTaxResults({ results }: any) {
  const t = useTranslations('calculatorUI');
  const locale = useLocale();
  if (!results) return null;

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800 mt-4 md:mt-0">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
        <span className="text-[16px]">{t('results.estimatedEstateTax')}</span>
      </div>
      
      <div className="bg-white border border-gray-300 border-t-0 p-4 space-y-4">
        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="p-3 text-left">Gross Estate (Sum of Assets)</td>
              <td className="p-3 text-right">{formatCurrency(results.grossEstate, 'USD', locale)}</td>
            </tr>
            <tr className="border-b border-gray-300 bg-gray-50">
              <td className="p-3 text-left">Total Deductions & Liabilities</td>
              <td className="p-3 text-right">-{formatCurrency(results.totalDeductions, 'USD', locale)}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="p-3 text-left">Lifetime Gifted Amount</td>
              <td className="p-3 text-right">+{formatCurrency(results.giftedAmount, 'USD', locale)}</td>
            </tr>
            <tr className="border-b border-gray-400 bg-gray-100">
              <td className="p-3 text-left font-bold">Total Taxable Estate</td>
              <td className="p-3 text-right font-bold">{formatCurrency(results.taxableEstate, 'USD', locale)}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="p-3 text-left text-gray-600">Federal Exemption Applied (2026)</td>
              <td className="p-3 text-right text-gray-600">-{formatCurrency(results.exemption, 'USD', locale)}</td>
            </tr>
            {results.taxableEstate > results.exemption && (
              <tr className="border-b border-gray-300 bg-red-50">
                <td className="p-3 text-left text-red-700">Amount Subject to Tax (40% rate)</td>
                <td className="p-3 text-right text-red-700">{formatCurrency(results.taxableEstate - results.exemption, 'USD', locale)}</td>
              </tr>
            )}
            <tr>
              <td className="p-3 text-left font-bold text-lg text-[#1c4587]">Estimated Federal Estate Tax Due</td>
              <td className="p-3 text-right font-bold text-lg text-[#1c4587]">{formatCurrency(results.estimatedTax, 'USD', locale)}</td>
            </tr>
          </tbody>
        </table>

        {/* Interpretation */}
        <ResultInterpretation
          type="tax"
          values={{
            income: results.taxableEstate,
            taxOwed: results.estimatedTax,
            effectiveRate: results.taxableEstate > 0 ? (results.estimatedTax / results.taxableEstate) * 100 : 0,
          }}
          currencySymbol="$"
        />

        {results.estimatedTax === 0 && (
          <div className="mt-4 p-3 bg-green-50 text-green-800 border border-green-200 rounded text-xs leading-relaxed">
            <strong>Great news!</strong> Your taxable estate is below the {formatCurrency(results.exemption, 'USD', locale)} federal exemption limit for 2026. You likely do not owe any federal estate tax. However, be sure to check your state’s specific inheritance and estate tax laws, as state exemption limits are often much lower.
          </div>
        )}

        {results.estimatedTax > 0 && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-900 border border-blue-200 rounded text-xs leading-relaxed">
            <strong>Planning note:</strong> Estate tax applies to estates exceeding the exemption threshold. Strategies such as gifting, trusts (ILIT, QPRT, GRAT), and charitable donations can reduce the taxable estate. Consult an estate planning attorney.
          </div>
        )}
      </div>
    </div>
  );
}
