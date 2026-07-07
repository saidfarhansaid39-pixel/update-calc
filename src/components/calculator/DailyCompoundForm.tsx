'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function DailyCompoundForm() {
  const t = useTranslations('calculatorUI');
  const [principal, setPrincipal] = useState<number>(1000);
  const [rate, setRate] = useState<number>(5);
  const [days, setDays] = useState<number>(30);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const amount = principal * Math.pow(1 + rate/100/365, days);
    const interest = amount - principal;
    setResult({ amount: amount.toFixed(2), interest: interest.toFixed(2) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Principal ($)</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Annual Rate (%)</label>
          <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Days</label>
          <input type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-green-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">${result.amount}</p>
          <p className="text-sm mt-2">Interest: ${result.interest}</p>
        </div>
      )}
    </div>
  );
}
