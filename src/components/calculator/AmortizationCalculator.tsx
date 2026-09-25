"use client";

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { DollarSign, Calendar, PieChart, Landmark } from 'lucide-react';
import { AmortizationForm } from '@/components/calculator/AmortizationForm';
import { AmortizationResults } from '@/components/calculator/AmortizationResults';
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic';
import { SubCalcPanel, SubCalcGrid } from '@/components/premium/SubCalcPanel';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';

const calcMeta = {
  slug: 'amortization-calculator',
  title: 'Amortization Calculator',
  description: 'Calculate your loan amortization schedule with monthly payment breakdowns, total interest, and principal payments over time.',
  tier: 'tier2',
  category: 'financial',
  hubSlug: 'financial-calculators',
  hubName: 'Financial Calculators',
  keywords: ['amortization', 'loan schedule', 'monthly payment', 'principal', 'interest'],
};

function breakDownYear(principal: number, monthlyRate: number, payment: number, months: number) {
  let balance = principal;
  let interestTotal = 0;
  let principalTotal = 0;
  for (let m = 0; m < months; m++) {
    if (balance <= 0) break;
    const interest = balance * monthlyRate;
    const principalPaid = Math.min(payment - interest, balance);
    balance -= principalPaid;
    interestTotal += interest;
    principalTotal += principalPaid;
  }
  return { interestTotal, principalTotal, endingBalance: Math.max(0, balance) };
}

export function AmortizationCalculator() {
  const th = useTranslations('hubs');
  const locale = useLocale();
  const [loanAmount, setLoanAmount] = useState("200,000");
  const [loanTermYears, setLoanTermYears] = useState("15");
  const [loanTermMonths, setLoanTermMonths] = useState("0");
  const [interestRate, setInterestRate] = useState("6");

  const state = { loanAmount, loanTermYears, loanTermMonths, interestRate };
  const setters = { setLoanAmount, setLoanTermYears, setLoanTermMonths, setInterestRate };

  const p = parseFloat(loanAmount.replace(/,/g, '')) || 0;
  const i = (parseFloat(interestRate) / 100) / 12;
  const years = parseFloat(loanTermYears) || 0;
  const months = parseFloat(loanTermMonths) || 0;
  
  const computedMonths = (years * 12) + months;
  
  let computedMonthly = 0;
  if (i > 0 && computedMonths > 0 && p > 0) {
    computedMonthly = p * (i * Math.pow(1 + i, computedMonths)) / (Math.pow(1 + i, computedMonths) - 1);
  } else if (computedMonths > 0 && p > 0) {
    computedMonthly = p / computedMonths;
  }

  const totalPayments = computedMonthly * computedMonths;
  const totalInterest = totalPayments - p;

  const inputs = useMemo(() => ({
    loanAmount,
    loanTermYears,
    loanTermMonths,
    interestRate,
  }), [loanAmount, loanTermYears, loanTermMonths, interestRate]);

  const subCalcs = useMemo(() => {
    const y1 = breakDownYear(p, i, computedMonthly, 12);
    const y5 = breakDownYear(p, i, computedMonthly, 60);
    const y10 = breakDownYear(p, i, computedMonthly, 120);
    return (
      <SubCalcGrid>
        <SubCalcPanel title="Payment Summary" icon={DollarSign} results={[
          { label: 'Monthly Payment', value: formatCurrency(computedMonthly, 'USD', locale) },
          { label: 'Total Interest', value: formatCurrency(totalInterest, 'USD', locale), badge: 'negative' },
          { label: 'Total Cost', value: formatCurrency(totalPayments, 'USD', locale) },
        ]} />
        <SubCalcPanel title="Payoff Info" icon={Calendar} results={[
          { label: 'Payoff Period', value: `${Math.floor(computedMonths / 12)}yr ${computedMonths % 12}mo`, badge: 'info' },
        ]} />
        <SubCalcPanel title="Yearly Breakdown" icon={PieChart} results={[
          { label: 'Year 1', value: `P: ${formatCurrency(y1.principalTotal, 'USD', locale)} / I: ${formatCurrency(y1.interestTotal, 'USD', locale)}` },
          { label: 'Year 5', value: `P: ${formatCurrency(y5.principalTotal, 'USD', locale)} / I: ${formatCurrency(y5.interestTotal, 'USD', locale)}` },
          { label: 'Year 10', value: `P: ${formatCurrency(y10.principalTotal, 'USD', locale)} / I: ${formatCurrency(y10.interestTotal, 'USD', locale)}` },
        ]} />
      </SubCalcGrid>
    );
  }, [p, i, computedMonthly, computedMonths, totalInterest, totalPayments, locale]);

  const result = (
    <AmortizationResults 
      loanAmount={p}
      totalPayments={totalPayments}
      totalInterest={totalInterest}
      monthlyPayment={computedMonthly}
      numMonths={computedMonths}
    />
  );

  return (
    <PremiumCalculatorShell
      calculator={{...calcMeta, hubName: th(calcMeta.hubSlug)}}
      form={<AmortizationForm state={state} setters={setters} />}
      result={result}
      subCalcs={subCalcs}
      mainValue={computedMonthly}
      inputs={inputs}
    />
  );
}
