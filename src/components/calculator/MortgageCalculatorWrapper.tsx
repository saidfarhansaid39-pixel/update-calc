"use client";

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { DollarSign, Home, Percent, Calendar } from 'lucide-react';
import { MortgageForm } from '@/components/calculator/MortgageForm';
import { MortgageResults } from '@/components/calculator/MortgageResults';
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic';
import { SubCalcPanel, SubCalcGrid } from '@/components/premium/SubCalcPanel';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';

const calcMeta = {
  slug: 'mortgage-calculator',
  title: 'Mortgage Calculator',
  description: 'Calculate your monthly mortgage payment with taxes, insurance, PMI, and HOA fees included.',
  tier: 'tier2',
  category: 'financial',
  hubSlug: 'financial-calculators',
  hubName: 'Financial Calculators',
  keywords: ['mortgage', 'home loan', 'monthly payment', 'PITI'],
};

export function MortgageCalculatorWrapper() {
  const th = useTranslations('hubs');
  const t = useTranslations('calculatorUI');
  const locale = useLocale();
  const [homePrice, setHomePrice] = useState("400,000");
  const [downPaymentDollar, setDownPaymentDollar] = useState("80,000");
  const [downPaymentPercent, setDownPaymentPercent] = useState("20");
  const [loanTerm, setLoanTerm] = useState("30");
  const [interestRate, setInterestRate] = useState("6.609");
  
  const [propertyTaxPercent, setPropertyTaxPercent] = useState("1.2");
  const [propertyTaxDollar, setPropertyTaxDollar] = useState("4,800");
  const [homeInsurance, setHomeInsurance] = useState("1,500");
  const [hoaFee, setHoaFee] = useState("0");
  const [otherCosts, setOtherCosts] = useState("4,000");
  const [extraPayment, setExtraPayment] = useState("");

  const state = {
    homePrice, downPaymentDollar, downPaymentPercent, loanTerm, interestRate,
    propertyTaxPercent, propertyTaxDollar, homeInsurance, hoaFee, otherCosts, extraPayment
  };

  const setters = {
    setHomePrice, setDownPaymentDollar, setDownPaymentPercent, setLoanTerm, setInterestRate,
    setPropertyTaxPercent, setPropertyTaxDollar, setHomeInsurance, setHoaFee, setOtherCosts, setExtraPayment
  };

  const hp = parseFloat(homePrice.replace(/,/g, '')) || 0;
  const dpDollar = parseFloat(downPaymentDollar.replace(/,/g, '')) || 0;
  const loanTermYears = parseFloat(loanTerm) || 0;
  const ir = parseFloat(interestRate) || 0;
  
  const ptPercent = parseFloat(propertyTaxPercent) || 0;
  const hi = parseFloat(homeInsurance.replace(/,/g, '')) || 0;
  const other = parseFloat(otherCosts.replace(/,/g, '')) || 0;

  const p = hp - dpDollar;
  const i = (ir / 100) / 12;
  const n = loanTermYears * 12;

  let monthlyPrincipalAndInterest = 0;
  if (i > 0 && n > 0 && p > 0) {
    monthlyPrincipalAndInterest = p * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  } else if (n > 0 && p > 0) {
    monthlyPrincipalAndInterest = p / n;
  }

  const totalPayments = monthlyPrincipalAndInterest * n;
  const totalInterest = totalPayments - p;
  
  const monthlyPropertyTax = (hp * (ptPercent / 100)) / 12;
  const monthlyHomeInsurance = hi / 12;
  const monthlyOtherCosts = other / 12;

  const extraPmt = parseFloat(extraPayment.replace(/,/g, '')) || 0;
  let payoffMonths = n;
  let payoffInterest = totalInterest;
  if (extraPmt > 0 && monthlyPrincipalAndInterest > 0) {
    let bal = p;
    let intSum = 0;
    for (let m = 0; m < n; m++) {
      const intPmt = bal * i;
      intSum += intPmt;
      const prinPmt = Math.min(monthlyPrincipalAndInterest - intPmt + extraPmt, bal);
      bal -= prinPmt;
      if (bal <= 0) { payoffMonths = m + 1; payoffInterest = intSum; break; }
    }
  }

  const inputs = useMemo(() => ({
    homePrice,
    downPayment: downPaymentDollar,
    rate: interestRate,
    term: loanTerm,
    propertyTax: propertyTaxPercent,
    homeInsurance,
    hoa: hoaFee,
    otherCosts,
  }), [homePrice, downPaymentDollar, interestRate, loanTerm, propertyTaxPercent, homeInsurance, hoaFee, otherCosts]);

  const subCalcs = useMemo(() => {
    const totalOutOfPocket = monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyOtherCosts;
    const downPct = hp > 0 ? (dpDollar / hp) * 100 : 0;
    return (
      <SubCalcGrid>
        <SubCalcPanel title="Monthly Payment Breakdown" icon={DollarSign} defaultOpen results={[
          { label: 'Principal & Interest', value: formatCurrency(monthlyPrincipalAndInterest, 'USD', locale), badge: 'info' },
          ...(monthlyPropertyTax > 0 ? [{ label: 'Property Tax', value: formatCurrency(monthlyPropertyTax, 'USD', locale) }] : []),
          ...(monthlyHomeInsurance > 0 ? [{ label: 'Home Insurance', value: formatCurrency(monthlyHomeInsurance, 'USD', locale) }] : []),
          { label: 'Total Monthly PITI', value: formatCurrency(totalOutOfPocket, 'USD', locale), badge: 'positive' },
        ]} />
        <SubCalcPanel title="Loan Summary" icon={Home} results={[
          { label: 'Home Price', value: formatCurrency(hp, 'USD', locale) },
          { label: 'Down Payment', value: `${formatCurrency(dpDollar, 'USD', locale)} (${downPct.toFixed(1)}%)` },
          { label: 'Loan Amount', value: formatCurrency(p, 'USD', locale) },
          { label: 'Total Interest', value: formatCurrency(totalInterest, 'USD', locale), badge: 'negative' },
          ...(extraPmt > 0 ? [{ label: 'With $' + extraPmt + '/mo extra', value: `Payoff: ${Math.floor(payoffMonths / 12)}yr ${payoffMonths % 12}mo, Interest: ${formatCurrency(payoffInterest, 'USD', locale)}`, badge: 'positive' as const }] : []),
        ]} />
      </SubCalcGrid>
    );
  }, [monthlyPrincipalAndInterest, monthlyPropertyTax, monthlyHomeInsurance, monthlyOtherCosts, hp, dpDollar, p, totalInterest, locale, extraPmt, payoffMonths, payoffInterest]);

  const result = (
    <MortgageResults 
      homePrice={hp}
      loanAmount={p}
      downPayment={dpDollar}
      monthlyPayment={monthlyPrincipalAndInterest}
      totalPayments={totalPayments}
      totalInterest={totalInterest}
      propertyTax={monthlyPropertyTax}
      homeInsurance={monthlyHomeInsurance}
      otherCosts={monthlyOtherCosts}
    />
  );

  return (
    <PremiumCalculatorShell
      calculator={{...calcMeta, hubName: th(calcMeta.hubSlug)}}
      form={<MortgageForm state={state} setters={setters} />}
      result={result}
      subCalcs={subCalcs}
      inputs={inputs}
      mainValue={monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyOtherCosts}
    />
  );
}
