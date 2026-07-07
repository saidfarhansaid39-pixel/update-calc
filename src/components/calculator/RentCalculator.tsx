"use client";

import React, { useState, useEffect } from 'react';
import { RentForm } from '@/components/calculator/RentForm';
import { RentResults } from '@/components/calculator/RentResults';
import { RentArticle } from '@/components/calculator/RentArticle';

export function RentCalculator() {
  const [income, setIncome] = useState("80,000");
  const [incomeFrequency, setIncomeFrequency] = useState("per year");
  const [debt, setDebt] = useState("0");
  const [results, setResults] = useState<any>(null);

  const state = { income, incomeFrequency, debt };
  const setters = { setIncome, setIncomeFrequency, setDebt };

  const handleClear = () => {
    setIncome("");
    setDebt("");
    setResults(null);
  };

  const calculate = () => {
    const rawIncome = parseFloat(income.replace(/,/g, '')) || 0;
    const monthlyDebt = parseFloat(debt.replace(/,/g, '')) || 0;

    let monthlyGross = rawIncome;
    if (incomeFrequency === "per year") {
      monthlyGross = rawIncome / 12;
    }

    if (monthlyGross <= 0) return;

    // 25% conservative
    const conservative = monthlyGross * 0.25;
    
    // 30% recommended rule of thumb
    const recommended = monthlyGross * 0.30;
    
    // Max using 43% Back-End DTI rule
    // Max Rent + Debt <= 43% Gross
    // Max Rent <= 43% Gross - Debt
    let maximum = (monthlyGross * 0.43) - monthlyDebt;
    if (maximum < 0) maximum = 0;

    setResults({
      conservative,
      recommended,
      maximum
    });
  };

  useEffect(() => {
    calculate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-[800px] mx-auto bg-white p-2 md:p-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2 border-b pb-1">
        <div>home / financial / rent calculator</div>
      </div>
      
      <h1 className="text-[26px] font-bold text-gray-800 mb-4 font-sans">Rent Calculator</h1>
      
      <h2 className="text-[18px] font-bold text-[#1c4587] mb-2 font-sans">How Much Rent Can I Afford?</h2>
      <p className="mb-4 text-[13px] text-gray-800 leading-relaxed">
        Use the rent calculator below to estimate the affordable monthly rental spending amount based on income and debt level.
      </p>

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="flex-1">
          <RentForm 
            state={state} 
            setters={setters} 
            handleCalculate={calculate}
            handleClear={handleClear}
          />
        </div>
        <div className="w-full md:w-[350px]">
          <RentResults results={results} />
        </div>
      </div>

      <RentArticle />
    </div>
  );
}
