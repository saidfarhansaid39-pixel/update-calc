"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { DollarSign, Percent, Landmark } from 'lucide-react';
import { InterestRateForm } from '@/components/calculator/InterestRateForm';
import { InterestRateResults } from '@/components/calculator/InterestRateResults';
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic';
import { SubCalcPanel, SubCalcGrid } from '@/components/premium/SubCalcPanel';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';

const calcMeta = {
  slug: 'interest-rate-calculator',
  title: 'Interest Rate Calculator',
  description: 'The Interest Rate Calculator determines real interest rates on loans with fixed terms and monthly payments. For example, it can calculate interest rates in situations where car dealers only provide monthly payment information and total price without including the actual rate on the car loan.',
  tier: 'tier2',
  category: 'financial',
  hubSlug: 'financial-calculators',
  hubName: 'Financial Calculators',
  keywords: ['interest rate', 'loan', 'APR', 'APY'],
};

export function InterestRateCalculatorWrapper() {
  const locale = useLocale();
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
      return;
    }

    let low = 0;
    let high = 1.0;
    let mid = 0;
    let calculatedPV = 0;

    for (let i = 0; i < 100; i++) {
      mid = (low + high) / 2;
      calculatedPV = pmt * ((1 - Math.pow(1 + mid, -totalMonths)) / mid);
      if (calculatedPV > principal) {
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

  useEffect(() => {
    calculate();
  }, []);

  const principal = parseFloat(loanAmount.replace(/,/g, '')) || 0;
  const pmt = parseFloat(monthlyPayment.replace(/,/g, '')) || 0;
  const totalMonths = (parseFloat(years) || 0) * 12 + (parseFloat(months) || 0);
  const totalPaymentsDerived = pmt * totalMonths;
  const totalInterestDerived = totalPaymentsDerived - principal;
  const annualRate = results?.interestRate || 0;
  const apy = annualRate > 0 ? (Math.pow(1 + annualRate / 100 / 12, 12) - 1) * 100 : 0;

  const inputs = useMemo(() => ({
    loanAmount,
    years,
    months,
    monthlyPayment,
  }), [loanAmount, years, months, monthlyPayment]);

  const subCalcs = useMemo(() => (
    <SubCalcGrid>
      <SubCalcPanel title="Payment Summary" icon={DollarSign} results={[
        { label: 'Monthly Payment', value: formatCurrency(pmt, 'USD', locale) },
        { label: 'Total Payment', value: formatCurrency(totalPaymentsDerived, 'USD', locale) },
        { label: 'Total Interest', value: formatCurrency(totalInterestDerived, 'USD', locale), badge: 'negative' },
      ]} />
      <SubCalcPanel title="Rates" icon={Percent} defaultOpen results={[
        { label: 'Effective Annual Rate', value: `${annualRate.toFixed(3)}%`, badge: 'info' },
        { label: 'APY', value: `${apy.toFixed(3)}%`, badge: 'info' },
      ]} />
    </SubCalcGrid>
  ), [pmt, totalPaymentsDerived, totalInterestDerived, annualRate, apy, locale]);

  const result = results ? <InterestRateResults results={results} /> : null;

  return (
    <PremiumCalculatorShell
      calculator={calcMeta}
      form={<InterestRateForm state={state} setters={setters} handleCalculate={calculate} handleClear={handleClear} />}
      result={result}
      subCalcs={subCalcs}
      mainValue={annualRate}
      inputs={inputs}
    />
  );
}
