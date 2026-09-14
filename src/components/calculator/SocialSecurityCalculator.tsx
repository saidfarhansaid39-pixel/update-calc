"use client";

import React, { useState, useMemo } from 'react';
import { Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import { SocialSecurityForm1 } from '@/components/calculator/SocialSecurityForm1';
import { SocialSecurityForm2 } from '@/components/calculator/SocialSecurityForm2';
import { SocialSecurityResults } from '@/components/calculator/SocialSecurityResults';
import { SocialSecurityArticle } from '@/components/calculator/SocialSecurityArticle';
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic';
import { SubCalcPanel, SubCalcGrid } from '@/components/premium/SubCalcPanel';

const FRA = 67;

const calcMeta = {
  slug: 'social-security-calculator',
  title: 'Social Security Calculator',
  description: 'Determine the ideal age to claim Social Security retirement benefits and compare claiming strategies.',
  tier: 'tier2',
  category: 'financial',
  hubSlug: 'financial-calculators',
  hubName: 'Financial Calculators',
  keywords: ['social security', 'retirement benefits', 'claiming age', 'FRA', 'break-even age'],
};

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

  const inputs = useMemo(() => ({
    birthYear, lifeExpectancy, returnRate1, cola1,
    age1, payment1, age2, payment2, returnRate2, cola2,
  }), [birthYear, lifeExpectancy, returnRate1, cola1, age1, payment1, age2, payment2, returnRate2, cola2]);

  const mainValue = results?.type === 'ideal'
    ? results.bestAge
    : results?.type === 'compare'
      ? (typeof results.breakEvenAge === 'number' ? results.breakEvenAge : 0)
      : 0;

  const subCalcs = useMemo(() => {
    const idealResults = results?.type === 'ideal' ? results : null;
    const compareResults = results?.type === 'compare' ? results : null;

    return (
      <SubCalcGrid>
        <SubCalcPanel title="Full Retirement Age" icon={Calendar} defaultOpen results={[
          { label: 'FRA (born ≥ 1960)', value: `${FRA} years` },
          { label: 'Early Eligibility', value: '62 years', badge: 'info' },
          { label: 'Maximum Delayed Credit', value: '70 years', badge: 'info' },
          { label: 'Early Reduction (62)', value: '30% reduction' },
          { label: 'Delayed Credit (70)', value: '+24% increase' },
        ]} />
        {idealResults && (
          <SubCalcPanel title="Ideal Age Analysis" icon={TrendingUp} defaultOpen results={[
            { label: 'Best Claiming Age', value: `Age ${idealResults.bestAge}`, badge: 'positive' },
            { label: 'Life Expectancy', value: `${idealResults.lifeExpectancy} years` },
            { label: 'vs FRA (67)', value: idealResults.bestAge < FRA ? `Early by ${FRA - idealResults.bestAge} years` : idealResults.bestAge > FRA ? `Delayed by ${idealResults.bestAge - FRA} years` : 'At FRA' },
            { label: 'Investment Return', value: `${idealResults.returnRate}%` },
            { label: 'COLA', value: `${idealResults.cola}%` },
          ]} />
        )}
        {compareResults && (
          <SubCalcPanel title="Comparison Analysis" icon={Users} defaultOpen results={[
            { label: 'Option 1 (Claim at)', value: `Age ${compareResults.age1}` },
            { label: 'Option 2 (Claim at)', value: `Age ${compareResults.age2}` },
            { label: 'Break-Even Age', value: `Age ${compareResults.breakEvenAge}`, badge: 'info' },
            { label: 'Investment Return', value: `${compareResults.returnRate}%` },
            { label: 'COLA', value: `${compareResults.cola}%` },
          ]} />
        )}
        <SubCalcPanel title="Benefit Overview" icon={DollarSign} results={[
          { label: 'Spousal Benefit', value: 'Up to 50% of PIA' },
          { label: 'Survivor Benefit', value: 'Up to 100% of PIA' },
          { label: 'Tax on Benefits', value: 'Up to 85% taxable', badge: 'info' },
          { label: 'Cost-of-Living Adjustment', value: 'Annual COLA applies' },
        ]} />
      </SubCalcGrid>
    );
  }, [results]);

  return (
    <>
      <PremiumCalculatorShell
        calculator={calcMeta}
        form={
          <div>
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
        }
        result={<SocialSecurityResults results={results} />}
        subCalcs={subCalcs}
        inputs={inputs}
        mainValue={mainValue}
      />
      <SocialSecurityArticle />
    </>
  );
}
