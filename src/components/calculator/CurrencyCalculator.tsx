"use client";

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowLeftRight, DollarSign } from 'lucide-react';
import { CurrencyForm } from '@/components/calculator/CurrencyForm';
import { CurrencyTables } from '@/components/calculator/CurrencyTables';
import { CurrencyArticle } from '@/components/calculator/CurrencyArticle';
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic';
import { SubCalcPanel, SubCalcGrid } from '@/components/premium/SubCalcPanel';


const calcMeta = {
  slug: 'currency-calculator',
  title: 'Currency Calculator',
  description: 'Convert between currencies using live exchange rates or custom rates with full market data.',
  tier: 'tier2',
  category: 'financial',
  hubSlug: 'financial-calculators',
  hubName: 'Financial Calculators',
  keywords: ['currency', 'exchange rate', 'forex', 'currency converter', 'money conversion'],
};

export function CurrencyCalculator() {
  const th = useTranslations('hubs');
  const locale = useLocale();
  const [liveAmount, setLiveAmount] = useState("100");
  const [liveFrom, setLiveFrom] = useState("USD");
  const [liveTo, setLiveTo] = useState("EUR");
  const [liveResult, setLiveResult] = useState<number | null>(null);

  const [customRate, setCustomRate] = useState("4");
  const [customAmount, setCustomAmount] = useState("100");
  const [customResult, setCustomResult] = useState<number | null>(null);

  const state = { liveAmount, liveFrom, liveTo, liveResult, customRate, customAmount, customResult };
  const setters = { 
    setLiveAmount, 
    setLiveFrom, 
    setLiveTo, 
    setCustomRate, 
    setCustomAmount 
  };

  const handleLiveCalculate = () => {
    // mock conversion
    setLiveResult(parseFloat(liveAmount) * 0.86);
  };
  const handleLiveClear = () => {
    setLiveAmount("");
    setLiveResult(null);
  };

  const handleCustomCalculate = () => {
    setCustomResult(parseFloat(customAmount) * parseFloat(customRate));
  };
  const handleCustomClear = () => {
    setCustomAmount("");
    setCustomRate("");
    setCustomResult(null);
  };

  const liveAmt = parseFloat(liveAmount) || 0;
  const customAmt = parseFloat(customAmount) || 0;
  const liveRate = liveAmt > 0 && liveResult !== null ? liveResult / liveAmt : 0;
  const reverseRate = liveRate > 0 ? 1 / liveRate : 0;
  const customRateNum = parseFloat(customRate) || 0;

  const inputs = useMemo(() => ({
    liveAmount, liveFrom, liveTo,
    customRate, customAmount,
  }), [liveAmount, liveFrom, liveTo, customRate, customAmount]);

  const result = useMemo(() => {
    const items: { label: string; value: string }[] = [];
    if (liveResult !== null) {
      items.push({ label: `${liveAmt} ${liveFrom}`, value: `${liveResult.toFixed(2)} ${liveTo}` });
    }
    if (customResult !== null) {
      items.push({ label: `${customAmt} units @ ${customRateNum}`, value: customResult.toFixed(2) });
    }
    if (items.length === 0) return null;

    return (
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }, [liveResult, liveAmt, liveFrom, liveTo, customResult, customAmt, customRateNum]);

  const subCalcs = useMemo(() => {
    return (
      <SubCalcGrid>
        <SubCalcPanel title="Live Rate Details" icon={ArrowLeftRight} defaultOpen results={[
          ...(liveRate > 0 ? [
            { label: `1 ${liveFrom} → ${liveTo}`, value: liveRate.toFixed(6), badge: 'info' as const },
            { label: `1 ${liveTo} → ${liveFrom}`, value: reverseRate.toFixed(6) },
          ] : [{ label: 'No live rate calculated', value: '—' }]),
          ...(liveResult !== null ? [
            { label: `${liveAmt} ${liveFrom} =`, value: `${liveResult.toFixed(2)} ${liveTo}`, badge: 'positive' as const },
          ] : []),
        ]} />
        <SubCalcPanel title="Custom Rate Details" icon={DollarSign} results={[
          { label: 'Mid-Market Rate', value: customRateNum > 0 ? customRateNum.toFixed(6) : 'N/A', badge: 'info' },
          ...(customResult !== null ? [
            { label: `Output (${customAmt} × ${customRateNum})`, value: customResult.toFixed(2) },
            { label: 'Inverse Rate', value: customRateNum > 0 ? (1 / customRateNum).toFixed(6) : 'N/A' },
          ] : []),
        ]} />
      </SubCalcGrid>
    );
  }, [liveRate, liveFrom, liveTo, reverseRate, liveResult, liveAmt, customRateNum, customResult, customAmt]);

  return (
    <>
      <PremiumCalculatorShell
        calculator={{...calcMeta, hubName: th(calcMeta.hubSlug)}}
        form={
          <CurrencyForm 
            state={state} 
            setters={setters} 
            handleLiveCalculate={handleLiveCalculate}
            handleLiveClear={handleLiveClear}
            handleCustomCalculate={handleCustomCalculate}
            handleCustomClear={handleCustomClear}
          />
        }
        result={result}
        subCalcs={subCalcs}
        inputs={inputs}
        mainValue={liveResult ?? customResult ?? 0}
      />
      <CurrencyTables />
      <CurrencyArticle />
    </>
  );
}
