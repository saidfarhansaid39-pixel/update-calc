"use client";

import React from 'react';

export function InterestRateResults({ results }: any) {
  if (!results) return null;

  const { interestRate, totalPayments, totalInterest, principalPercentage, interestPercentage } = results;

  const circumference = 2 * Math.PI * 40; // radius 40
  const interestDash = (interestPercentage / 100) * circumference;
  const principalDash = circumference - interestDash;

  return (
    <div className="w-full font-sans text-[13px] text-gray-800 flex flex-col md:flex-row gap-6">
      {/* Results Panel */}
      <div className="flex-1">
        <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center border border-[#3b7b13] rounded-t">
          <span className="text-[15px]">Results</span>
          <span className="text-[10px] bg-white text-[#599e28] px-1 py-0.5 rounded cursor-pointer flex items-center gap-1">
             <span className="text-[8px]">💾</span> save
          </span>
        </div>
        
        <table className="w-full text-right border-collapse bg-white border border-gray-300 border-t-0">
          <tbody>
            <tr className="border-b border-gray-300 bg-gray-50">
              <td className="p-2 text-left font-bold">Interest rate</td>
              <td className="p-2 text-right font-bold">{interestRate.toFixed(3)}%</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="p-2 text-left">Total of {results.months} monthly payments</td>
              <td className="p-2 text-right">${totalPayments.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            </tr>
            <tr className="border-b border-gray-300 bg-gray-50">
              <td className="p-2 text-left">Total interest paid</td>
              <td className="p-2 text-right">${totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SVG Charts */}
      <div className="w-full md:w-[450px] flex gap-4 mt-4 md:mt-0">
        
        {/* Line Chart Mock */}
        <div className="flex-1">
          <h3 className="text-center font-bold mb-2">Loan Amortization Graph</h3>
          <div className="relative w-full aspect-video bg-white">
            <svg viewBox="0 0 200 100" className="w-full h-full border-l border-b border-gray-400">
               {/* Grid lines */}
               <line x1="0" y1="25" x2="200" y2="25" stroke="#e5e7eb" strokeWidth="1" />
               <line x1="0" y1="50" x2="200" y2="50" stroke="#e5e7eb" strokeWidth="1" />
               <line x1="0" y1="75" x2="200" y2="75" stroke="#e5e7eb" strokeWidth="1" />
               
               {/* Balance line (blue going down) */}
               <path d="M 0,0 L 200,100" fill="none" stroke="#2563eb" strokeWidth="2" />
               {/* Payment line (green going up) */}
               <path d="M 0,100 L 200,0" fill="none" stroke="#16a34a" strokeWidth="2" />
               {/* Interest line (red curve) */}
               <path d="M 0,100 Q 100,50 200,0" fill="none" stroke="#dc2626" strokeWidth="2" />
            </svg>
            <div className="absolute top-0 left-2 bg-white/80 text-[10px] p-1 shadow">
               <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#2563eb]"></div>Balance</div>
               <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#dc2626]"></div>Interest</div>
               <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#16a34a]"></div>Payment</div>
            </div>
            {/* Y axis labels */}
            <div className="absolute -left-8 top-0 text-[10px] text-gray-500 h-full flex flex-col justify-between items-end pb-4">
              <span>$30K</span>
              <span>$20K</span>
              <span>$10K</span>
              <span>$0</span>
            </div>
            {/* X axis labels */}
            <div className="absolute -bottom-4 left-0 w-full flex justify-between text-[10px] text-gray-500 px-1">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
            </div>
            <div className="absolute -bottom-8 w-full text-center text-[10px] text-gray-600">Year</div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="flex-1 flex flex-col items-center">
          <h3 className="font-bold mb-2">Payment Breakdown</h3>
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#1c4587" // Principal
                strokeWidth="20"
                strokeDasharray={`${principalDash} ${circumference}`}
                strokeDashoffset={0}
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#a0d24c" // Interest
                strokeWidth="20"
                strokeDasharray={`${interestDash} ${circumference}`}
                strokeDashoffset={-principalDash}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-[10px] pointer-events-none drop-shadow-md">
              <span className="font-bold relative top-2 right-2">{interestPercentage.toFixed(0)}%</span>
              <span className="font-bold relative bottom-2 left-2">{principalPercentage.toFixed(0)}%</span>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col text-[11px] gap-1">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#1c4587] mr-2"></div>
              <span>Principal</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#a0d24c] mr-2"></div>
              <span>Interest</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
