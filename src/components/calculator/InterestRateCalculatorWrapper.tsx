"use client";

import React, { useState, useEffect } from 'react';
import { InterestRateForm } from '@/components/calculator/InterestRateForm';
import { InterestRateResults } from '@/components/calculator/InterestRateResults';
import { InterestRateArticle } from '@/components/calculator/InterestRateArticle';

export function InterestRateCalculatorWrapper() {
  const [loanAmount, setLoanAmount] = useState("32,000");
  const [years, setYears] = useState("3");
  const [months, setMonths] = useState("0");
  const [monthlyPayment, setMonthlyPayment] = useState("960");
  const [results, setResults] = useState<any>(null);

  const state = { loanAmount, years, months, monthlyPayment };
  const setters = { setLoanAmount, setYears, setMonths, setMonthlyPayment };

  const handleClear = () => {
    setLoanAmount("");
    setYears("");
    setMonths("");
    setMonthlyPayment("");
    setResults(null);
  };

  const calculate = () => {
    const principal = parseFloat(loanAmount.replace(/,/g, '')) || 0;
    const y = parseFloat(years) || 0;
    const m = parseFloat(months) || 0;
    const pmt = parseFloat(monthlyPayment.replace(/,/g, '')) || 0;

    const totalMonths = (y * 12) + m;

    if (principal <= 0 || totalMonths <= 0 || pmt <= 0) return;
    
    if (pmt * totalMonths <= principal) {
      // Invalid case where payments don't cover principal
      return;
    }

    // Binary search to find the interest rate
    let low = 0;
    let high = 1.0; // 100% monthly
    let mid = 0;
    let calculatedPV = 0;

    // Run 100 iterations for precision
    for (let i = 0; i < 100; i++) {
      mid = (low + high) / 2;
      calculatedPV = pmt * ((1 - Math.pow(1 + mid, -totalMonths)) / mid);
      if (calculatedPV > principal) {
        // Rate is too low because Present Value is too high
        low = mid;
      } else {
        high = mid;
      }
    }

    const monthlyRate = mid;
    const annualRate = monthlyRate * 12 * 100;

    const totalPayments = pmt * totalMonths;
    const totalInterest = totalPayments - principal;

    const principalPercentage = (principal / totalPayments) * 100;
    const interestPercentage = (totalInterest / totalPayments) * 100;

    setResults({
      interestRate: annualRate,
      months: totalMonths,
      totalPayments,
      totalInterest,
      principalPercentage,
      interestPercentage
    });
  };

  // Run calculation on mount to show initial state matching the screenshot perfectly
  useEffect(() => {
    calculate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-[800px] mx-auto bg-white p-2 md:p-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2 border-b pb-1">
        <div>home / financial / interest rate calculator</div>
      </div>
      
      <h1 className="text-[26px] font-bold text-gray-800 mb-4 font-sans">Interest Rate Calculator</h1>
      <p className="mb-4 text-[13px] text-gray-800 leading-relaxed">
        The Interest Rate Calculator determines real interest rates on loans with fixed terms and monthly payments. For example, it can calculate interest rates in situations where car dealers only provide monthly payment information and total price without including the actual rate on the car loan. To calculate the interest on investments instead, use the <a href="/financial-calculators/compound-interest-calculator/" className="text-[#1c4587] underline">Interest Calculator</a>, or use the <a href="/financial-calculators/compound-interest-calculator/" className="text-[#1c4587] underline">Compound Interest Calculator</a> to understand the difference between different interest rates.
      </p>
      
      <div className="flex flex-col gap-6 w-full">
        <div className="w-full">
          <InterestRateForm 
            state={state} 
            setters={setters} 
            handleCalculate={calculate}
            handleClear={handleClear}
          />
        </div>
        <div className="w-full">
          <InterestRateResults results={results} />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 font-bold text-[13px]">
        <span className="w-4 h-4 bg-[#1c4587] text-white flex items-center justify-center rounded-sm text-[10px]">L</span> Related
      </div>
      <div className="flex flex-wrap gap-2 mt-2 border-b pb-6">
        <button className="bg-[#1c4587] text-white px-3 py-1 text-[13px] rounded hover:bg-[#153465]">APR Calculator</button>
        <button className="bg-[#1c4587] text-white px-3 py-1 text-[13px] rounded hover:bg-[#153465]">Interest Calculator</button>
        <button className="bg-[#1c4587] text-white px-3 py-1 text-[13px] rounded hover:bg-[#153465]">Compound Interest Calculator</button>
      </div>

      <InterestRateArticle />
    </div>
  );
}
