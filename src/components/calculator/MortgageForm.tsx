"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function MortgageForm({ state, setters }: any) {
  const t = useTranslations('calculatorUI');
  return (
    <div className="w-full font-sans text-[13px] text-gray-800">
      <div className="bg-[#1c4587] text-white flex justify-between items-center p-2 rounded-t">
        <div className="flex items-center">
          <ChevronDown size={16} className="mr-1" />
          <span className="font-bold">{t('sections.modifyInstructions')}</span>
        </div>
      </div>
      
      <div className="bg-[#f0f0f0] p-4 border border-gray-300 rounded-b">
        <div className="grid grid-cols-[120px_1fr] gap-y-2 items-center">
          <label className="text-right pr-2">{t('formLabels.homePrice')}</label>
          <div className="flex">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
            <input 
              type="text" 
              className="border border-gray-400 w-[120px] px-1 h-[28px]" 
              value={state.homePrice}
              onChange={e => setters.setHomePrice(e.target.value)}
            />
          </div>

          <label className="text-right pr-2">{t('formLabels.downPayment')}</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
            <input 
              type="text" 
              className="border border-gray-400 w-[70px] px-1 h-[28px]" 
              value={state.downPaymentDollar}
              onChange={e => setters.setDownPaymentDollar(e.target.value)}
            />
            <span className="mx-1">or</span>
            <input 
              type="text" 
              className="border border-gray-400 w-[40px] px-1 h-[28px]" 
              value={state.downPaymentPercent}
              onChange={e => setters.setDownPaymentPercent(e.target.value)}
            />
            <span className="border border-gray-400 border-l-0 px-2 bg-gray-100 leading-[26px]">%</span>
          </div>

          <label className="text-right pr-2">{t('formLabels.loanTerm')}</label>
          <div className="flex items-center">
            <input 
              type="text" 
              className="border border-gray-400 w-[50px] px-1 h-[28px]" 
              value={state.loanTerm}
              onChange={e => setters.setLoanTerm(e.target.value)}
            />
            <span className="border border-gray-400 border-l-0 px-2 bg-gray-100 leading-[26px]">years</span>
          </div>

          <label className="text-right pr-2">{t('formLabels.interestRate')}</label>
          <div className="flex items-center">
            <input 
              type="text" 
              className="border border-gray-400 w-[60px] px-1 h-[28px]" 
              value={state.interestRate}
              onChange={e => setters.setInterestRate(e.target.value)}
            />
            <span className="border border-gray-400 border-l-0 px-2 bg-gray-100 leading-[26px]">%</span>
          </div>

          <label className="text-right pr-2">{t('formLabels.startDate')}</label>
          <div className="flex gap-1">
            <select className="border border-gray-400 h-[28px] px-1">
              <option>May</option>
            </select>
            <select className="border border-gray-400 h-[28px] px-1">
              <option>2026</option>
            </select>
          </div>
        </div>

        <div className="mt-4 mb-2 font-bold">
          <label className="flex items-center">
            <input type="checkbox" checked={true} className="mr-2" readOnly />
            Include Taxes & Costs Below
          </label>
        </div>

        <div className="grid grid-cols-[120px_1fr] gap-y-2 items-center">
          <div className="text-right pr-2 text-[11px] text-gray-500 italic col-span-2 text-center ml-12">Annual Tax & Cost</div>
          
          <label className="text-right pr-2">Property Taxes</label>
          <div className="flex items-center gap-1">
            <input type="text" value={state.propertyTaxPercent} onChange={e => setters.setPropertyTaxPercent(e.target.value)} className="border border-gray-400 w-[40px] px-1 h-[28px] text-right" />
            <span className="bg-gray-100 border border-gray-400 px-1">%</span>
            <input type="text" value={state.propertyTaxDollar} readOnly className="border border-gray-400 w-[60px] px-1 h-[28px] bg-gray-100 text-right" />
            <span className="bg-gray-100 border border-gray-400 px-1">$</span>
          </div>

          <label className="text-right pr-2">Home Insurance</label>
          <div className="flex items-center gap-1">
            <input type="text" value={state.homeInsurance} onChange={e => setters.setHomeInsurance(e.target.value)} className="border border-gray-400 w-[60px] px-1 h-[28px] text-right" />
            <span className="bg-gray-100 border border-gray-400 px-1">$</span>
          </div>

          <label className="text-right pr-2">PMI Insurance</label>
          <div className="flex items-center gap-1">
            <input type="text" value="0" readOnly className="border border-gray-400 w-[40px] px-1 h-[28px] text-right" />
            <span className="bg-gray-100 border border-gray-400 px-1">%</span>
            <input type="text" value="0" readOnly className="border border-gray-400 w-[60px] px-1 h-[28px] bg-gray-100 text-right" />
            <span className="bg-gray-100 border border-gray-400 px-1">$</span>
          </div>

          <label className="text-right pr-2">HOA Fee</label>
          <div className="flex items-center gap-1">
            <input type="text" value={state.hoaFee} onChange={e => setters.setHoaFee(e.target.value)} className="border border-gray-400 w-[60px] px-1 h-[28px] text-right" />
            <span className="bg-gray-100 border border-gray-400 px-1">$</span>
          </div>

          <label className="text-right pr-2">Other Costs</label>
          <div className="flex items-center gap-1">
            <input type="text" value={state.otherCosts} onChange={e => setters.setOtherCosts(e.target.value)} className="border border-gray-400 w-[60px] px-1 h-[28px] text-right" />
            <span className="bg-gray-100 border border-gray-400 px-1">$</span>
          </div>
        </div>

        <div className="text-center my-3">
          <button type="button" className="text-blue-600 underline text-sm">+ More Options</button>
        </div>

        <div className="flex justify-center gap-2">
          <button className="bg-[#306e3e] hover:bg-[#255630] text-white px-6 py-1.5 font-bold rounded shadow border border-[#1f4a27]">
            {t('buttons.calculate')}
          </button>
          <button className="bg-[#aaaaaa] hover:bg-[#999999] text-white px-6 py-1.5 font-bold rounded shadow border border-[#888888]">
            {t('buttons.clear')}
          </button>
        </div>
      </div>
    </div>
  );
}
