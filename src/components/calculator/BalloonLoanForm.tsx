'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function BalloonLoanForm() {
  const t = useTranslations('calculatorUI');
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(5);
  const [years, setYears] = useState<number>(5);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const monthly = (principal * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
    const totalPayment = monthly * n;
    const totalInterest = totalPayment - principal;
    const balloon = principal;
    setResult({ monthly: monthly.toFixed(2), totalInterest: totalInterest.toFixed(2), balloon });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Principal ($)</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Interest Rate (%)</label>
          <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Years</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-orange-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">${result.monthly}/mo</p>
          <p className="text-sm mt-2">Balloon: ${result.balloon} | Total Interest: ${result.totalInterest}</p>
        </div>
      )}
    </div>
  );
}
