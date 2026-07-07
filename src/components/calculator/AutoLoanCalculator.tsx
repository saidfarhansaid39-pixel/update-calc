"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AutoLoanForm } from '@/components/calculator/AutoLoanForm';
import { AutoLoanResults } from '@/components/calculator/AutoLoanResults';
import { AutoLoanArticle } from '@/components/calculator/AutoLoanArticle';

export function AutoLoanCalculator() {
  const t = useTranslations('calculatorUI');
  const [autoPrice, setAutoPrice] = useState("50,000");
  const [loanTerm, setLoanTerm] = useState("60");
  const [interestRate, setInterestRate] = useState("5");
  const [cashIncentives, setCashIncentives] = useState("0");
  const [downPayment, setDownPayment] = useState("10,000");
  const [tradeInValue, setTradeInValue] = useState("0");
  const [amountOwedOnTradeIn, setAmountOwedOnTradeIn] = useState("0");
  const [stateCode, setStateCode] = useState("-- Select --");
  const [salesTax, setSalesTax] = useState("7");
  const [titleRegistration, setTitleRegistration] = useState("2,000");

  const state = {
    autoPrice, loanTerm, interestRate, cashIncentives, downPayment, 
    tradeInValue, amountOwedOnTradeIn, state: stateCode, salesTax, titleRegistration
  };

  const setters = {
    setAutoPrice, setLoanTerm, setInterestRate, setCashIncentives, setDownPayment,
    setTradeInValue, setAmountOwedOnTradeIn, setState: setStateCode, setSalesTax, setTitleRegistration
  };

  const price = parseFloat(autoPrice.replace(/,/g, '')) || 0;
  const term = parseFloat(loanTerm) || 0;
  const rate = parseFloat(interestRate) || 0;
  const incentives = parseFloat(cashIncentives.replace(/,/g, '')) || 0;
  const down = parseFloat(downPayment.replace(/,/g, '')) || 0;
  const tradeIn = parseFloat(tradeInValue.replace(/,/g, '')) || 0;
  const owedOnTradeIn = parseFloat(amountOwedOnTradeIn.replace(/,/g, '')) || 0;
  const taxRate = parseFloat(salesTax) || 0;
  const title = parseFloat(titleRegistration.replace(/,/g, '')) || 0;

  let taxableAmount = price - tradeIn;
  if (taxableAmount < 0) taxableAmount = 0;
  const tax = taxableAmount * (taxRate / 100);

  const upfront = down + tradeIn;
  const principal = price - incentives - upfront + owedOnTradeIn + tax + title;

  const i = (rate / 100) / 12;
  
  let monthly = 0;
  if (i > 0 && term > 0 && principal > 0) {
    monthly = principal * (i * Math.pow(1 + i, term)) / (Math.pow(1 + i, term) - 1);
  } else if (term > 0 && principal > 0) {
    monthly = principal / term;
  }

  const totalPay = monthly * term;
  const totalInt = totalPay - principal;
  const totalCostOverall = totalPay + upfront + incentives;

  return (
    <div className="max-w-[800px] mx-auto bg-white p-2 md:p-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2 border-b pb-1">
        <div>home / financial / auto loan calculator</div>
        <div className="text-blue-600 underline">{t('buttons.print')}</div>
      </div>
      
      <h1 className="text-[26px] font-bold text-gray-800 mb-4 font-sans">Auto Loan Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4">
        <div>
          <AutoLoanForm state={state} setters={setters} />
        </div>
        
        <div>
          <AutoLoanResults 
            totalLoanAmount={principal}
            salesTax={tax}
            upfrontPayment={upfront}
            totalPayments={totalPay}
            totalInterest={totalInt}
            totalCost={totalCostOverall}
            monthlyPayment={monthly}
          />
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4 font-sans">{t('sections.amortizationSchedule')}</h2>
        <div className="flex text-sm font-bold border-b-2 border-[#1c4587] mb-4">
          <div className="bg-[#1c4587] text-white px-4 py-1">Annual Schedule</div>
          <div className="text-blue-600 px-4 py-1 hover:underline cursor-pointer">Monthly Schedule</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-[#1c4587] text-white border border-[#1c4587]">
                <th className="p-1 font-normal">Year</th>
                <th className="p-1 font-normal">Interest</th>
                <th className="p-1 font-normal">{t('formLabels.principal')}</th>
                <th className="p-1 font-normal">Ending Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-100 border border-gray-300">
                <td className="p-1">1</td><td className="p-1">$1,835.98</td><td className="p-1">$7,222.21</td><td className="p-1">$32,777.79</td>
              </tr>
              <tr className="border border-gray-300">
                <td className="p-1">2</td><td className="p-1">$1,466.48</td><td className="p-1">$7,591.71</td><td className="p-1">$25,186.08</td>
              </tr>
              <tr className="bg-gray-100 border border-gray-300">
                <td className="p-1">3</td><td className="p-1">$1,078.07</td><td className="p-1">$7,980.12</td><td className="p-1">$17,205.96</td>
              </tr>
              <tr className="border border-gray-300">
                <td className="p-1">4</td><td className="p-1">$669.80</td><td className="p-1">$8,388.40</td><td className="p-1">$8,817.56</td>
              </tr>
              <tr className="bg-gray-100 border border-gray-300">
                <td className="p-1">5</td><td className="p-1">$240.63</td><td className="p-1">$8,817.56</td><td className="p-1">$0.00</td>
              </tr>
            </tbody>
          </table>
          <div className="border border-gray-300 p-2 flex items-center justify-center bg-gray-50 h-[200px]">
             <div className="text-center text-gray-500 text-sm">Stacked Area Chart Placeholder</div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 font-bold text-[13px]">
        <span className="w-4 h-4 bg-[#1c4587] text-white flex items-center justify-center rounded-sm text-[10px]">L</span> {t('sections.relatedCalculators')}
      </div>
      <div className="flex gap-2 mt-2">
        <button className="bg-[#1c4587] text-white px-3 py-1 text-sm rounded">Cash Back or Low Interest Calculator</button>
        <button className="bg-[#1c4587] text-white px-3 py-1 text-sm rounded">Auto Lease Calculator</button>
      </div>

      <AutoLoanArticle />
    </div>
  );
}
