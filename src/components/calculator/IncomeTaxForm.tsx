"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function IncomeTaxForm({ state, setters, handleCalculate, handleClear }: any) {
  const t = useTranslations('calculatorUI');
  return (
    <div className="w-full font-sans text-[13px] text-gray-800">
      <div className="bg-[#1c4587] text-white flex justify-between items-center p-2 rounded-t">
        <div className="flex items-center font-bold">
          <ChevronDown size={16} className="mr-1" />
          {t('sections.modifyInstructions')}
        </div>
      </div>
      
      <div className="bg-[#f0f0f0] p-4 border border-gray-300 rounded-b space-y-4">
        
        {/* Top Config */}
        <div className="grid grid-cols-[200px_1fr] gap-y-2 items-center">
          <label className="text-left pr-2">File Status</label>
          <select className="border border-gray-400 w-[200px] px-1 h-[24px]">
            <option>Single</option>
            <option>Married filing jointly</option>
            <option>Married filing separately</option>
            <option>Head of household</option>
            <option>Qualifying widow(er)</option>
          </select>

          <label className="text-left pr-2">No. of Young Dependents</label>
          <div className="flex items-center">
            <input type="text" className="border border-gray-400 w-[50px] px-1 h-[24px]" defaultValue="0" />
            <span className="ml-2 text-gray-600">Age 0-16</span>
          </div>

          <label className="text-left pr-2">No. of Other Dependents</label>
          <div className="flex items-center">
            <input type="text" className="border border-gray-400 w-[50px] px-1 h-[24px]" defaultValue="0" />
            <span className="ml-2 text-gray-600">Age 17 or older</span>
          </div>

          <label className="text-left pr-2">Tax Year</label>
          <div className="flex flex-col space-y-1">
            <label className="flex items-center"><input type="radio" name="taxYear" className="mr-2" /> 2026 (return filed in 2027)</label>
            <label className="flex items-center"><input type="radio" name="taxYear" className="mr-2" defaultChecked /> 2025 (return filed in 2026)</label>
          </div>
        </div>

        {/* Income Section */}
        <div className="bg-[#6b8aba] text-white px-2 py-1 font-bold">Income</div>
        <div className="grid grid-cols-[200px_1fr] gap-y-2 items-center">
          <label className="text-left pr-2">Age</label>
          <input type="text" className="border border-gray-400 w-[50px] px-1 h-[24px]" defaultValue="30" />

          <label className="text-left pr-2">Wages, Tips, Other Compensation</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" value={state.wages} onChange={e => setters.setWages(e.target.value)} />
            <span className="ml-2 text-gray-600">(W-2 box 1)</span>
          </div>

          <label className="text-left pr-2">Federal Income Tax Withheld</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" value={state.fedWithheld} onChange={e => setters.setFedWithheld(e.target.value)} />
            <span className="ml-2 text-gray-600">(W-2 box 2)</span>
          </div>

          <label className="text-left pr-2">State Income Tax Withheld</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
            <span className="ml-2 text-gray-600">(W-2 box 17)</span>
          </div>

          <label className="text-left pr-2">Local Income Tax Withheld</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
            <span className="ml-2 text-gray-600">(W-2 box 19)</span>
          </div>

          <label className="text-left pr-2">Has Business or Self Employment Income?</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center"><input type="radio" name="selfEmp" className="mr-1" /> yes</label>
            <label className="flex items-center"><input type="radio" name="selfEmp" className="mr-1" defaultChecked /> no</label>
          </div>

          <label className="text-left pr-2 mt-2">Social Security Income</label>
          <div className="flex items-center mt-2">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
            <span className="ml-2 text-gray-600">SSA-1099, RRB-1099</span>
          </div>

          <label className="text-left pr-2">Interest Income</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
            <span className="ml-2 text-gray-600">1099-INT</span>
          </div>

          <label className="text-left pr-2">Ordinary Dividends</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
          </div>

          <label className="text-left pr-2">Qualified Dividends</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
            <span className="ml-2 text-gray-600">1099-DIV</span>
          </div>

          <label className="text-left pr-2">Passive Incomes</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
            <span className="ml-2 text-gray-600">e.g. rentals and real estate, royalties</span>
          </div>

          <label className="text-left pr-2">Short-term Capital Gains</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
          </div>

          <label className="text-left pr-2">Long-term Capital Gains</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
          </div>

          <label className="text-left pr-2">Other Income</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
            <span className="ml-2 text-gray-600 w-[300px] leading-tight">e.g. unemployment pay(1099-G), retirement pay (1099-R)</span>
          </div>

          <label className="text-left pr-2">State+Local Tax Rate</label>
          <div className="flex items-center">
            <input type="text" className="border border-gray-400 w-[50px] px-1 h-[24px]" defaultValue="0" />
            <span className="border border-gray-400 border-l-0 px-2 bg-gray-100 leading-[22px]">%</span>
          </div>
        </div>

        {/* Deductions Section */}
        <div className="bg-[#6b8aba] text-white px-2 py-1 font-bold">Deductions & Credits</div>
        <div className="grid grid-cols-[200px_1fr] gap-y-2 items-center">
          <label className="text-left pr-2">Tips Income</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
          </div>

          <label className="text-left pr-2">Overtime Income</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
          </div>

          <label className="text-left pr-2">Car Loan Interest</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
            <span className="ml-2 text-gray-600">Max $10,000 for qualified vehicle purchase</span>
          </div>

          <label className="text-left pr-2">IRA Contributions</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
          </div>

          <label className="text-left pr-2">Real Estate Tax</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
          </div>

          <label className="text-left pr-2">Mortgage Interest</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
          </div>

          <label className="text-left pr-2">Charitable Donations</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
          </div>

          <label className="text-left pr-2">Student Loan Interest</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
            <span className="ml-2 text-gray-600">Max $2,500/Person</span>
          </div>

          <label className="text-left pr-2">Child & Dependent Care Expense</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
            <span className="ml-2 text-gray-600">Max $3,000/Person, $6,000 total, up to age 13</span>
          </div>

          <label className="text-left pr-2">College Education Expense</label>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center">
              <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
              <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
              <span className="ml-2 text-gray-600">Student 1</span>
            </div>
            <div className="flex items-center">
              <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
              <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
              <span className="ml-2 text-gray-600">Student 2</span>
            </div>
            <div className="flex items-center">
              <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
              <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
              <span className="ml-2 text-gray-600">Student 3</span>
            </div>
            <div className="flex items-center">
              <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
              <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
              <span className="ml-2 text-gray-600">Student 4</span>
            </div>
          </div>

          <label className="text-left pr-2 mt-2">Other Deductibles</label>
          <div className="flex items-center mt-2">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[22px]">$</span>
            <input type="text" className="border border-gray-400 w-[100px] px-1 h-[24px]" defaultValue="0" />
          </div>
        </div>

        <div className="flex gap-2 mt-6 ml-[200px]">
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
