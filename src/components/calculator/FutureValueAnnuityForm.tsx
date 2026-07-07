'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function FutureValueAnnuityForm() {
  const t = useTranslations('calculatorUI');
  const [pmt, setPmt] = useState<number>(500);
  const [rate, setRate] = useState<number>(6);
  const [years, setYears] = useState<number>(10);
  const [type, setType] = useState<string>('ordinary');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const r = rate / 100 / 12;
    const n = years * 12;
    let fv = 0;
    if (r === 0) fv = pmt * n;
    else fv = type === 'ordinary' ? pmt * ((Math.pow(1+r, n) - 1) / r) : pmt * ((Math.pow(1+r, n) - 1) / r) * (1+r);
    setResult({ fv: fv.toFixed(2), totalContributions: (pmt * n).toFixed(2), interestEarned: (fv - pmt*n).toFixed(2) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.monthlyPay')}</label>
          <input type="number" value={pmt} onChange={(e) => setPmt(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.rate')}</label>
          <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Years</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="ordinary">Ordinary</option><option value="due">Due</option>
          </select></div>
      </div>
      <button onClick={calculate} className="bg-teal-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">${Number(result.fv).toLocaleString()}</p>
          <p className="text-sm mt-2">Contributions: ${Number(result.totalContributions).toLocaleString()} | Interest: ${Number(result.interestEarned).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}