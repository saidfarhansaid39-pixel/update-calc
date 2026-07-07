"use client";

import React from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function RentForm({ state, setters, handleCalculate, handleClear }: any) {
  const t = useTranslations('calculatorUI');
  return (
    <div className="w-full font-sans text-[13px] text-gray-800">
      <div className="bg-[#1c4587] text-white flex justify-between items-center p-2 rounded-t">
        <div className="flex items-center font-bold">
          <ChevronDown size={16} className="mr-1" />
          {t('sections.modifyInstructions')}
        </div>
      </div>
      
      <div className="bg-[#f0f0f0] p-4 border border-gray-300 rounded-b">
        <div className="grid grid-cols-[160px_1fr] gap-y-3 items-center">
          
          <label className="text-left pr-2 flex items-center">
            {t('formLabels.pretaxIncome')}
          </label>
          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center">
              <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
              <input 
                type="text" 
                className="border border-gray-400 w-[120px] px-1 h-[28px]" 
                value={state.income}
                onChange={e => setters.setIncome(e.target.value)}
              />
            </div>
            <select 
              className="border border-gray-400 h-[28px] px-1"
              value={state.incomeFrequency}
              onChange={e => setters.setIncomeFrequency(e.target.value)}
            >
              <option>per year</option>
              <option>per month</option>
            </select>
          </div>

          <label className="text-left pr-2 flex items-center">
            {t('formLabels.monthlyDebt')} <HelpCircle size={12} className="ml-1 text-gray-500" />
          </label>
          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center">
              <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
              <input 
                type="text" 
                className="border border-gray-400 w-[80px] px-1 h-[28px]" 
                value={state.debt}
                onChange={e => setters.setDebt(e.target.value)}
              />
            </div>
            <span className="text-gray-600">car/student loan, credit cards, etc</span>
          </div>

        </div>

        <div className="flex gap-2 mt-4 md:ml-[160px]">
          <button 
            onClick={handleCalculate}
            className="bg-[#306e3e] hover:bg-[#255630] text-white px-6 py-1.5 font-bold rounded shadow border border-[#1f4a27] flex items-center gap-1"
          >
            {t('buttons.calculate')} <span className="bg-white text-[#306e3e] rounded-full w-4 h-4 flex items-center justify-center text-[10px]">▶</span>
          </button>
          <button 
            onClick={handleClear}
            className="bg-[#aaaaaa] hover:bg-[#999999] text-white px-6 py-1.5 font-bold rounded shadow border border-[#888888]"
          >
            {t('buttons.clear')}
          </button>
        </div>
      </div>
    </div>
  );
}
