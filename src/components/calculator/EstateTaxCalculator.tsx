"use client";

import React, { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { DollarSign, Percent, Calendar } from 'lucide-react';
import { EstateTaxForm } from '@/components/calculator/EstateTaxForm';
import { EstateTaxResults } from '@/components/calculator/EstateTaxResults';
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic';
import { SubCalcPanel, SubCalcGrid } from '@/components/premium/SubCalcPanel';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';

const calcMeta = {
  slug: 'estate-tax-calculator',
  title: 'Estate Tax Calculator',
  description: 'Estimate federal estate tax due based on gross estate value, deductions, and lifetime gifts.',
  tier: 'tier3',
  category: 'financial',
  hubSlug: 'financial-calculators',
  hubName: 'Financial Calculators',
  keywords: ['estate', 'tax', 'inheritance', 'federal exemption'],
};

export function EstateTaxCalculator() {
  const locale = useLocale();
  // Assets
  const [residence, setResidence] = useState("0");
  const [stocks, setStocks] = useState("0");
  const [savings, setSavings] = useState("0");
  const [vehicles, setVehicles] = useState("0");
  const [retirement, setRetirement] = useState("0");
  const [insurance, setInsurance] = useState("0");
  const [otherAssets, setOtherAssets] = useState("0");

  // Liabilities
  const [debts, setDebts] = useState("0");
  const [funeral, setFuneral] = useState("0");
  const [charitable, setCharitable] = useState("0");
  const [stateTax, setStateTax] = useState("0");

  // Lifetime Gifted
  const [gifted, setGifted] = useState("0");

  const [results, setResults] = useState<any>(null);

  const state = { residence, stocks, savings, vehicles, retirement, insurance, otherAssets, debts, funeral, charitable, stateTax, gifted };
  const setters = { setResidence, setStocks, setSavings, setVehicles, setRetirement, setInsurance, setOtherAssets, setDebts, setFuneral, setCharitable, setStateTax, setGifted };

  const handleClear = () => {
    setResidence("0"); setStocks("0"); setSavings("0"); setVehicles("0"); setRetirement("0"); setInsurance("0"); setOtherAssets("0");
    setDebts("0"); setFuneral("0"); setCharitable("0"); setStateTax("0");
    setGifted("0");
    setResults(null);
  };

  const calculate = () => {
    const parseVal = (str: string) => parseFloat(str.replace(/,/g, '')) || 0;

    const grossEstate = 
      parseVal(residence) + parseVal(stocks) + parseVal(savings) + 
      parseVal(vehicles) + parseVal(retirement) + parseVal(insurance) + parseVal(otherAssets);

    const totalDeductions = 
      parseVal(debts) + parseVal(funeral) + parseVal(charitable) + parseVal(stateTax);

    const giftedAmount = parseVal(gifted);

    // If everything is basically 0, don't show results
    if (grossEstate === 0 && totalDeductions === 0 && giftedAmount === 0) {
      setResults(null);
      return;
    }

    let taxableEstate = grossEstate - totalDeductions + giftedAmount;
    if (taxableEstate < 0) taxableEstate = 0;

    // 2026 Federal Exemption is $15,000,000 based on the article table
    const exemption = 15000000;
    
    let estimatedTax = 0;
    if (taxableEstate > exemption) {
      estimatedTax = (taxableEstate - exemption) * 0.40; // 40% rate
    }

    setResults({
      grossEstate,
      totalDeductions,
      giftedAmount,
      taxableEstate,
      exemption,
      estimatedTax
    });
  };

  const inputs = useMemo(() => ({
    residence, stocks, savings, vehicles, retirement, insurance, otherAssets,
    debts, funeral, charitable, stateTax, gifted,
  }), [residence, stocks, savings, vehicles, retirement, insurance, otherAssets, debts, funeral, charitable, stateTax, gifted]);

  const subCalcs = useMemo(() => {
    if (!results) return null;
    const taxableAfterExemption = Math.max(0, results.taxableEstate - results.exemption);
    const effectiveRate = results.grossEstate > 0 ? (results.estimatedTax / results.grossEstate) * 100 : 0;

    return (
      <SubCalcGrid>
        <SubCalcPanel title="Estate Value Summary" icon={DollarSign} defaultOpen results={[
          { label: 'Gross Estate Value', value: formatCurrency(results.grossEstate, 'USD', locale) },
          { label: 'Total Deductions', value: formatCurrency(results.totalDeductions, 'USD', locale), badge: 'positive' },
          { label: 'Lifetime Gifts', value: formatCurrency(results.giftedAmount, 'USD', locale) },
          { label: 'Total Taxable Estate', value: formatCurrency(results.taxableEstate, 'USD', locale), badge: 'info' },
        ]} />
        <SubCalcPanel title="Federal Tax Calculation" icon={Percent} results={[
          { label: 'Federal Exemption (2026)', value: formatCurrency(results.exemption, 'USD', locale) },
          { label: 'Amount Subject to Tax', value: formatCurrency(taxableAfterExemption, 'USD', locale), badge: taxableAfterExemption > 0 ? 'negative' : 'positive' },
          { label: 'Federal Estate Tax Rate', value: '40%' },
          { label: 'Estimated Tax Due', value: formatCurrency(results.estimatedTax, 'USD', locale), badge: results.estimatedTax > 0 ? 'negative' : 'positive' },
        ]} />
        <SubCalcPanel title="Tax Analysis" icon={Calendar} results={[
          { label: 'Effective Tax Rate', value: `${effectiveRate.toFixed(2)}%`, description: 'Percentage of gross estate owed in federal tax' },
          { label: 'State Estate Tax', value: 'Varies by state', description: 'Many states impose additional estate or inheritance taxes with lower exemptions' },
        ]} />
      </SubCalcGrid>
    );
  }, [results, locale]);

  return (
    <PremiumCalculatorShell
      calculator={calcMeta}
      form={<EstateTaxForm state={state} setters={setters} handleCalculate={calculate} handleClear={handleClear} />}
      result={<EstateTaxResults results={results} />}
      subCalcs={subCalcs}
      mainValue={results?.estimatedTax ?? 0}
      inputs={inputs}
    />
  );
}
