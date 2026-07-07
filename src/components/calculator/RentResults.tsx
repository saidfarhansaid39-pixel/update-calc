"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

export function RentResults({ results }: any) {
  const t = useTranslations('calculatorUI');
  if (!results) return null;

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800 mt-4 md:mt-0">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
        <span className="text-[16px]">{t('sections.rentAffordabilityResults')}</span>
      </div>
      
      <div className="bg-white border border-gray-300 border-t-0 p-4">
        <p className="mb-4">Based on your income and debts, here are the monthly rent budgets you can afford:</p>
        
        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr className="border-b border-gray-200 bg-green-50">
              <td className="p-3 text-left font-bold text-green-800">
                <div className="text-[15px]">Recommended Budget</div>
                <div className="text-[11px] font-normal text-green-700">Using the standard 30% rule</div>
              </td>
              <td className="p-3 text-right font-bold text-[18px] text-green-700">
                ${results.recommended.toLocaleString(undefined, {maximumFractionDigits: 0})}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-3 text-left">
                <div className="font-bold text-gray-700">Conservative Budget</div>
                <div className="text-[11px] text-gray-500">Using a 25% allocation</div>
              </td>
              <td className="p-3 text-right font-bold text-[16px] text-gray-700">
                ${results.conservative.toLocaleString(undefined, {maximumFractionDigits: 0})}
              </td>
            </tr>
            <tr className="">
              <td className="p-3 text-left">
                <div className="font-bold text-red-700">Maximum Budget (DTI limit)</div>
                <div className="text-[11px] text-red-500">Max 43% Debt-To-Income minus your other debts</div>
              </td>
              <td className="p-3 text-right font-bold text-[16px] text-red-600">
                ${results.maximum.toLocaleString(undefined, {maximumFractionDigits: 0})}
              </td>
            </tr>
          </tbody>
        </table>

        {results.maximum < results.recommended && (
          <div className="mt-4 p-3 bg-red-50 text-red-800 border border-red-200 rounded text-xs">
            <strong>Note:</strong> Your high monthly debt is lowering your maximum allowed rent significantly. You may find it difficult to get approved for the recommended rent amount.
          </div>
        )}
      </div>
    </div>
  );
}
