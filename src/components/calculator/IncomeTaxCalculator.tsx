"use client";

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { DollarSign, Receipt } from 'lucide-react';
import { IncomeTaxForm } from '@/components/calculator/IncomeTaxForm';
import { IncomeTaxResults } from '@/components/calculator/IncomeTaxResults';
import { IncomeTaxArticle } from '@/components/calculator/IncomeTaxArticle';
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic';
import { SubCalcPanel, SubCalcGrid } from '@/components/premium/SubCalcPanel';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';

const calcMeta = {
  slug: 'income-tax-calculator',
  title: 'Income Tax Calculator',
  description: 'Calculate your federal income tax refund or amount owed based on 2025-2026 tax brackets.',
  tier: 'tier2',
  category: 'financial',
  hubSlug: 'financial-calculators',
  hubName: 'Financial Calculators',
  keywords: ['income tax', 'tax refund', 'tax brackets', 'federal tax', 'tax calculator'],
};

export function IncomeTaxCalculator() {
  const th = useTranslations('hubs');
  const locale = useLocale();
  const [wages, setWages] = useState("80,000");
  const [fedWithheld, setFedWithheld] = useState("9,000");
  const [showResults, setShowResults] = useState(false);

  const state = { wages, fedWithheld };
  const setters = { setWages, setFedWithheld };

  const handleClear = () => {
    setWages("");
    setFedWithheld("");
    setShowResults(false);
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  // Simplified Mock Calculation for demonstration of "real" behavior
  const w = parseFloat(wages.replace(/,/g, '')) || 0;
  const fw = parseFloat(fedWithheld.replace(/,/g, '')) || 0;
  
  // Very simplified 2025 single bracket mock
  let taxOwed = 0;
  let taxable = w - 14600; // standard deduction mock
  if (taxable > 0) {
    if (taxable <= 11600) {
      taxOwed = taxable * 0.10;
    } else if (taxable <= 47150) {
      taxOwed = 1160 + (taxable - 11600) * 0.12;
    } else if (taxable <= 100525) {
      taxOwed = 5426 + (taxable - 47150) * 0.22;
    } else {
      taxOwed = 17168 + (taxable - 100525) * 0.24;
    }
  }
  const effectiveRate = w > 0 ? (taxOwed / w) * 100 : 0;

  let marginalRate = 0;
  if (taxable > 0) {
    if (taxable <= 11600) marginalRate = 10;
    else if (taxable <= 47150) marginalRate = 12;
    else if (taxable <= 100525) marginalRate = 22;
    else marginalRate = 24;
  }

  const takeHome = w - taxOwed;
  const refundOrOwed = fw - taxOwed;
  const isRefund = refundOrOwed >= 0;

  const inputs = useMemo(() => ({
    wages,
    fedWithheld,
  }), [wages, fedWithheld]);

  const subCalcs = useMemo(() => {
    return (
      <SubCalcGrid>
        <SubCalcPanel title="Income Summary" icon={DollarSign} defaultOpen results={[
          { label: 'Gross Income', value: formatCurrency(w, 'USD', locale) },
          { label: 'Standard Deduction', value: formatCurrency(14600, 'USD', locale), badge: 'info' },
          { label: 'Taxable Income', value: formatCurrency(Math.max(taxable, 0), 'USD', locale) },
          { label: 'Take-Home Pay', value: formatCurrency(takeHome, 'USD', locale), badge: 'positive' },
        ]} />
        <SubCalcPanel title="Tax Breakdown" icon={Receipt} results={[
          { label: 'Total Federal Tax', value: formatCurrency(taxOwed, 'USD', locale), badge: 'negative' },
          { label: 'Effective Tax Rate', value: `${effectiveRate.toFixed(2)}%` },
          { label: 'Marginal Tax Rate', value: `${marginalRate}%`, badge: 'info' },
          { label: 'Taxes Withheld', value: formatCurrency(fw, 'USD', locale) },
          { label: isRefund ? 'Estimated Refund' : 'Amount You Owe', value: formatCurrency(Math.abs(refundOrOwed), 'USD', locale), badge: isRefund ? 'positive' : 'negative' },
        ]} />
      </SubCalcGrid>
    );
  }, [w, taxable, taxOwed, effectiveRate, marginalRate, takeHome, fw, refundOrOwed, isRefund, locale]);

  const result = showResults ? (
    <IncomeTaxResults 
      wages={w}
      fedWithheld={fw}
      taxOwed={taxOwed}
      effectiveRate={effectiveRate}
    />
  ) : null;

  return (
    <>
      <PremiumCalculatorShell
        calculator={{...calcMeta, hubName: th(calcMeta.hubSlug)}}
        form={<IncomeTaxForm state={state} setters={setters} handleCalculate={handleCalculate} handleClear={handleClear} />}
        result={result}
        subCalcs={subCalcs}
        inputs={inputs}
        mainValue={taxOwed}
      />
      <IncomeTaxArticle />
    </>
  );
}
