'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function InflationCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [currentAmount, setCurrentAmount] = useState<number>(10000);
  const [inflationRate, setInflationRate] = useState<number>(3);
  const [years, setYears] = useState<number>(10);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const futureAmount = currentAmount * Math.pow(1 + inflationRate / 100, years);
    const purchasingPower = currentAmount / Math.pow(1 + inflationRate / 100, years);
    const lostValue = futureAmount - currentAmount;
    
    setResult({
      futureAmount: Math.round(futureAmount),
      purchasingPower: Math.round(purchasingPower),
      lostValue: Math.round(lostValue)
    });
  }, [currentAmount, inflationRate, years]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Current Amount ($)</label>
          <input type="number" value={currentAmount} onChange={(e) => setCurrentAmount(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Inflation Rate (%/year)</label>
          <input type="number" step="0.1" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Years</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-bold text-lg text-gray-800 mb-3">{t('sections.results')}</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded text-center"><p className="text-sm text-gray-500">Future Amount Needed</p><p className="text-2xl font-bold text-red-600">${result.futureAmount.toLocaleString()}</p></div>
            <div className="bg-white p-3 rounded text-center"><p className="text-sm text-gray-500">Value Lost to Inflation</p><p className="text-2xl font-bold text-red-600">${result.lostValue.toLocaleString()}</p></div>
            <div className="bg-white p-3 rounded text-center"><p className="text-sm text-gray-500">Current Purchasing Power</p><p className="text-2xl font-bold text-gray-700">${result.purchasingPower.toLocaleString()}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}