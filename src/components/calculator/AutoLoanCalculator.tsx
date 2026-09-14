"use client";

import React, { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { DollarSign, Car, Percent } from 'lucide-react';
import { AutoLoanForm } from '@/components/calculator/AutoLoanForm';
import { AutoLoanResults } from '@/components/calculator/AutoLoanResults';
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic';
import { SubCalcPanel, SubCalcGrid } from '@/components/premium/SubCalcPanel';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';

const calcMeta = {
  slug: 'auto-loan-calculator',
  title: 'Auto Loan Calculator',
  description: 'Calculate monthly car payments including tax, trade-in, and fees.',
  tier: 'tier2',
  category: 'financial',
  hubSlug: 'financial-calculators',
  hubName: 'Financial Calculators',
  keywords: ['auto loan', 'car payment', 'vehicle financing', 'monthly payment'],
};

export function AutoLoanCalculator() {
  const locale = useLocale();
  const [autoPrice, setAutoPrice] = useState("50,000");
  const [loanTerm, setLoanTerm] = useState("60");
  const [interestRate, setInterestRate] = useState("5");
  const [cashIncentives, setCashIncentives] = useState("0");
  const [downPayment, setDownPayment] = useState("10,000");
  const [tradeInValue, setTradeInValue] = useState("0");
  const [amountOwedOnTradeIn, setAmountOwedOnTradeIn] = useState("0");
  const [stateCode, setStateCode] = useState("-- Select --");
  const [salesTax, setSalesTax] = useState("7");
  const [titleRegistration, setTitleRegistration] = useState("2,000");

  const state = {
    autoPrice, loanTerm, interestRate, cashIncentives, downPayment, 
    tradeInValue, amountOwedOnTradeIn, state: stateCode, salesTax, titleRegistration
  };

  const setters = {
    setAutoPrice, setLoanTerm, setInterestRate, setCashIncentives, setDownPayment,
    setTradeInValue, setAmountOwedOnTradeIn, setState: setStateCode, setSalesTax, setTitleRegistration
  };

  const price = parseFloat(autoPrice.replace(/,/g, '')) || 0;
  const term = parseFloat(loanTerm) || 0;
  const rate = parseFloat(interestRate) || 0;
  const incentives = parseFloat(cashIncentives.replace(/,/g, '')) || 0;
  const down = parseFloat(downPayment.replace(/,/g, '')) || 0;
  const tradeIn = parseFloat(tradeInValue.replace(/,/g, '')) || 0;
  const owedOnTradeIn = parseFloat(amountOwedOnTradeIn.replace(/,/g, '')) || 0;
  const taxRate = parseFloat(salesTax) || 0;
  const title = parseFloat(titleRegistration.replace(/,/g, '')) || 0;

  let taxableAmount = price - tradeIn;
  if (taxableAmount < 0) taxableAmount = 0;
  const tax = taxableAmount * (taxRate / 100);

  const upfront = down + tradeIn;
  const principal = price - incentives - upfront + owedOnTradeIn + tax + title;

  const i = (rate / 100) / 12;
  
  let monthly = 0;
  if (i > 0 && term > 0 && principal > 0) {
    monthly = principal * (i * Math.pow(1 + i, term)) / (Math.pow(1 + i, term) - 1);
  } else if (term > 0 && principal > 0) {
    monthly = principal / term;
  }

  const totalPay = monthly * term;
  const totalInt = totalPay - principal;
  const totalCostOverall = totalPay + upfront + incentives;

  const inputs = useMemo(() => ({
    autoPrice,
    term: loanTerm,
    rate: interestRate,
    downPayment,
    tradeIn: tradeInValue,
    salesTax,
    titleRegistration,
  }), [autoPrice, loanTerm, interestRate, downPayment, tradeInValue, salesTax, titleRegistration]);

  const subCalcs = useMemo(() => {
    return (
      <SubCalcGrid>
        <SubCalcPanel title="Payment Breakdown" icon={DollarSign} defaultOpen results={[
          { label: 'Monthly Payment', value: formatCurrency(monthly, 'USD', locale), badge: 'info' },
          { label: 'Total of Payments', value: formatCurrency(totalPay, 'USD', locale) },
          { label: 'Total Interest', value: formatCurrency(totalInt, 'USD', locale), badge: 'negative' },
        ]} />
        <SubCalcPanel title="Cost Details" icon={Car} results={[
          { label: 'Vehicle Price', value: formatCurrency(price, 'USD', locale) },
          { label: 'Down Payment', value: formatCurrency(down, 'USD', locale) },
          { label: 'Trade-In Value', value: formatCurrency(tradeIn, 'USD', locale) },
          { label: 'Sales Tax', value: formatCurrency(tax, 'USD', locale) },
          { label: 'Total Cost', value: formatCurrency(totalCostOverall, 'USD', locale), badge: 'positive' },
        ]} />
      </SubCalcGrid>
    );
  }, [monthly, totalPay, totalInt, price, down, tradeIn, tax, totalCostOverall, locale]);

  return (
    <PremiumCalculatorShell
      calculator={calcMeta}
      form={<AutoLoanForm state={state} setters={setters} />}
      result={<AutoLoanResults totalLoanAmount={principal} salesTax={tax} upfrontPayment={upfront} totalPayments={totalPay} totalInterest={totalInt} totalCost={totalCostOverall} monthlyPayment={monthly} />}
      subCalcs={subCalcs}
      inputs={inputs}
      mainValue={monthly}
    />
  );
}
