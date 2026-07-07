"use client";

import React from 'react';

export function AutoLoanResults({ 
  totalLoanAmount, 
  salesTax, 
  upfrontPayment, 
  totalPayments,
  totalInterest,
  totalCost,
  monthlyPayment
}: any) {
  const principalPercent = (totalLoanAmount / totalPayments) * 100;
  const interestPercent = (totalInterest / totalPayments) * 100;
  const dashPrincipal = (principalPercent / 100) * 251.2;
  const dashInterest = (interestPercent / 100) * 251.2;

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
        <span>Monthly Pay:</span>
        <span className="text-xl">${monthlyPayment.toFixed(2)}</span>
      </div>
      
      <table className="w-full text-sm border-collapse">
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="p-2 text-left">Total Loan Amount</td>
            <td className="p-2 text-right">${totalLoanAmount.toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-200 bg-gray-50">
            <td className="p-2 text-left">Sale Tax</td>
            <td className="p-2 text-right">${salesTax.toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="p-2 text-left flex items-center gap-1">Upfront Payment <span className="text-gray-400 border border-gray-400 rounded-full w-3 h-3 flex items-center justify-center text-[9px]">?</span></td>
            <td className="p-2 text-right">${upfrontPayment.toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-200 bg-gray-50 mt-2">
            <td className="p-2 text-left">Total of 60 Loan Payments</td>
            <td className="p-2 text-right">${totalPayments.toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="p-2 text-left">Total Loan Interest</td>
            <td className="p-2 text-right">${totalInterest.toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-200 bg-gray-50 font-bold">
            <td className="p-2 text-left">Total Cost (price, interest, tax, fees)</td>
            <td className="p-2 text-right">${totalCost.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex flex-col items-center my-6">
        <h4 className="font-bold text-center mb-2">Loan Breakdown</h4>
        <div className="flex items-center">
          <div className="w-32 h-32 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1a5ec4" strokeWidth="20" strokeDasharray={`${dashPrincipal} 251.2`} strokeDashoffset="0" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#90be5c" strokeWidth="20" strokeDasharray={`${dashInterest} 251.2`} strokeDashoffset={`-${dashPrincipal}`} />
              <circle cx="50" cy="50" r="30" fill="white" />
            </svg>
          </div>
          <div className="flex flex-col text-xs space-y-1 ml-4 font-bold">
            <div className="flex items-center">
              <div className="w-3 h-3 mr-2 bg-[#1a5ec4]"></div>
              <span>Principal</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-2 bg-[#90be5c]"></div>
              <span>Interest</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-2">
        <span className="text-blue-600 underline">Find Average Tax Rate and Fees in Your State.</span>
      </div>
    </div>
  );
}
