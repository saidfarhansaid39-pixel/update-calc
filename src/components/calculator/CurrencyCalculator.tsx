"use client";

import React, { useState } from 'react';
import { CurrencyForm } from '@/components/calculator/CurrencyForm';
import { CurrencyTables } from '@/components/calculator/CurrencyTables';
import { CurrencyArticle } from '@/components/calculator/CurrencyArticle';

export function CurrencyCalculator() {
  const [liveAmount, setLiveAmount] = useState("100");
  const [liveFrom, setLiveFrom] = useState("USD");
  const [liveTo, setLiveTo] = useState("EUR");
  const [liveResult, setLiveResult] = useState<number | null>(null);

  const [customRate, setCustomRate] = useState("4");
  const [customAmount, setCustomAmount] = useState("100");
  const [customResult, setCustomResult] = useState<number | null>(null);

  const state = { liveAmount, liveFrom, liveTo, liveResult, customRate, customAmount, customResult };
  const setters = { 
    setLiveAmount, 
    setLiveFrom, 
    setLiveTo, 
    setCustomRate, 
    setCustomAmount 
  };

  const handleLiveCalculate = () => {
    // mock conversion
    setLiveResult(parseFloat(liveAmount) * 0.86);
  };
  const handleLiveClear = () => {
    setLiveAmount("");
    setLiveResult(null);
  };

  const handleCustomCalculate = () => {
    setCustomResult(parseFloat(customAmount) * parseFloat(customRate));
  };
  const handleCustomClear = () => {
    setCustomAmount("");
    setCustomRate("");
    setCustomResult(null);
  };

  return (
    <div className="max-w-[800px] mx-auto bg-white p-2 md:p-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2 border-b pb-1">
        <div>home / financial / currency calculator</div>
      </div>
      
      <h1 className="text-[26px] font-bold text-gray-800 mb-4 font-sans">Currency Calculator</h1>
      
      <div className="w-full">
        <CurrencyForm 
          state={state} 
          setters={setters} 
          handleLiveCalculate={handleLiveCalculate}
          handleLiveClear={handleLiveClear}
          handleCustomCalculate={handleCustomCalculate}
          handleCustomClear={handleCustomClear}
        />
      </div>

      <CurrencyTables />
      <CurrencyArticle />
    </div>
  );
}
