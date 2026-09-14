"use client";

import React, { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { DollarSign, Calendar, PiggyBank } from 'lucide-react';
import { AnnuityForm } from '@/components/calculator/AnnuityForm';
import { AnnuityResults } from '@/components/calculator/AnnuityResults';
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic';
import { SubCalcPanel, SubCalcGrid } from '@/components/premium/SubCalcPanel';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';

const calcMeta = {
  slug: 'annuity-payout-calculator',
  title: 'Annuity Payout Calculator',
  description: 'Estimate annuity payout amounts or how long your annuity will last.',
  tier: 'tier2',
  category: 'financial',
  hubSlug: 'financial-calculators',
  hubName: 'Financial Calculators',
  keywords: ['annuity', 'payout', 'retirement income', 'annuity payment'],
};

export function AnnuityPayoutCalculator() {
  const locale = useLocale();
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

  const subCalcs = useMemo(() => {
    if (!results) return null;
    const totalPayout = results.principal + results.totalInterest;
    return (
      <SubCalcGrid>
        <SubCalcPanel title="Payout Summary" icon={DollarSign} defaultOpen results={[
          { label: 'Payment Amount', value: formatCurrency(results.payment, 'USD', locale), badge: 'info' },
          { label: 'Payment Frequency', value: results.freqLabel },
          { label: 'Total Payout', value: formatCurrency(totalPayout, 'USD', locale) },
          { label: 'Total Interest', value: formatCurrency(results.totalInterest, 'USD', locale), badge: results.totalInterest > 0 ? 'positive' : 'negative' },
        ]} />
        <SubCalcPanel title="Duration & Principal" icon={Calendar} results={[
          { label: 'Starting Principal', value: formatCurrency(results.principal, 'USD', locale) },
          { label: 'Number of Payments', value: String(results.totalPeriods) },
          { label: 'Payout Period', value: `${results.yearsStr} years` },
        ]} />
      </SubCalcGrid>
    );
  }, [results, locale]);

  return (
    <PremiumCalculatorShell
      calculator={calcMeta}
      form={<AnnuityForm state={state} setters={setters} handleCalculate={calculate} handleClear={handleClear} />}
      result={<AnnuityResults results={results} />}
      subCalcs={subCalcs}
      inputs={{ principal, rate, years, payment, frequency }}
      mainValue={results?.payment}
    />
  );
}
