"use client";

import React from 'react';

export function EstateTaxResults({ results }: any) {
  if (!results) return null;

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800 mt-4 md:mt-0">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
        <span className="text-[16px]">Estimated Estate Tax</span>
      </div>
      
      <table className="w-full text-sm border-collapse bg-white border border-gray-300 border-t-0">
        <tbody>
          <tr className="border-b border-gray-300">
            <td className="p-3 text-left">Gross Estate (Sum of Assets)</td>
            <td className="p-3 text-right">${results.grossEstate.toLocaleString()}</td>
          </tr>
          <tr className="border-b border-gray-300 bg-gray-50">
            <td className="p-3 text-left">Total Deductions & Liabilities</td>
            <td className="p-3 text-right">-${results.totalDeductions.toLocaleString()}</td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-3 text-left">Lifetime Gifted Amount</td>
            <td className="p-3 text-right">+${results.giftedAmount.toLocaleString()}</td>
          </tr>
          <tr className="border-b border-gray-400 bg-gray-100">
            <td className="p-3 text-left font-bold">Total Taxable Estate</td>
            <td className="p-3 text-right font-bold">${results.taxableEstate.toLocaleString()}</td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-3 text-left text-gray-600">Federal Exemption Applied (2026)</td>
            <td className="p-3 text-right text-gray-600">-${results.exemption.toLocaleString()}</td>
          </tr>
          {results.taxableEstate > results.exemption && (
            <tr className="border-b border-gray-300 bg-red-50">
              <td className="p-3 text-left text-red-700">Amount Subject to Tax (40% rate)</td>
              <td className="p-3 text-right text-red-700">${(results.taxableEstate - results.exemption).toLocaleString()}</td>
            </tr>
          )}
          <tr>
            <td className="p-3 text-left font-bold text-lg text-[#1c4587]">Estimated Federal Estate Tax Due</td>
            <td className="p-3 text-right font-bold text-lg text-[#1c4587]">${results.estimatedTax.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      {results.estimatedTax === 0 && (
        <div className="mt-4 p-3 bg-green-50 text-green-800 border border-green-200 rounded text-xs leading-relaxed">
          <strong>Great news!</strong> Your taxable estate is below the $15,000,000 federal exemption limit for 2026. You likely do not owe any federal estate tax. However, be sure to check your state's specific inheritance and estate tax laws, as state exemption limits are often much lower.
        </div>
      )}
    </div>
  );
}
