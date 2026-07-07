"use client";

import React from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function HouseAffordabilityForm1({ state, setters, handleCalculate, handleClear }: any) {
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
        <div className="grid grid-cols-[160px_1fr] gap-y-3 items-center">
          
          <label className="text-left pr-2 flex items-center">
            Annual household income <HelpCircle size={12} className="ml-1 text-gray-500" />
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
            <span className="text-gray-600">salary + other incomes (before tax)</span>
          </div>

          <label className="text-left pr-2">Mortgage loan term</label>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              className="border border-gray-400 w-[80px] px-1 h-[28px]" 
              value={state.term}
              onChange={e => setters.setTerm(e.target.value)}
            />
            <span>years</span>
          </div>

          <label className="text-left pr-2">Interest rate</label>
          <div className="flex items-center">
            <input 
              type="text" 
              className="border border-gray-400 w-[80px] px-1 h-[28px]" 
              value={state.rate}
              onChange={e => setters.setRate(e.target.value)}
            />
            <span className="border border-gray-400 border-l-0 px-2 bg-gray-100 leading-[26px]">%</span>
          </div>

          <label className="text-left pr-2 flex items-center">
            Monthly debt payback <HelpCircle size={12} className="ml-1 text-gray-500" />
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
            <span className="text-gray-600">long-term debts, car, student loan, etc</span>
          </div>

          <label className="text-left pr-2">Down payment</label>
          <div className="flex items-center">
            <input 
              type="text" 
              className="border border-gray-400 w-[80px] px-1 h-[28px]" 
              value={state.downPayment}
              onChange={e => setters.setDownPayment(e.target.value)}
            />
            <select className="border border-gray-400 ml-1 h-[28px] px-1" value={state.downPaymentType} onChange={e => setters.setDownPaymentType(e.target.value)}>
              <option>%</option>
              <option>$</option>
            </select>
          </div>

          <label className="text-left pr-2">Property tax</label>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <input 
                type="text" 
                className="border border-gray-400 w-[80px] px-1 h-[28px]" 
                value={state.propertyTax}
                onChange={e => setters.setPropertyTax(e.target.value)}
              />
              <select className="border border-gray-400 ml-1 h-[28px] px-1" value={state.propertyTaxType} onChange={e => setters.setPropertyTaxType(e.target.value)}>
                <option>%</option>
                <option>$</option>
              </select>
            </div>
            <span>per year</span>
          </div>

          <label className="text-left pr-2">HOA or co-op fee</label>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <input 
                type="text" 
                className="border border-gray-400 w-[80px] px-1 h-[28px]" 
                value={state.hoa}
                onChange={e => setters.setHoa(e.target.value)}
              />
              <select className="border border-gray-400 ml-1 h-[28px] px-1" value={state.hoaType} onChange={e => setters.setHoaType(e.target.value)}>
                <option>%</option>
                <option>$</option>
              </select>
            </div>
            <span>per year</span>
          </div>

          <label className="text-left pr-2">Insurance</label>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <input 
                type="text" 
                className="border border-gray-400 w-[80px] px-1 h-[28px]" 
                value={state.insurance}
                onChange={e => setters.setInsurance(e.target.value)}
              />
              <select className="border border-gray-400 ml-1 h-[28px] px-1" value={state.insuranceType} onChange={e => setters.setInsuranceType(e.target.value)}>
                <option>%</option>
                <option>$</option>
              </select>
            </div>
            <span>per year</span>
          </div>

          <label className="text-left pr-2">Debt-to-income (DTI) ratio</label>
          <select 
            className="border border-gray-400 w-[200px] px-1 h-[28px]"
            value={state.dti}
            onChange={e => setters.setDti(e.target.value)}
          >
            <option>Conventional loan (28/36 rule)</option>
            <option>FHA loan (31/43 rule)</option>
            <option>VA loan (41/41 rule)</option>
          </select>

        </div>

        <div className="flex gap-2 mt-4 md:ml-[160px]">
          <button 
            onClick={handleCalculate}
            className="bg-[#306e3e] hover:bg-[#255630] text-white px-6 py-1.5 font-bold rounded shadow border border-[#1f4a27] flex items-center gap-1"
          >
            Calculate <span className="bg-white text-[#306e3e] rounded-full w-4 h-4 flex items-center justify-center text-[10px]">▶</span>
          </button>
          <button 
            onClick={handleClear}
            className="bg-[#aaaaaa] hover:bg-[#999999] text-white px-6 py-1.5 font-bold rounded shadow border border-[#888888]"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
