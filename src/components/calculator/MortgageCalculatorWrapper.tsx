"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MortgageForm } from '@/components/calculator/MortgageForm';
import { MortgageResults } from '@/components/calculator/MortgageResults';
import { MortgageArticle } from '@/components/calculator/MortgageArticle';

export function MortgageCalculatorWrapper() {
  const t = useTranslations('calculatorUI');
  const [homePrice, setHomePrice] = useState("400,000");
  const [downPaymentDollar, setDownPaymentDollar] = useState("80,000");
  const [downPaymentPercent, setDownPaymentPercent] = useState("20");
  const [loanTerm, setLoanTerm] = useState("30");
  const [interestRate, setInterestRate] = useState("6.609");
  
  const [propertyTaxPercent, setPropertyTaxPercent] = useState("1.2");
  const [propertyTaxDollar, setPropertyTaxDollar] = useState("4,800");
  const [homeInsurance, setHomeInsurance] = useState("1,500");
  const [hoaFee, setHoaFee] = useState("0");
  const [otherCosts, setOtherCosts] = useState("4,000");

  const state = {
    homePrice, downPaymentDollar, downPaymentPercent, loanTerm, interestRate,
    propertyTaxPercent, propertyTaxDollar, homeInsurance, hoaFee, otherCosts
  };

  const setters = {
    setHomePrice, setDownPaymentDollar, setDownPaymentPercent, setLoanTerm, setInterestRate,
    setPropertyTaxPercent, setPropertyTaxDollar, setHomeInsurance, setHoaFee, setOtherCosts
  };

  const hp = parseFloat(homePrice.replace(/,/g, '')) || 0;
  const dpDollar = parseFloat(downPaymentDollar.replace(/,/g, '')) || 0;
  const loanTermYears = parseFloat(loanTerm) || 0;
  const ir = parseFloat(interestRate) || 0;
  
  const ptPercent = parseFloat(propertyTaxPercent) || 0;
  const hi = parseFloat(homeInsurance.replace(/,/g, '')) || 0;
  const other = parseFloat(otherCosts.replace(/,/g, '')) || 0;

  const p = hp - dpDollar;
  const i = (ir / 100) / 12;
  const n = loanTermYears * 12;

  let monthlyPrincipalAndInterest = 0;
  if (i > 0 && n > 0 && p > 0) {
    monthlyPrincipalAndInterest = p * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  } else if (n > 0 && p > 0) {
    monthlyPrincipalAndInterest = p / n;
  }

  const totalPayments = monthlyPrincipalAndInterest * n;
  const totalInterest = totalPayments - p;
  
  const monthlyPropertyTax = (hp * (ptPercent / 100)) / 12;
  const monthlyHomeInsurance = hi / 12;
  const monthlyOtherCosts = other / 12;

  return (
    <div className="max-w-[800px] mx-auto bg-white p-2 md:p-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2 border-b pb-1">
        <div>home / financial / mortgage calculator</div>
        <div className="text-blue-600 underline">Print</div>
      </div>
      
      <h1 className="text-[26px] font-bold text-gray-800 mb-4 font-sans">Mortgage Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4">
        <div>
          <MortgageForm state={state} setters={setters} />
        </div>
        
        <div>
          <MortgageResults 
            homePrice={hp}
            loanAmount={p}
            downPayment={dpDollar}
            monthlyPayment={monthlyPrincipalAndInterest}
            totalPayments={totalPayments}
            totalInterest={totalInterest}
            propertyTax={monthlyPropertyTax}
            homeInsurance={monthlyHomeInsurance}
            otherCosts={monthlyOtherCosts}
          />
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4 font-sans">Amortization schedule</h2>
        <div className="flex text-sm font-bold border-b-2 border-[#1c4587] mb-4">
          <div className="bg-[#1c4587] text-white px-4 py-1">Annual Schedule</div>
          <div className="text-blue-600 px-4 py-1 hover:underline cursor-pointer">Monthly Schedule</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-[#1c4587] text-white border border-[#1c4587]">
                <th className="p-1 font-normal">Year</th>
                <th className="p-1 font-normal">Date</th>
                <th className="p-1 font-normal">Interest</th>
                <th className="p-1 font-normal">Principal</th>
                <th className="p-1 font-normal">Ending<br/>Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-100 border border-gray-300">
                <td className="p-1">1</td><td className="p-1 text-[10px]">5/26-<br/>4/27</td><td className="p-1">$21,044</td><td className="p-1">$3,503</td><td className="p-1">$316,497</td>
              </tr>
              <tr className="border border-gray-300">
                <td className="p-1">2</td><td className="p-1 text-[10px]">5/27-<br/>4/28</td><td className="p-1">$20,805</td><td className="p-1">$3,742</td><td className="p-1">$312,755</td>
              </tr>
              <tr className="bg-gray-100 border border-gray-300">
                <td className="p-1">3</td><td className="p-1 text-[10px]">5/28-<br/>4/29</td><td className="p-1">$20,550</td><td className="p-1">$3,997</td><td className="p-1">$308,758</td>
              </tr>
            </tbody>
          </table>
          <div className="border border-gray-300 p-2 flex items-center justify-center bg-gray-50 h-[200px]">
             <div className="text-center text-gray-500 text-sm">Stacked Area Chart Placeholder</div>
          </div>
        </div>
      </div>

      <MortgageArticle />
    </div>
  );
}
