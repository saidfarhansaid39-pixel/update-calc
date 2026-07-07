"use client";

import React from 'react';

export function CreditCardsPayoffResults({ results }: any) {
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

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800 mt-4 md:mt-0">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
        <span className="text-[16px]">Results</span>
      </div>
      
      <div className="bg-white border border-gray-300 border-t-0 p-4 leading-relaxed">
        <p className="mb-2 text-[16px]">
          Using the <strong>Debt Avalanche</strong> method, it will take you <strong>{timeString}</strong> ({totalMonths} months) to pay off all your credit cards!
        </p>
        
        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="bg-[#e4eedb] border border-[#599e28] p-4 text-center rounded">
            <div className="text-[14px] text-gray-700">Total Interest Paid</div>
            <div className="text-[24px] font-bold text-[#1c4587]">
              ${totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
          </div>
          <div className="bg-gray-100 border border-gray-300 p-4 text-center rounded">
            <div className="text-[14px] text-gray-700">Total Amount Paid</div>
            <div className="text-[24px] font-bold text-gray-800">
              ${totalPaid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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
                <td className="p-2">${stat.interestPaid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-3 bg-blue-50 text-blue-900 border border-blue-200 rounded text-[12px]">
          <strong>Note on Debt Avalanche:</strong> This method saved you money by aggressively paying off the highest interest cards first while maintaining minimum payments on the rest.
        </div>
      </div>
    </div>
  );
}
