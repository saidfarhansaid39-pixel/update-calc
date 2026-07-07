'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function DepreciationForm() {
  const t = useTranslations('calculatorUI');
  const [cost, setCost] = useState<number>(25000);
  const [salvage, setSalvage] = useState<number>(5000);
  const [life, setLife] = useState<number>(5);
  const [year, setYear] = useState<number>(1);
  const [method, setMethod] = useState<string>('straight');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const depreciable = cost - salvage;
    if (method === 'straight') {
      const annual = depreciable / life;
      setResult({ depreciation: annual.toFixed(2), bookValue: (cost - annual * year).toFixed(2) });
    } else {
      const rate = 2 / life;
      let bv = cost;
      for (let i = 1; i < year; i++) bv -= bv * rate;
      const dep = bv * rate;
      setResult({ depreciation: dep.toFixed(2), bookValue: (bv - dep).toFixed(2) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-5 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Cost ($)</label>
          <input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Salvage Value ($)</label>
          <input type="number" value={salvage} onChange={(e) => setSalvage(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Life (years)</label>
          <input type="number" value={life} onChange={(e) => setLife(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Year</label>
          <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="straight">Straight Line</option><option value="declining">Declining Balance</option>
          </select></div>
      </div>
      <button onClick={calculate} className="bg-gray-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">${result.depreciation}</p>
          <p className="text-sm mt-2">Book Value: ${result.bookValue}</p>
        </div>
      )}
    </div>
  );
}