"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';

export function SocialSecurityForm1({ state, setters, handleCalculate, handleClear }: any) {
  return (
    <div className="w-full font-sans text-[13px] text-gray-800 mb-6">
      <div className="bg-[#1c4587] text-white flex justify-between items-center p-2 rounded-t">
        <div className="flex items-center font-bold">
          <ChevronDown size={16} className="mr-1" />
          Modify the values and click the Calculate button to use
        </div>
      </div>
      
      <div className="bg-[#f0f0f0] p-4 border border-gray-300 rounded-b">
        <h2 className="text-[18px] font-bold text-[#1c4587] mb-2 font-sans">Determine the ideal application age</h2>
        <p className="mb-4">Use the following calculation to determine the ideal age to apply for Social Security retirement benefits based on age, life expectancy, and average investment performance.</p>

        <div className="grid grid-cols-[160px_1fr] gap-y-3 items-center max-w-[400px]">
          <label className="text-left pr-2">Your birth year</label>
          <input 
            type="text" 
            className="border border-gray-400 w-[100px] px-1 h-[28px]" 
            value={state.birthYear}
            onChange={e => setters.setBirthYear(e.target.value)}
          />

          <label className="text-left pr-2">Your life expectancy</label>
          <input 
            type="text" 
            className="border border-gray-400 w-[100px] px-1 h-[28px]" 
            value={state.lifeExpectancy}
            onChange={e => setters.setLifeExpectancy(e.target.value)}
          />

          <label className="text-left pr-2">Your investment return</label>
          <div className="flex items-center">
            <input 
              type="text" 
              className="border border-gray-400 w-[60px] px-1 h-[28px]" 
              value={state.returnRate1}
              onChange={e => setters.setReturnRate1(e.target.value)}
            />
            <span className="ml-1">% per year</span>
          </div>

          <label className="text-left pr-2">Cost of living adjustment*</label>
          <div className="flex items-center">
            <input 
              type="text" 
              className="border border-gray-400 w-[60px] px-1 h-[28px]" 
              value={state.cola1}
              onChange={e => setters.setCola1(e.target.value)}
            />
            <span className="ml-1">% per year</span>
          </div>
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
