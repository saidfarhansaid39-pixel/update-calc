'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function HomeEquityForm() {
  const t = useTranslations('calculatorUI');
  const [homeValue, setHomeValue] = useState<number>(300000);
  const [mortgage, setMortgage] = useState<number>(200000);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const equity = homeValue - mortgage;
    const pct = (equity / homeValue) * 100;
    setResult({ equity: equity.toLocaleString(), pct: pct.toFixed(1) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Home Value ($)</label>
          <input type="number" value={homeValue} onChange={(e) => setHomeValue(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Mortgage Balance ($)</label>
          <input type="number" value={mortgage} onChange={(e) => setMortgage(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-green-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">${result.equity}</p>
          <p className="text-sm mt-2">{result.pct}% equity in your home</p>
        </div>
      )}
    </div>
  );
}