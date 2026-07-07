'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CompoundForm() {
  const t = useTranslations('calculatorUI');
  const [principal, setPrincipal] = useState<number>(1000);
  const [rate, setRate] = useState<number>(5);
  const [years, setYears] = useState<number>(10);
  const [frequency, setFrequency] = useState<number>(12);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const n = frequency;
    const r = rate / 100;
    const amount = principal * Math.pow(1 + r/n, n * years);
    const interest = amount - principal;
    setResult({ amount: amount.toFixed(2), interest: interest.toFixed(2), total: (principal + interest).toFixed(2) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Principal ($)</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Rate (%)</label>
          <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Years</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Compounds/Year</label>
          <select value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg">
            <option value="1">Annually</option><option value="4">Quarterly</option><option value="12">Monthly</option><option value="365">Daily</option>
          </select></div>
      </div>
      <button onClick={calculate} className="bg-green-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">${result.amount}</p>
          <p className="text-sm mt-2">Interest: ${result.interest} | Total: ${result.total}</p>
        </div>
      )}
    </div>
  );
}
