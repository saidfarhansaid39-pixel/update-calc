"use client";

import React, { useState } from 'react';
import { EstateTaxForm } from '@/components/calculator/EstateTaxForm';
import { EstateTaxResults } from '@/components/calculator/EstateTaxResults';
import { EstateTaxArticle } from '@/components/calculator/EstateTaxArticle';

export function EstateTaxCalculator() {
  // Assets
  const [residence, setResidence] = useState("0");
  const [stocks, setStocks] = useState("0");
  const [savings, setSavings] = useState("0");
  const [vehicles, setVehicles] = useState("0");
  const [retirement, setRetirement] = useState("0");
  const [insurance, setInsurance] = useState("0");
  const [otherAssets, setOtherAssets] = useState("0");

  // Liabilities
  const [debts, setDebts] = useState("0");
  const [funeral, setFuneral] = useState("0");
  const [charitable, setCharitable] = useState("0");
  const [stateTax, setStateTax] = useState("0");

  // Lifetime Gifted
  const [gifted, setGifted] = useState("0");

  const [results, setResults] = useState<any>(null);

  const state = { residence, stocks, savings, vehicles, retirement, insurance, otherAssets, debts, funeral, charitable, stateTax, gifted };
  const setters = { setResidence, setStocks, setSavings, setVehicles, setRetirement, setInsurance, setOtherAssets, setDebts, setFuneral, setCharitable, setStateTax, setGifted };

  const handleClear = () => {
    setResidence("0"); setStocks("0"); setSavings("0"); setVehicles("0"); setRetirement("0"); setInsurance("0"); setOtherAssets("0");
    setDebts("0"); setFuneral("0"); setCharitable("0"); setStateTax("0");
    setGifted("0");
    setResults(null);
  };

  const calculate = () => {
    const parseVal = (str: string) => parseFloat(str.replace(/,/g, '')) || 0;

    const grossEstate = 
      parseVal(residence) + parseVal(stocks) + parseVal(savings) + 
      parseVal(vehicles) + parseVal(retirement) + parseVal(insurance) + parseVal(otherAssets);

    const totalDeductions = 
      parseVal(debts) + parseVal(funeral) + parseVal(charitable) + parseVal(stateTax);

    const giftedAmount = parseVal(gifted);

    // If everything is basically 0, don't show results
    if (grossEstate === 0 && totalDeductions === 0 && giftedAmount === 0) {
      setResults(null);
      return;
    }

    let taxableEstate = grossEstate - totalDeductions + giftedAmount;
    if (taxableEstate < 0) taxableEstate = 0;

    // 2026 Federal Exemption is $15,000,000 based on the article table
    const exemption = 15000000;
    
    let estimatedTax = 0;
    if (taxableEstate > exemption) {
      estimatedTax = (taxableEstate - exemption) * 0.40; // 40% rate
    }

    setResults({
      grossEstate,
      totalDeductions,
      giftedAmount,
      taxableEstate,
      exemption,
      estimatedTax
    });
  };

  return (
    <div className="max-w-[800px] mx-auto bg-white p-2 md:p-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2 border-b pb-1">
        <div>home / financial / estate tax calculator</div>
      </div>
      
      <h1 className="text-[26px] font-bold text-gray-800 mb-4 font-sans">Estate Tax Calculator</h1>
      <p className="mb-4 text-[13px] text-gray-800 leading-relaxed">
        The Estate Tax Calculator estimates federal estate tax due. Many states impose their own estate taxes, but they tend to be less than the federal estate tax. This calculator is mainly intended for use by U.S. residents.
      </p>

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="flex-1">
          <EstateTaxForm 
            state={state} 
            setters={setters} 
            handleCalculate={calculate}
            handleClear={handleClear}
          />
        </div>
        <div className="w-full md:w-[350px]">
          <EstateTaxResults results={results} />
        </div>
      </div>

      <EstateTaxArticle />
    </div>
  );
}
