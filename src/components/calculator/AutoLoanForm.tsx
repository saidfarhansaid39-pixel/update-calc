"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function AutoLoanForm({ state, setters }: any) {
  const t = useTranslations('calculatorUI');
  return (
    <div className="w-full font-sans text-[13px] text-gray-800">
      <div className="flex font-bold text-[14px]">
        <div className="bg-white border-t border-l border-r border-gray-300 px-4 py-2 cursor-default">Total Price</div>
        <div className="bg-[#1c4587] text-white px-4 py-2 border-t border-l border-r border-[#1c4587] cursor-pointer hover:bg-[#153465]">Monthly Payment</div>
      </div>
      
      <div className="bg-[#1c4587] text-white flex justify-between items-center p-2">
        <div className="flex items-center">
          <ChevronDown size={16} className="mr-1" />
          <span className="font-bold">Modify the values and click the Calculate button to use</span>
        </div>
      </div>
      
      <div className="bg-[#f0f0f0] p-4 border border-gray-300 rounded-b">
        <div className="grid grid-cols-[140px_1fr] gap-y-2 items-center">
          <label className="text-right pr-2">Auto Price</label>
          <div className="flex">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
            <input 
              type="text" 
              className="border border-gray-400 w-[120px] px-1 h-[28px]" 
              value={state.autoPrice}
              onChange={e => setters.setAutoPrice(e.target.value)}
            />
          </div>

          <label className="text-right pr-2">Loan Term</label>
          <div className="flex items-center">
            <input 
              type="text" 
              className="border border-gray-400 w-[50px] px-1 h-[28px]" 
              value={state.loanTerm}
              onChange={e => setters.setLoanTerm(e.target.value)}
            />
            <span className="border border-gray-400 border-l-0 px-2 bg-gray-100 leading-[26px]">months</span>
          </div>

          <label className="text-right pr-2">Interest Rate</label>
          <div className="flex items-center">
            <input 
              type="text" 
              className="border border-gray-400 w-[50px] px-1 h-[28px]" 
              value={state.interestRate}
              onChange={e => setters.setInterestRate(e.target.value)}
            />
            <span className="border border-gray-400 border-l-0 px-2 bg-gray-100 leading-[26px]">%</span>
          </div>

          <label className="text-right pr-2 flex justify-end items-center gap-1">Cash Incentives <span className="text-gray-400 border border-gray-400 rounded-full w-3 h-3 flex items-center justify-center text-[9px]">?</span></label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
            <input 
              type="text" 
              className="border border-gray-400 w-[100px] px-1 h-[28px]" 
              value={state.cashIncentives}
              onChange={e => setters.setCashIncentives(e.target.value)}
            />
          </div>

          <label className="text-right pr-2 flex justify-end items-center gap-1">Down Payment <span className="text-gray-400 border border-gray-400 rounded-full w-3 h-3 flex items-center justify-center text-[9px]">?</span></label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
            <input 
              type="text" 
              className="border border-gray-400 w-[100px] px-1 h-[28px]" 
              value={state.downPayment}
              onChange={e => setters.setDownPayment(e.target.value)}
            />
          </div>

          <label className="text-right pr-2 flex justify-end items-center gap-1">Trade-in Value <span className="text-gray-400 border border-gray-400 rounded-full w-3 h-3 flex items-center justify-center text-[9px]">?</span></label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
            <input 
              type="text" 
              className="border border-gray-400 w-[100px] px-1 h-[28px]" 
              value={state.tradeInValue}
              onChange={e => setters.setTradeInValue(e.target.value)}
            />
          </div>

          <label className="text-right pr-2 flex justify-end items-center gap-1">Amount Owed<br/>on Trade-in <span className="text-gray-400 border border-gray-400 rounded-full w-3 h-3 flex items-center justify-center text-[9px]">?</span></label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
            <input 
              type="text" 
              className="border border-gray-400 w-[100px] px-1 h-[28px]" 
              value={state.amountOwedOnTradeIn}
              onChange={e => setters.setAmountOwedOnTradeIn(e.target.value)}
            />
          </div>

          <label className="text-right pr-2">Your State</label>
          <select className="border border-gray-400 h-[28px] px-1 w-[120px]" value={state.state} onChange={e => setters.setState(e.target.value)}>
            <option>-- Select --</option>
          </select>

          <label className="text-right pr-2 flex justify-end items-center gap-1">Sales Tax <span className="text-gray-400 border border-gray-400 rounded-full w-3 h-3 flex items-center justify-center text-[9px]">?</span></label>
          <div className="flex items-center">
            <input 
              type="text" 
              className="border border-gray-400 w-[40px] px-1 h-[28px]" 
              value={state.salesTax}
              onChange={e => setters.setSalesTax(e.target.value)}
            />
            <span className="border border-gray-400 border-l-0 px-2 bg-gray-100 leading-[26px]">%</span>
          </div>

          <label className="text-right pr-2 flex justify-end items-center gap-1">Title, Registration<br/>and Other Fees <span className="text-gray-400 border border-gray-400 rounded-full w-3 h-3 flex items-center justify-center text-[9px]">?</span></label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
            <input 
              type="text" 
              className="border border-gray-400 w-[100px] px-1 h-[28px]" 
              value={state.titleRegistration}
              onChange={e => setters.setTitleRegistration(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-2 ml-[140px]">
          <label className="flex items-center">
            <input type="checkbox" checked={true} className="mr-2" readOnly />
            Include taxes and fees in loan
          </label>
        </div>

        <div className="flex gap-2 ml-[140px] mt-4">
          <button className="bg-[#306e3e] hover:bg-[#255630] text-white px-6 py-1.5 font-bold rounded shadow border border-[#1f4a27] flex items-center gap-1">
            Calculate <span className="bg-white text-[#306e3e] rounded-full w-4 h-4 flex items-center justify-center text-[10px]">▶</span>
          </button>
        </div>
      </div>
    </div>
  );
}
