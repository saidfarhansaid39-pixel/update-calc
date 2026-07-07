"use client";

import React from 'react';

export function SocialSecurityForm2({ state, setters, handleCalculate, handleClear }: any) {
  return (
    <div className="w-full font-sans text-[13px] text-gray-800">
      <div className="bg-[#f0f0f0] p-4 border border-gray-300 rounded">
        <h2 className="text-[18px] font-bold text-[#1c4587] mb-2 font-sans">Compare two application ages</h2>
        <p className="mb-4">Use the following calculation to compare the financial difference between two Social Security retirement benefit application ages. <a href="https://www.ssa.gov/" className="text-[#1c4587] underline">The U.S. Social Security website</a> provides estimated benefit payment amounts of different claim ages.</p>

        {/* Option 1 */}
        <div className="bg-[#466a9b] text-white font-bold p-1 px-2 mb-2 max-w-[400px]">Social security claim option 1</div>
        <div className="grid grid-cols-[160px_1fr] gap-y-2 items-center max-w-[400px] mb-4 pl-2">
          <label className="text-left pr-2">Retirement age</label>
          <input 
            type="text" 
            className="border border-gray-400 w-[100px] px-1 h-[28px]" 
            value={state.age1}
            onChange={e => setters.setAge1(e.target.value)}
          />

          <label className="text-left pr-2">Monthly payment</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
            <input 
              type="text" 
              className="border border-gray-400 w-[80px] px-1 h-[28px]" 
              value={state.payment1}
              onChange={e => setters.setPayment1(e.target.value)}
            />
            <span className="ml-1">per month</span>
          </div>
        </div>

        {/* Option 2 */}
        <div className="bg-[#466a9b] text-white font-bold p-1 px-2 mb-2 max-w-[400px]">Social security claim option 2 (work longer)</div>
        <div className="grid grid-cols-[160px_1fr] gap-y-2 items-center max-w-[400px] mb-4 pl-2">
          <label className="text-left pr-2">Retirement age</label>
          <input 
            type="text" 
            className="border border-gray-400 w-[100px] px-1 h-[28px]" 
            value={state.age2}
            onChange={e => setters.setAge2(e.target.value)}
          />

          <label className="text-left pr-2">Monthly payment</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
            <input 
              type="text" 
              className="border border-gray-400 w-[80px] px-1 h-[28px]" 
              value={state.payment2}
              onChange={e => setters.setPayment2(e.target.value)}
            />
            <span className="ml-1">per month</span>
          </div>
        </div>

        {/* Other information */}
        <div className="bg-[#466a9b] text-white font-bold p-1 px-2 mb-2 max-w-[400px]">Other information</div>
        <div className="grid grid-cols-[160px_1fr] gap-y-2 items-center max-w-[400px] mb-4 pl-2">
          <label className="text-left pr-2">Your investment return</label>
          <div className="flex items-center">
            <input 
              type="text" 
              className="border border-gray-400 w-[60px] px-1 h-[28px]" 
              value={state.returnRate2}
              onChange={e => setters.setReturnRate2(e.target.value)}
            />
            <span className="ml-1">% per year</span>
          </div>

          <label className="text-left pr-2">Cost of living adjustment*</label>
          <div className="flex items-center">
            <input 
              type="text" 
              className="border border-gray-400 w-[60px] px-1 h-[28px]" 
              value={state.cola2}
              onChange={e => setters.setCola2(e.target.value)}
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
