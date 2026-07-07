"use client";

import React from 'react';

export function HouseAffordabilityResults({ results }: any) {
  if (!results) return null;

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800 mt-4 md:mt-0">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
        <span className="text-[16px]">Affordability Results</span>
      </div>
      
      <table className="w-full text-sm border-collapse bg-white border border-gray-300 border-t-0">
        <tbody>
          <tr className="border-b border-gray-300 bg-gray-50">
            <td className="p-3 text-left font-bold text-lg">Home Price</td>
            <td className="p-3 text-right font-bold text-lg text-green-700">${results.homePrice.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 text-left">Loan Amount</td>
            <td className="p-2 text-right">${results.loanAmount.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
          </tr>
          <tr className="border-b border-gray-300 bg-gray-50">
            <td className="p-2 text-left">Down Payment</td>
            <td className="p-2 text-right">${results.downPayment.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 text-left font-bold">Monthly Housing Cost</td>
            <td className="p-2 text-right font-bold">${results.monthlyCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
