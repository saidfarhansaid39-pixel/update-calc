"use client";

import React, { useState } from 'react';
import { IncomeTaxForm } from '@/components/calculator/IncomeTaxForm';
import { IncomeTaxResults } from '@/components/calculator/IncomeTaxResults';
import { IncomeTaxArticle } from '@/components/calculator/IncomeTaxArticle';

export function IncomeTaxCalculator() {
  const [wages, setWages] = useState("80,000");
  const [fedWithheld, setFedWithheld] = useState("9,000");
  const [showResults, setShowResults] = useState(false);

  const state = { wages, fedWithheld };
  const setters = { setWages, setFedWithheld };

  const handleClear = () => {
    setWages("");
    setFedWithheld("");
    setShowResults(false);
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  // Simplified Mock Calculation for demonstration of "real" behavior
  const w = parseFloat(wages.replace(/,/g, '')) || 0;
  const fw = parseFloat(fedWithheld.replace(/,/g, '')) || 0;
  
  // Very simplified 2025 single bracket mock
  let taxOwed = 0;
  let taxable = w - 14600; // standard deduction mock
  if (taxable > 0) {
    if (taxable <= 11600) {
      taxOwed = taxable * 0.10;
    } else if (taxable <= 47150) {
      taxOwed = 1160 + (taxable - 11600) * 0.12;
    } else if (taxable <= 100525) {
      taxOwed = 5426 + (taxable - 47150) * 0.22;
    } else {
      taxOwed = 17168 + (taxable - 100525) * 0.24;
    }
  }
  const effectiveRate = w > 0 ? (taxOwed / w) * 100 : 0;

  return (
    <div className="max-w-[800px] mx-auto bg-white p-2 md:p-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2 border-b pb-1">
        <div>home / financial / income tax calculator</div>
      </div>
      
      <p className="mb-4 text-[13px] text-gray-800 leading-relaxed">
        The Income Tax Calculator estimates the refund or potential owed amount on a federal tax return. It is mainly intended for residents of the U.S. and is based on the tax brackets of 2025 and 2026 (One Big Beautiful Bill). The 2026 tax values can be used for 1040-ES estimation, planning ahead, or comparison.
      </p>

      <h1 className="text-[26px] font-bold text-gray-800 mb-4 font-sans">Income Tax Calculator</h1>
      
      <div className="w-full">
        <div>
          <IncomeTaxForm state={state} setters={setters} handleCalculate={handleCalculate} handleClear={handleClear} />
          {showResults && (
            <IncomeTaxResults 
              wages={w}
              fedWithheld={fw}
              taxOwed={taxOwed}
              effectiveRate={effectiveRate}
            />
          )}
        </div>
      </div>

      <IncomeTaxArticle />
    </div>
  );
}
