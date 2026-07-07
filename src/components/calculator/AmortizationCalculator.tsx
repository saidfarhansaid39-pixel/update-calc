"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AmortizationForm } from '@/components/calculator/AmortizationForm';
import { AmortizationResults } from '@/components/calculator/AmortizationResults';
import { AmortizationArticle } from '@/components/calculator/AmortizationArticle';

export function AmortizationCalculator() {
  const t = useTranslations('calculatorUI');
  const [loanAmount, setLoanAmount] = useState("200,000");
  const [loanTermYears, setLoanTermYears] = useState("15");
  const [loanTermMonths, setLoanTermMonths] = useState("0");
  const [interestRate, setInterestRate] = useState("6");

  const state = { loanAmount, loanTermYears, loanTermMonths, interestRate };
  const setters = { setLoanAmount, setLoanTermYears, setLoanTermMonths, setInterestRate };

  const p = parseFloat(loanAmount.replace(/,/g, '')) || 0;
  const i = (parseFloat(interestRate) / 100) / 12;
  const years = parseFloat(loanTermYears) || 0;
  const months = parseFloat(loanTermMonths) || 0;
  
  const computedMonths = (years * 12) + months;
  
  let computedMonthly = 0;
  if (i > 0 && computedMonths > 0 && p > 0) {
    computedMonthly = p * (i * Math.pow(1 + i, computedMonths)) / (Math.pow(1 + i, computedMonths) - 1);
  } else if (computedMonths > 0 && p > 0) {
    computedMonthly = p / computedMonths;
  }

  const totalPayments = computedMonthly * computedMonths;
  const totalInterest = totalPayments - p;

  return (
    <div className="max-w-[800px] mx-auto bg-white p-2 md:p-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2 border-b pb-1">
        <div>home / financial / amortization calculator</div>
        <div className="text-blue-600 underline">{t('buttons.print')}</div>
      </div>
      
      <h1 className="text-[26px] font-bold text-gray-800 mb-4 font-sans">Amortization Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4">
        <div>
          <AmortizationForm state={state} setters={setters} />
        </div>
        <div>
          <AmortizationResults 
            loanAmount={p}
            totalPayments={totalPayments}
            totalInterest={totalInterest}
            monthlyPayment={computedMonthly}
            numMonths={computedMonths}
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
                <td className="p-1">1</td><td className="p-1">$11,769.23</td><td className="p-1">$8,483.33</td><td className="p-1">$191,516.67</td>
              </tr>
              <tr className="border border-gray-300">
                <td className="p-1">2</td><td className="p-1">$11,246.00</td><td className="p-1">$9,006.57</td><td className="p-1">$182,510.10</td>
              </tr>
              <tr className="bg-gray-100 border border-gray-300">
                <td className="p-1">3</td><td className="p-1">$10,690.49</td><td className="p-1">$9,562.07</td><td className="p-1">$172,948.02</td>
              </tr>
              <tr className="border border-gray-300">
                <td className="p-1">4</td><td className="p-1">$10,100.72</td><td className="p-1">$10,151.84</td><td className="p-1">$162,796.18</td>
              </tr>
              <tr className="bg-gray-100 border border-gray-300">
                <td className="p-1">5</td><td className="p-1">$9,474.58</td><td className="p-1">$10,777.98</td><td className="p-1">$152,018.20</td>
              </tr>
            </tbody>
          </table>
          <div className="border border-gray-300 p-2 flex items-center justify-center bg-gray-50 h-[200px]">
             <div className="text-center text-gray-500 text-sm">Stacked Area Chart Placeholder</div>
          </div>
        </div>
      </div>

      <AmortizationArticle />
    </div>
  );
}
