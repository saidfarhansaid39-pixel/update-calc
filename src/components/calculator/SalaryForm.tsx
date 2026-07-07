"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function SalaryForm({ state, setters, handleCalculate, handleClear }: any) {
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
        <div className="grid grid-cols-[130px_1fr] gap-y-3 items-center">
          <label className="text-left pr-2 font-bold">{t('formLabels.salaryAmount')}</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
            <input 
              type="text" 
              className="border border-gray-400 w-[100px] px-1 h-[28px]" 
              value={state.salaryAmount}
              onChange={e => setters.setSalaryAmount(e.target.value)}
            />
            <span className="mx-2">per</span>
            <select 
              className="border border-gray-400 w-[100px] px-1 h-[28px]"
              value={state.salaryType}
              onChange={e => setters.setSalaryType(e.target.value)}
            >
              <option value="Hour">Hour</option>
              <option value="Day">Day</option>
              <option value="Week">Week</option>
              <option value="Bi-week">Bi-week</option>
              <option value="Semi-month">Semi-month</option>
              <option value="Month">Month</option>
              <option value="Quarter">Quarter</option>
              <option value="Year">Year</option>
            </select>
          </div>

          <label className="text-left pr-2">{t('formLabels.hoursPerWeek')}</label>
          <input 
            type="text" 
            className="border border-gray-400 w-[80px] px-1 h-[28px]" 
            value={state.hoursPerWeek}
            onChange={e => setters.setHoursPerWeek(e.target.value)}
          />

          <label className="text-left pr-2">{t('formLabels.daysPerWeek')}</label>
          <input 
            type="text" 
            className="border border-gray-400 w-[80px] px-1 h-[28px]" 
            value={state.daysPerWeek}
            onChange={e => setters.setDaysPerWeek(e.target.value)}
          />

          <label className="text-left pr-2">{t('formLabels.holidaysPerYear')}</label>
          <input 
            type="text" 
            className="border border-gray-400 w-[80px] px-1 h-[28px]" 
            value={state.holidaysPerYear}
            onChange={e => setters.setHolidaysPerYear(e.target.value)}
          />

          <label className="text-left pr-2">{t('formLabels.vacationDaysPerYear')}</label>
          <input 
            type="text" 
            className="border border-gray-400 w-[80px] px-1 h-[28px]" 
            value={state.vacationDaysPerYear}
            onChange={e => setters.setVacationDaysPerYear(e.target.value)}
          />
        </div>

        <div className="flex gap-2 mt-4 ml-[130px]">
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
