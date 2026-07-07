"use client";

import React, { useState } from 'react';
import { AnnuityForm } from '@/components/calculator/AnnuityForm';
import { AnnuityResults } from '@/components/calculator/AnnuityResults';
import { AnnuityArticle } from '@/components/calculator/AnnuityArticle';

export function AnnuityPayoutCalculator() {
  const [mode, setMode] = useState<'length' | 'payment'>('length');
  
  const [principal, setPrincipal] = useState("500,000");
  const [rate, setRate] = useState("6");
  const [years, setYears] = useState("10");
  const [payment, setPayment] = useState("2,000");
  const [frequency, setFrequency] = useState("Monthly");

  const [results, setResults] = useState<any>(null);

  const state = { principal, rate, years, payment, frequency, mode };
  const setters = { setPrincipal, setRate, setYears, setPayment, setFrequency, setMode };

  const handleClear = () => {
    setPrincipal("");
    setRate("");
    setYears("");
    setPayment("");
    setResults(null);
  };

  const calculate = () => {
    const P = parseFloat(principal.replace(/,/g, '')) || 0;
    const R = (parseFloat(rate) || 0) / 100;
    
    let periodsPerYear = 12;
    if (frequency === "Annually") periodsPerYear = 1;
    if (frequency === "Quarterly") periodsPerYear = 4;
    
    const r = R / periodsPerYear;
    
    let PMT = 0;
    let n = 0;

    if (mode === 'length') {
      const Y = parseFloat(years) || 0;
      n = Y * periodsPerYear;
      if (r === 0) {
        PMT = P / n;
      } else {
        PMT = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }
    } else {
      PMT = parseFloat(payment.replace(/,/g, '')) || 0;
      if (r === 0) {
        n = Math.ceil(P / PMT);
      } else {
        if (PMT <= P * r) {
          alert("Payment is too low to ever deplete the principal.");
          return;
        }
        n = Math.log(PMT / (PMT - P * r)) / Math.log(1 + r);
        n = Math.ceil(n);
      }
    }

    if (!isFinite(PMT) || !isFinite(n) || n <= 0) return;

    let balance = P;
    let totalInterest = 0;
    
    let yearlySchedule: any[] = [];
    let currentYearInterest = 0;
    let currentYearBeginning = balance;

    for (let i = 1; i <= n; i++) {
      let interest = balance * r;
      let principalPayment = PMT - interest;
      
      if (balance + interest < PMT) {
        principalPayment = balance;
        PMT = balance + interest;
      }

      balance -= principalPayment;
      if (balance < 0) balance = 0;

      totalInterest += interest;
      currentYearInterest += interest;

      if (i % periodsPerYear === 0 || i === n) {
        let yearNum = Math.ceil(i / periodsPerYear);
        yearlySchedule.push({
          year: yearNum,
          beginning: currentYearBeginning,
          interest: currentYearInterest,
          ending: balance
        });
        currentYearBeginning = balance;
        currentYearInterest = 0;
      }
    }

    setResults({
      mode,
      payment: PMT,
      principal: P,
      totalInterest,
      totalPeriods: n,
      freqLabel: frequency.toLowerCase(),
      yearsStr: (n / periodsPerYear).toFixed(2).replace(/\.00$/, ''),
      schedule: yearlySchedule
    });
  };

  return (
    <div className="max-w-[800px] mx-auto bg-white p-2 md:p-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2 border-b pb-1">
        <div>home / financial / annuity payout calculator</div>
      </div>
      
      <h1 className="text-[26px] font-bold text-gray-800 mb-4 font-sans">Annuity Payout Calculator</h1>
      <p className="mb-4 text-[13px] text-gray-800 leading-relaxed">
        This calculator can estimate the annuity payout amount for a fixed payout length or estimate the length that an annuity can last if supplied a fixed payout amount. Please use our <a href="/financial-calculators/annuity-payout-calculator/" className="text-[#1c4587] underline">Annuity Calculator</a> to estimate the end balance of an annuity for the accumulation phase.
      </p>

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="flex-1">
          <AnnuityForm 
            state={state} 
            setters={setters} 
            handleCalculate={calculate}
            handleClear={handleClear}
          />
        </div>
        <div className="w-full md:w-[400px]">
          <AnnuityResults results={results} />
        </div>
      </div>

      <AnnuityArticle />
    </div>
  );
}
