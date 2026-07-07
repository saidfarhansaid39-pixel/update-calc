"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function EstateTaxForm({ state, setters, handleCalculate, handleClear }: any) {
  const t = useTranslations('calculatorUI');
  const InputRow = ({ label, value, setter }: any) => (
    <div className="grid grid-cols-[1fr_120px] md:grid-cols-[250px_120px] gap-2 items-center mb-2">
      <label className="text-left pr-2 text-[13px]">{label}</label>
      <div className="flex items-center">
        <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
        <input 
          type="text" 
          className="border border-gray-400 w-[100px] px-1 h-[28px]" 
          value={value}
          onChange={e => setter(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full font-sans text-[13px] text-gray-800">
      <div className="bg-[#1c4587] text-white flex justify-between items-center p-2 rounded-t">
        <div className="flex items-center font-bold">
          <ChevronDown size={16} className="mr-1" />
          {t('sections.modifyInstructions')}
        </div>
      </div>
      
      <div className="bg-[#f0f0f0] p-4 border border-gray-300 rounded-b">
        
        {/* Assets Section */}
        <div className="bg-[#466a9b] text-white font-bold p-1 px-2 mb-3">Assets</div>
        <div className="pl-2">
          <InputRow label="Residence & Other Real Estate" value={state.residence} setter={setters.setResidence} />
          <InputRow label="Stocks, Bonds, and Other Investments" value={state.stocks} setter={setters.setStocks} />
          <InputRow label="Savings, CDs, and Checking Account Balance" value={state.savings} setter={setters.setSavings} />
          <InputRow label="Vehicles, Boats, and Other Properties" value={state.vehicles} setter={setters.setVehicles} />
          <InputRow label="Retirement Plans" value={state.retirement} setter={setters.setRetirement} />
          <InputRow label="Life Insurance Benefit" value={state.insurance} setter={setters.setInsurance} />
          <InputRow label="Other Assets" value={state.otherAssets} setter={setters.setOtherAssets} />
        </div>

        {/* Liabilities Section */}
        <div className="bg-[#466a9b] text-white font-bold p-1 px-2 mt-4 mb-3">Liability, Costs, and Deductibles</div>
        <div className="pl-2">
          <InputRow label="Debts (mortgages, loan, credit cards, etc)" value={state.debts} setter={setters.setDebts} />
          <InputRow label="Funeral, Administration, and Claims Expenses" value={state.funeral} setter={setters.setFuneral} />
          <InputRow label="Charitable Contributions" value={state.charitable} setter={setters.setCharitable} />
          <InputRow label="State Inheritance or Estate Taxes" value={state.stateTax} setter={setters.setStateTax} />
        </div>

        {/* Lifetime Gifted Amount */}
        <div className="bg-[#466a9b] text-white font-bold p-1 px-2 mt-4 mb-3">Lifetime Gifted Amount</div>
        <div className="pl-2">
          <div className="grid grid-cols-[1fr_120px] md:grid-cols-[250px_120px] gap-2 items-center mb-2">
            <label className="text-left pr-2 text-[13px]">Total amount you've gifted tax free in your lifetime</label>
            <div className="flex items-center">
              <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
              <input 
                type="text" 
                className="border border-gray-400 w-[100px] px-1 h-[28px]" 
                value={state.gifted}
                onChange={e => setters.setGifted(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6 md:ml-[250px]">
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
