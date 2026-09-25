"use client";

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { DollarSign, Calendar, Percent } from 'lucide-react';
import { PaymentForm } from '@/components/calculator/PaymentForm';
import { PaymentResults } from '@/components/calculator/PaymentResults';
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic';
import { SubCalcPanel, SubCalcGrid } from '@/components/premium/SubCalcPanel';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';

const calcMeta = {
  slug: 'payment-calculator',
  title: 'Payment Calculator',
  description: 'Calculate loan payments — fixed term or fixed payment amount.',
  tier: 'tier2',
  category: 'financial',
  hubSlug: 'financial-calculators',
  hubName: 'Financial Calculators',
  keywords: ['payment', 'loan payment', 'monthly payment', 'amortization'],
};

export function PaymentCalculator() {
  const th = useTranslations('hubs');
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState('fixedTerm');
  
  const [loanAmount, setLoanAmount] = useState("200,000");
  const [loanTerm, setLoanTerm] = useState("15");
  const [monthlyPayInput, setMonthlyPayInput] = useState("1,500");
  const [interestRate, setInterestRate] = useState("6");

  const state = { loanAmount, loanTerm, monthlyPayInput, interestRate };
  const setters = { setLoanAmount, setLoanTerm, setMonthlyPayInput, setInterestRate };

  const p = parseFloat(loanAmount.replace(/,/g, '')) || 0;
  const i = (parseFloat(interestRate) / 100) / 12;

  let computedMonthly = 0;
  let computedMonths = 0;

  if (activeTab === 'fixedTerm') {
    computedMonths = (parseFloat(loanTerm) || 0) * 12;
    if (i > 0 && computedMonths > 0 && p > 0) {
      computedMonthly = p * (i * Math.pow(1 + i, computedMonths)) / (Math.pow(1 + i, computedMonths) - 1);
    } else if (computedMonths > 0 && p > 0) {
      computedMonthly = p / computedMonths;
    }
  } else {
    const m = parseFloat(monthlyPayInput.replace(/,/g, '')) || 0;
    computedMonthly = m;
    if (i > 0 && m > p * i && p > 0) {
      computedMonths = Math.log(m / (m - p * i)) / Math.log(1 + i);
    } else if (i === 0 && m > 0 && p > 0) {
      computedMonths = p / m;
    }
    computedMonths = Math.ceil(computedMonths);
  }

  const totalPayments = computedMonthly * computedMonths;
  const totalInterest = totalPayments - p;

  const inputs = useMemo(() => ({
    loanAmount,
    term: loanTerm,
    rate: interestRate,
    monthlyPay: monthlyPayInput,
  }), [loanAmount, loanTerm, interestRate, monthlyPayInput]);

  const amortSchedule = useMemo(() => {
    if (!computedMonthly || !computedMonths || !p) return [];
    const rows: { year: number; principalPaid: number; interestPaid: number; balance: number }[] = [];
    let bal = p;
    let cumInt = 0;
    let yearPrincipal = 0;
    let yearInterest = 0;
    for (let m = 1; m <= computedMonths; m++) {
      const intPmt = bal * i;
      const prinPmt = Math.min(computedMonthly - intPmt, bal);
      bal -= prinPmt;
      cumInt += intPmt;
      yearPrincipal += prinPmt;
      yearInterest += intPmt;
      if (m % 12 === 0 || m === computedMonths) {
        rows.push({ year: Math.ceil(m / 12), principalPaid: yearPrincipal, interestPaid: yearInterest, balance: Math.max(0, bal) });
        yearPrincipal = 0;
        yearInterest = 0;
      }
    }
    return rows;
  }, [computedMonthly, computedMonths, p, i]);

  const subCalcs = useMemo(() => {
    const principalPct = p > 0 ? (p / totalPayments) * 100 : 0;
    return (
      <SubCalcGrid>
        <SubCalcPanel title="Payment Summary" icon={DollarSign} defaultOpen results={[
          { label: 'Monthly Payment', value: formatCurrency(computedMonthly, 'USD', locale), badge: 'info' },
          { label: 'Total Payments', value: formatCurrency(totalPayments, 'USD', locale) },
          { label: 'Total Interest', value: formatCurrency(totalInterest, 'USD', locale), badge: 'negative' },
        ]} />
        <SubCalcPanel title="Loan Details" icon={Calendar} results={[
          { label: 'Loan Amount', value: formatCurrency(p, 'USD', locale) },
          { label: 'Payoff Period', value: `${computedMonths} months (${(computedMonths / 12).toFixed(1)} years)` },
        ]} />
        {amortSchedule.length > 0 && (
          <SubCalcPanel title="Amortization Schedule (Yearly)" icon={Percent} defaultOpen results={amortSchedule.slice(0, Math.min(15, amortSchedule.length)).map(row => ({
            label: `Year ${row.year}`,
            value: `P: $${row.principalPaid.toLocaleString()} | I: $${row.interestPaid.toLocaleString()} | Bal: $${Math.round(row.balance).toLocaleString()}`,
          }))} />
        )}
      </SubCalcGrid>
    );
  }, [computedMonthly, totalPayments, totalInterest, p, computedMonths, locale, amortSchedule]);

  return (
    <PremiumCalculatorShell
      calculator={{...calcMeta, hubName: th(calcMeta.hubSlug)}}
      form={<PaymentForm state={state} setters={setters} activeTab={activeTab} setActiveTab={setActiveTab} />}
      result={<PaymentResults loanAmount={p} totalPayments={totalPayments} totalInterest={totalInterest} monthlyPayment={computedMonthly} numMonths={computedMonths} />}
      subCalcs={subCalcs}
      inputs={inputs}
      mainValue={computedMonthly}
    />
  );
}
