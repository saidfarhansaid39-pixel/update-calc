"use client";

import React, { useState } from 'react';
import { SocialSecurityForm1 } from '@/components/calculator/SocialSecurityForm1';
import { SocialSecurityForm2 } from '@/components/calculator/SocialSecurityForm2';
import { SocialSecurityResults } from '@/components/calculator/SocialSecurityResults';
import { SocialSecurityArticle } from '@/components/calculator/SocialSecurityArticle';

export function SocialSecurityCalculator() {
  // Form 1 State
  const [birthYear, setBirthYear] = useState("1970");
  const [lifeExpectancy, setLifeExpectancy] = useState("83");
  const [returnRate1, setReturnRate1] = useState("5");
  const [cola1, setCola1] = useState("3");

  // Form 2 State
  const [age1, setAge1] = useState("62");
  const [payment1, setPayment1] = useState("1,600");
  const [age2, setAge2] = useState("70");
  const [payment2, setPayment2] = useState("2,810");
  const [returnRate2, setReturnRate2] = useState("5");
  const [cola2, setCola2] = useState("3");

  const [results, setResults] = useState<any>(null);

  const state1 = { birthYear, lifeExpectancy, returnRate1, cola1 };
  const setters1 = { setBirthYear, setLifeExpectancy, setReturnRate1, setCola1 };

  const state2 = { age1, payment1, age2, payment2, returnRate2, cola2 };
  const setters2 = { setAge1, setPayment1, setAge2, setPayment2, setReturnRate2, setCola2 };

  const handleClear1 = () => {
    setBirthYear(""); setLifeExpectancy(""); setReturnRate1(""); setCola1("");
    setResults(null);
  };

  const handleClear2 = () => {
    setAge1(""); setPayment1(""); setAge2(""); setPayment2(""); setReturnRate2(""); setCola2("");
    setResults(null);
  };

  const calculateForm1 = () => {
    const byear = parseInt(birthYear) || 1970;
    const lifeExp = parseFloat(lifeExpectancy) || 83;
    const ret = (parseFloat(returnRate1) || 0) / 100;
    const cola = (parseFloat(cola1) || 0) / 100;

    // Simple simulation from age 62 to 70 to find max NPV
    let bestAge = 62;
    let maxVal = -1;

    for (let claimAge = 62; claimAge <= 70; claimAge++) {
      // Base multiplier relative to FRA (assuming FRA 67 for born >= 1960)
      let multiplier = 1.0;
      if (claimAge === 62) multiplier = 0.70;
      else if (claimAge === 63) multiplier = 0.75;
      else if (claimAge === 64) multiplier = 0.80;
      else if (claimAge === 65) multiplier = 0.8667;
      else if (claimAge === 66) multiplier = 0.9333;
      else if (claimAge === 67) multiplier = 1.0;
      else if (claimAge === 68) multiplier = 1.08;
      else if (claimAge === 69) multiplier = 1.16;
      else if (claimAge === 70) multiplier = 1.24;

      let currentPayment = 1000 * multiplier; // Base starting point
      let totalValue = 0;

      for (let age = claimAge; age <= lifeExp; age++) {
        for (let m = 0; m < 12; m++) {
          totalValue = totalValue * (1 + ret / 12) + currentPayment;
        }
        currentPayment = currentPayment * (1 + cola);
      }

      if (totalValue > maxVal) {
        maxVal = totalValue;
        bestAge = claimAge;
      }
    }

    setResults({
      type: 'ideal',
      lifeExpectancy: lifeExp,
      returnRate: returnRate1,
      cola: cola1,
      bestAge: bestAge
    });
  };

  const calculateForm2 = () => {
    const a1 = parseInt(age1) || 62;
    const p1 = parseFloat(payment1.replace(/,/g, '')) || 0;
    const a2 = parseInt(age2) || 70;
    const p2 = parseFloat(payment2.replace(/,/g, '')) || 0;
    const ret = (parseFloat(returnRate2) || 0) / 100;
    const cola = (parseFloat(cola2) || 0) / 100;

    if (a1 >= a2) return; // invalid comparison

    let val1 = 0;
    let val2 = 0;

    let currentP1 = p1;
    let currentP2 = p2;

    let breakEvenAge = 0;

    for (let age = a1; age <= 120; age++) {
      for (let m = 0; m < 12; m++) {
        val1 = val1 * (1 + ret / 12) + currentP1;
        
        if (age >= a2) {
          val2 = val2 * (1 + ret / 12) + currentP2;
        } else {
          val2 = val2 * (1 + ret / 12);
        }
      }
      currentP1 = currentP1 * (1 + cola);
      if (age >= a2) {
        currentP2 = currentP2 * (1 + cola);
      }

      if (age > a2 && val2 >= val1 && breakEvenAge === 0) {
        breakEvenAge = age;
        break;
      }
    }

    setResults({
      type: 'compare',
      age1: a1,
      age2: a2,
      returnRate: returnRate2,
      cola: cola2,
      breakEvenAge: breakEvenAge > 0 ? breakEvenAge : "> 120"
    });
  };

  return (
    <div className="max-w-[800px] mx-auto bg-white p-2 md:p-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2 border-b pb-1">
        <div>home / financial / social security calculator</div>
      </div>
      
      <h1 className="text-[26px] font-bold text-gray-800 mb-4 font-sans">Social Security Calculator</h1>
      <p className="mb-4 text-[13px] text-gray-800 leading-relaxed">
        <a href="https://www.ssa.gov/" className="text-[#1c4587] underline">The U.S. Social Security website provides calculators for various purposes.</a> While they are all useful, there currently isn't a way to help determine the ideal (financially speaking) age at which a person between the ages of 62-70 should apply for their Social Security retirement benefits. This tool is designed specifically for this purpose. Please note that this calculator is intended for U.S. Social Security purposes only.
      </p>

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="flex-1">
          <SocialSecurityForm1 
            state={state1} 
            setters={setters1} 
            handleCalculate={calculateForm1}
            handleClear={handleClear1}
          />

          <SocialSecurityForm2 
            state={state2} 
            setters={setters2} 
            handleCalculate={calculateForm2}
            handleClear={handleClear2}
          />
        </div>
        <div className="w-full md:w-[350px]">
          <SocialSecurityResults results={results} />
        </div>
      </div>

      <SocialSecurityArticle />
    </div>
  );
}
