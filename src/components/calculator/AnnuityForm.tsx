"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

export function AnnuityForm({ state, setters, handleCalculate, handleClear }: any) {
  const t = useTranslations('calculatorUI');
  const [activeTab, setActiveTab] = useState<'length' | 'payment'>('length');

  return (
    <div className="w-full font-sans text-[13px] text-gray-800">
      <div className="flex bg-[#1c4587] text-white font-bold rounded-t overflow-hidden">
        <button 
          onClick={() => { setActiveTab('length'); setters.setMode('length'); }}
          className={`flex-1 py-2 text-center ${activeTab === 'length' ? 'bg-[#f0f0f0] text-black border-t-2 border-[#1c4587]' : 'bg-transparent hover:bg-[#153465]'}`}
        >
          Fixed length
        </button>
        <button 
          onClick={() => { setActiveTab('payment'); setters.setMode('payment'); }}
          className={`flex-1 py-2 text-center ${activeTab === 'payment' ? 'bg-[#f0f0f0] text-black border-t-2 border-[#1c4587]' : 'bg-[#466a9b] hover:bg-[#3b5982]'}`}
        >
          Fixed payment
        </button>
      </div>
      
      <div className="bg-[#f0f0f0] p-4 border border-gray-300 rounded-b border-t-0">
        
        <div className="grid grid-cols-[140px_1fr] gap-y-3 items-center max-w-[350px]">
          <label className="text-left pr-2">Starting principal</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
            <input 
              type="text" 
              className="border border-gray-400 w-[100px] px-1 h-[28px]" 
              value={state.principal}
              onChange={e => setters.setPrincipal(e.target.value)}
            />
          </div>

          <label className="text-left pr-2">Interest/return rate</label>
          <div className="flex items-center">
            <input 
              type="text" 
              className="border border-gray-400 w-[60px] px-1 h-[28px]" 
              value={state.rate}
              onChange={e => setters.setRate(e.target.value)}
            />
            <span className="border border-gray-400 border-l-0 px-2 bg-gray-100 leading-[26px]">%</span>
          </div>

          {activeTab === 'length' ? (
            <>
              <label className="text-left pr-2">Years to payout</label>
              <div className="flex items-center">
                <input 
                  type="text" 
                  className="border border-gray-400 w-[60px] px-1 h-[28px]" 
                  value={state.years}
                  onChange={e => setters.setYears(e.target.value)}
                />
                <span className="border border-gray-400 border-l-0 px-2 bg-gray-100 leading-[26px]">years</span>
              </div>
            </>
          ) : (
            <>
              <label className="text-left pr-2">Payout amount</label>
              <div className="flex items-center">
                <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
                <input 
                  type="text" 
                  className="border border-gray-400 w-[80px] px-1 h-[28px]" 
                  value={state.payment}
                  onChange={e => setters.setPayment(e.target.value)}
                />
              </div>
            </>
          )}

          <label className="text-left pr-2">Payout frequency</label>
          <select 
            className="border border-gray-400 h-[28px] px-1 w-[120px]"
            value={state.frequency}
            onChange={e => setters.setFrequency(e.target.value)}
          >
            <option value="Annually">Annually</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        <div className="flex gap-2 mt-4 md:ml-[140px]">
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
