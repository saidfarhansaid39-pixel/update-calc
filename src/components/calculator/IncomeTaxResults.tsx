"use client";

import React from 'react';

export function IncomeTaxResults({ 
  wages, 
  fedWithheld,
  taxOwed,
  effectiveRate
}: any) {
  const isRefund = fedWithheld > taxOwed;
  const difference = Math.abs(fedWithheld - taxOwed);

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800 mt-6">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
        <span>{isRefund ? 'Estimated Tax Refund:' : 'Estimated Tax Due:'}</span>
        <span className="text-xl">${difference.toFixed(2)}</span>
      </div>
      
      <table className="w-full text-sm border-collapse bg-white border border-gray-300 border-t-0">
        <tbody>
          <tr className="border-b border-gray-300 bg-gray-50">
            <td className="p-2 text-left">Total Income (AGI)</td>
            <td className="p-2 text-right font-bold">${wages.toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 text-left">Estimated Federal Tax Owed</td>
            <td className="p-2 text-right">${taxOwed.toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-300 bg-gray-50">
            <td className="p-2 text-left">Taxes Already Withheld</td>
            <td className="p-2 text-right">${fedWithheld.toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 text-left font-bold">{isRefund ? 'Refund Amount' : 'Amount You Owe'}</td>
            <td className="p-2 text-right font-bold text-red-600">${difference.toFixed(2)}</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="p-2 text-left">Effective Tax Rate</td>
            <td className="p-2 text-right">{effectiveRate.toFixed(2)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
