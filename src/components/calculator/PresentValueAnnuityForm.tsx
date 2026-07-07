'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function PresentValueAnnuityForm() {
  const t = useTranslations('calculatorUI');
  const [pmt, setPmt] = useState<number>(1000);
  const [rate, setRate] = useState<number>(5);
  const [years, setYears] = useState<number>(20);
  const [type, setType] = useState<string>('ordinary');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const r = rate / 100 / 12;
    const n = years * 12;
    let pv = 0;
    if (r === 0) pv = pmt * n;
    else pv = type === 'ordinary' ? pmt * ((1 - Math.pow(1+r, -n)) / r) : pmt * ((1 - Math.pow(1+r, -n)) / r) * (1+r);
    setResult({ pv: pv.toFixed(2), totalPayments: (pmt * n).toFixed(2) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Payment ($/mo)</label>
          <input type="number" value={pmt} onChange={(e) => setPmt(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.rate')}</label>
          <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Years</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="ordinary">Ordinary Annuity</option><option value="due">Annuity Due</option>
          </select></div>
      </div>
      <button onClick={calculate} className="bg-indigo-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">${Number(result.pv).toLocaleString()}</p>
          <p className="text-sm mt-2">Total Payments: ${Number(result.totalPayments).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}