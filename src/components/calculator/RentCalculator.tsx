"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { DollarSign, Home, Percent, Calendar } from 'lucide-react';
import { RentForm } from '@/components/calculator/RentForm';
import { RentResults } from '@/components/calculator/RentResults';
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic';
import { SubCalcPanel, SubCalcGrid } from '@/components/premium/SubCalcPanel';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';

const calcMeta = {
  slug: 'rent-calculator',
  title: 'Rent Calculator',
  description: 'Calculate how much rent you can afford based on your income and monthly debt.',
  tier: 'tier3',
  category: 'financial',
  hubSlug: 'financial-calculators',
  hubName: 'Financial Calculators',
  keywords: ['rent', 'affordability', 'rental budget', 'income'],
};

export function RentCalculator() {
  const th = useTranslations('hubs');
  const locale = useLocale();
  const [income, setIncome] = useState("80,000");
  const [incomeFrequency, setIncomeFrequency] = useState("per year");
  const [debt, setDebt] = useState("0");
  const [rentAmount, setRentAmount] = useState("");
  const [results, setResults] = useState<any>(null);

  const state = { income, incomeFrequency, debt, rentAmount };
  const setters = { setIncome, setIncomeFrequency, setDebt, setRentAmount };

  const handleClear = () => {
    setIncome("");
    setDebt("");
    setRentAmount("");
    setResults(null);
  };

  const calculate = () => {
    const rawIncome = parseFloat(income.replace(/,/g, '')) || 0;
    const monthlyDebt = parseFloat(debt.replace(/,/g, '')) || 0;
    const monthlyRent = parseFloat(rentAmount.replace(/,/g, '')) || 0;

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
    let maximum = (monthlyGross * 0.43) - monthlyDebt;
    if (maximum < 0) maximum = 0;

    const rentToIncomeRatio = monthlyGross > 0 ? (monthlyRent / monthlyGross) * 100 : 0;
    const totalDti = monthlyGross > 0 ? ((monthlyRent + monthlyDebt) / monthlyGross) * 100 : 0;

    setResults({
      conservative,
      recommended,
      maximum,
      rentAmount: monthlyRent,
      rentToIncomeRatio,
      totalDti,
      monthlyGross
    });
  };

  useEffect(() => {
    calculate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rawIncome = parseFloat(income.replace(/,/g, '')) || 0;
  let monthlyGross = rawIncome;
  if (incomeFrequency === "per year") {
    monthlyGross = rawIncome / 12;
  }

  const inputs = useMemo(() => ({
    income,
    incomeFrequency,
    debt,
  }), [income, incomeFrequency, debt]);

  const subCalcs = useMemo(() => {
    if (!results) return null;
    const monthlyDebt = parseFloat(debt.replace(/,/g, '')) || 0;
    const dtiRatio = monthlyGross > 0 ? monthlyDebt / monthlyGross : 0;
    const annualRecommended = results.recommended * 12;
    const totalFiveYear = results.recommended * 60;
    const totalTenYear = results.recommended * 120;
    const opportunityCostAnnual = annualRecommended * 0.07;

    return (
      <SubCalcGrid>
        <SubCalcPanel title="Rent Affordability Breakdown" icon={Home} defaultOpen results={[
          { label: 'Conservative Budget (25% rule)', value: formatCurrency(results.conservative, 'USD', locale), badge: 'positive' },
          { label: 'Recommended Budget (30% rule)', value: formatCurrency(results.recommended, 'USD', locale) },
          { label: 'Maximum Budget (DTI limit)', value: formatCurrency(results.maximum, 'USD', locale), badge: 'info' },
        ]} />
        <SubCalcPanel title="Total Over Time" icon={Calendar} results={[
          { label: 'Annual Rent (recommended)', value: formatCurrency(annualRecommended, 'USD', locale) },
          { label: '5-Year Total', value: formatCurrency(totalFiveYear, 'USD', locale) },
          { label: '10-Year Total', value: formatCurrency(totalTenYear, 'USD', locale) },
        ]} />
        <SubCalcPanel title="Debt & Opportunity Cost" icon={Percent} results={[
          { label: 'Debt-to-Income Ratio', value: `${(dtiRatio * 100).toFixed(1)}%`, badge: dtiRatio > 0.43 ? 'negative' : 'info' },
          { label: 'Monthly Gross Income', value: formatCurrency(monthlyGross, 'USD', locale) },
          { label: 'Est. Annual Opportunity Cost', value: formatCurrency(opportunityCostAnnual, 'USD', locale) },
        ]} />
      </SubCalcGrid>
    );
  }, [results, monthlyGross, debt, locale]);

  return (
    <PremiumCalculatorShell
      calculator={{...calcMeta, hubName: th(calcMeta.hubSlug)}}
      form={<RentForm state={state} setters={setters} handleCalculate={calculate} handleClear={handleClear} />}
      result={<RentResults results={results} />}
      subCalcs={subCalcs}
      mainValue={results?.recommended ?? 0}
      inputs={inputs}
    />
  );
}
