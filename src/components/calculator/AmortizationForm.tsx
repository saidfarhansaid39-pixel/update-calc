"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function AmortizationForm({ state, setters }: any) {
  const t = useTranslations('calculatorUI');
  return (
    <div className="w-full font-sans text-[13px] text-gray-800">
      <div className="bg-[#1c4587] text-white flex justify-between items-center p-2 rounded-t">
        <div className="flex items-center font-bold">
          <ChevronDown size={16} className="mr-1" />
          Modify the values and click the Calculate button to use
        </div>
      </div>
      
      <div className="bg-[#f0f0f0] p-4 border border-gray-300 rounded-b">
        <div className="grid grid-cols-[100px_1fr] gap-y-3 items-center">
          <label className="text-left pr-2">Loan amount</label>
          <div className="flex">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
            <input 
              type="text" 
              className="border border-gray-400 w-[120px] px-1 h-[28px]" 
              value={state.loanAmount}
              onChange={e => setters.setLoanAmount(e.target.value)}
            />
          </div>

          <label className="text-left pr-2">Loan term</label>
          <div className="flex items-center">
            <input 
              type="text" 
              className="border border-gray-400 w-[40px] px-1 h-[28px]" 
              value={state.loanTermYears}
              onChange={e => setters.setLoanTermYears(e.target.value)}
            />
            <span className="border border-gray-400 border-l-0 px-2 bg-gray-100 leading-[26px]">years</span>
            <input 
              type="text" 
              className="border border-gray-400 w-[40px] px-1 h-[28px] ml-2" 
              value={state.loanTermMonths}
              onChange={e => setters.setLoanTermMonths(e.target.value)}
            />
            <span className="border border-gray-400 border-l-0 px-2 bg-gray-100 leading-[26px]">months</span>
          </div>

          <label className="text-left pr-2">Interest rate</label>
          <div className="flex items-center">
            <input 
              type="text" 
              className="border border-gray-400 w-[50px] px-1 h-[28px]" 
              value={state.interestRate}
              onChange={e => setters.setInterestRate(e.target.value)}
            />
            <span className="border border-gray-400 border-l-0 px-2 bg-gray-100 leading-[26px]">%</span>
          </div>
        </div>

        <div className="mt-4 font-bold flex items-center">
          <input type="checkbox" className="mr-2 w-4 h-4" />
          <label>Optional: make extra payments</label>
        </div>

        <div className="flex gap-2 mt-4">
          <button className="bg-[#306e3e] hover:bg-[#255630] text-white px-6 py-1.5 font-bold rounded shadow border border-[#1f4a27] flex items-center gap-1">
            Calculate <span className="bg-white text-[#306e3e] rounded-full w-4 h-4 flex items-center justify-center text-[10px]">▶</span>
          </button>
          <button className="bg-[#aaaaaa] hover:bg-[#999999] text-white px-6 py-1.5 font-bold rounded shadow border border-[#888888]">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
