"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function CurrencyForm({ state, setters, handleLiveCalculate, handleLiveClear, handleCustomCalculate, handleCustomClear }: any) {
  return (
    <div className="w-full font-sans text-[13px] text-gray-800 space-y-6">
      
      {/* With Live Exchange Rate Form */}
      <div>
        <h2 className="font-bold text-[14px] mb-2">With Live Exchange Rate</h2>
        <div className="bg-[#1c4587] text-white flex justify-between items-center p-2 rounded-t">
          <div className="flex items-center font-bold">
            <ChevronDown size={16} className="mr-1" />
            Modify the values and click the Calculate button to use
          </div>
        </div>
        
        <div className="bg-[#f0f0f0] p-4 border border-gray-300 rounded-b">
          <div className="grid grid-cols-[80px_1fr] gap-y-3 items-center">
            <label className="text-left font-bold">Amount</label>
            <input 
              type="text" 
              className="border border-gray-400 w-[120px] px-1 h-[28px]" 
              value={state.liveAmount}
              onChange={e => setters.setLiveAmount(e.target.value)}
            />

            <label className="text-left font-bold">From</label>
            <select 
              className="border border-gray-400 w-[250px] px-1 h-[28px]"
              value={state.liveFrom}
              onChange={e => setters.setLiveFrom(e.target.value)}
            >
              <option value="USD">USD: United States Dollar</option>
              <option value="EUR">EUR: Euro</option>
              <option value="GBP">GBP: British Pound</option>
            </select>

            <label className="text-left font-bold">To</label>
            <select 
              className="border border-gray-400 w-[250px] px-1 h-[28px]"
              value={state.liveTo}
              onChange={e => setters.setLiveTo(e.target.value)}
            >
              <option value="EUR">EUR: Euro</option>
              <option value="USD">USD: United States Dollar</option>
              <option value="GBP">GBP: British Pound</option>
            </select>
          </div>

          <div className="mt-4 flex items-center ml-[80px]">
            <input type="checkbox" className="mr-2 w-4 h-4" defaultChecked />
            <label>Show most popular currencies only</label>
          </div>

          <div className="flex gap-2 mt-4 ml-[80px]">
            <button 
              onClick={handleLiveCalculate}
              className="bg-[#306e3e] hover:bg-[#255630] text-white px-6 py-1.5 font-bold rounded shadow border border-[#1f4a27] flex items-center gap-1"
            >
              Calculate <span className="bg-white text-[#306e3e] rounded-full w-4 h-4 flex items-center justify-center text-[10px]">▶</span>
            </button>
            <button 
              onClick={handleLiveClear}
              className="bg-[#aaaaaa] hover:bg-[#999999] text-white px-6 py-1.5 font-bold rounded shadow border border-[#888888]"
            >
              Clear
            </button>
          </div>
        </div>
        {state.liveResult && (
          <div className="mt-4 p-3 bg-[#e8f0fe] border border-[#a2c4e8] font-bold text-center">
            {state.liveAmount} {state.liveFrom} = {state.liveResult.toFixed(2)} {state.liveTo}
          </div>
        )}
      </div>

      {/* Customized Currency Exchange Rate Form */}
      <div>
        <h2 className="font-bold text-[14px] mb-2">Customized Currency Exchange Rate</h2>
        <div className="bg-[#f0f0f0] p-4 border border-gray-300 rounded">
          <div className="grid grid-cols-[200px_1fr] gap-y-3 items-center">
            <label className="text-left pr-2">Exchange rate for currency A/B</label>
            <div className="flex items-center">
              <input 
                type="text" 
                className="border border-gray-400 w-[120px] px-1 h-[28px]" 
                value={state.customRate}
                onChange={e => setters.setCustomRate(e.target.value)}
              />
              <span className="ml-2 text-gray-600">Equivalent unit(s) of B compared to 1 unit of A</span>
            </div>

            <label className="text-left pr-2 font-bold">Amount to exchange</label>
            <input 
              type="text" 
              className="border border-gray-400 w-[120px] px-1 h-[28px]" 
              value={state.customAmount}
              onChange={e => setters.setCustomAmount(e.target.value)}
            />
          </div>

          <div className="flex gap-2 mt-4 ml-[200px]">
            <button 
              onClick={handleCustomCalculate}
              className="bg-[#306e3e] hover:bg-[#255630] text-white px-6 py-1.5 font-bold rounded shadow border border-[#1f4a27] flex items-center gap-1"
            >
              Calculate <span className="bg-white text-[#306e3e] rounded-full w-4 h-4 flex items-center justify-center text-[10px]">▶</span>
            </button>
            <button 
              onClick={handleCustomClear}
              className="bg-[#aaaaaa] hover:bg-[#999999] text-white px-6 py-1.5 font-bold rounded shadow border border-[#888888]"
            >
              Clear
            </button>
          </div>
        </div>
        {state.customResult && (
          <div className="mt-4 p-3 bg-[#e8f0fe] border border-[#a2c4e8] font-bold text-center">
            Amount in B: {state.customResult.toFixed(2)}
          </div>
        )}
      </div>

    </div>
  );
}
