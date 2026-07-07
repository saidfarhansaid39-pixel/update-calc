"use client";

import React from 'react';

export function AmortizationResults({ 
  loanAmount, 
  totalPayments,
  totalInterest,
  monthlyPayment,
  numMonths
}: any) {
  const principalPercent = (loanAmount / totalPayments) * 100 || 0;
  const interestPercent = (totalInterest / totalPayments) * 100 || 0;
  const dashPrincipal = (principalPercent / 100) * 251.2;
  const dashInterest = (interestPercent / 100) * 251.2;

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
        <span>Monthly Pay:</span>
        <span className="text-xl">${monthlyPayment.toFixed(2)}</span>
      </div>
      
      <div className="flex items-center justify-center my-4 bg-white">
        <div className="w-20 h-20 relative">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1a5ec4" strokeWidth="20" strokeDasharray={`${dashPrincipal} 251.2`} strokeDashoffset="0" />
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#90be5c" strokeWidth="20" strokeDasharray={`${dashInterest} 251.2`} strokeDashoffset={`-${dashPrincipal}`} />
            <circle cx="50" cy="50" r="30" fill="white" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-[10px] text-gray-600">
            {Math.round(principalPercent)}%
          </div>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-[10px] text-white" style={{transform: 'translate(-20px, -12px)'}}>
            {Math.round(interestPercent)}%
          </div>
        </div>
        <div className="flex flex-col text-[11px] space-y-1 ml-4">
          <div className="flex items-center">
            <div className="w-3 h-3 mr-1 bg-[#1a5ec4]"></div>
            <span>Principal</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 mr-1 bg-[#90be5c]"></div>
            <span>Interest</span>
          </div>
        </div>
      </div>

      <table className="w-full text-sm border-collapse bg-white">
        <tbody>
          <tr className="border-t border-b border-gray-300 bg-gray-100">
            <td className="p-1.5 text-left">Total of {numMonths} monthly payments</td>
            <td className="p-1.5 text-right">${totalPayments.toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-1.5 text-left">Total interest</td>
            <td className="p-1.5 text-right">${totalInterest.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
