"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

export function PaymentForm({ state, setters, activeTab, setActiveTab }: any) {
  const t = useTranslations('calculatorUI');
  return (
    <div className="w-full font-sans text-[13px] text-gray-800">
      <div className="flex font-bold text-[14px]">
        <div 
          onClick={() => setActiveTab('fixedTerm')}
          className={`px-4 py-2 cursor-pointer border-t border-l border-r ${activeTab === 'fixedTerm' ? 'bg-white border-gray-300' : 'bg-[#1c4587] text-white border-[#1c4587] hover:bg-[#153465]'}`}
        >
          {t('tabs.fixedTerm')}
        </div>
        <div 
          onClick={() => setActiveTab('fixedPayments')}
          className={`px-4 py-2 cursor-pointer border-t border-l border-r ${activeTab === 'fixedPayments' ? 'bg-white border-gray-300' : 'bg-[#1c4587] text-white border-[#1c4587] hover:bg-[#153465]'}`}
        >
          {t('tabs.fixedPayments')}
        </div>
      </div>
      
      <div className="bg-[#1c4587] text-white flex justify-between items-center p-2">
        <div className="flex items-center font-bold">
          <span className="w-4 h-4 bg-white text-[#1c4587] rounded-full flex items-center justify-center text-[10px] mr-2">▼</span>
          {t('sections.modifyInstructions')}
        </div>
      </div>
      
      <div className="bg-[#f0f0f0] p-4 border border-gray-300 rounded-b">
        <div className="grid grid-cols-[110px_1fr] gap-y-3 items-center">
          <label className="text-left">{t('formLabels.loanAmount')}</label>
          <div className="flex">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
            <input 
              type="text" 
              className="border border-gray-400 w-[120px] px-1 h-[28px]" 
              value={state.loanAmount}
              onChange={e => setters.setLoanAmount(e.target.value)}
            />
          </div>

          {activeTab === 'fixedTerm' && (
            <>
              <label className="text-left">{t('formLabels.loanTerm')}</label>
              <div className="flex items-center">
                <input 
                  type="text" 
                  className="border border-gray-400 w-[50px] px-1 h-[28px]" 
                  value={state.loanTerm}
                  onChange={e => setters.setLoanTerm(e.target.value)}
                />
                <span className="border border-gray-400 border-l-0 px-2 bg-gray-100 leading-[26px]">years</span>
              </div>
            </>
          )}

          {activeTab === 'fixedPayments' && (
            <>
              <label className="text-left">{t('formLabels.monthlyPay')}</label>
              <div className="flex items-center">
                <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
                <input 
                  type="text" 
                  className="border border-gray-400 w-[80px] px-1 h-[28px]" 
                  value={state.monthlyPayInput}
                  onChange={e => setters.setMonthlyPayInput(e.target.value)}
                />
              </div>
            </>
          )}

          <label className="text-left">{t('formLabels.interestRate')}</label>
          <div className="flex items-center">
            <input 
              type="text" 
              className="border border-gray-400 w-[50px] px-1 h-[28px]" 
              value={state.interestRate}
              onChange={e => setters.setInterestRate(e.target.value)}
            />
            <span className="border border-gray-400 border-l-0 px-2 bg-gray-100 leading-[26px]">%</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4 ml-[110px]">
          <button className="bg-[#306e3e] hover:bg-[#255630] text-white px-6 py-1.5 font-bold rounded shadow border border-[#1f4a27] flex items-center gap-1">
            {t('buttons.calculate')} <span className="bg-white text-[#306e3e] rounded-full w-4 h-4 flex items-center justify-center text-[10px]">▶</span>
          </button>
          <button className="bg-[#aaaaaa] hover:bg-[#999999] text-white px-6 py-1.5 font-bold rounded shadow border border-[#888888]">
            {t('buttons.clear')}
          </button>
        </div>
      </div>
    </div>
  );
}
