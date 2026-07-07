'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function BreakEvenForm() {
  const t = useTranslations('calculatorUI');
  const [fixed, setFixed] = useState<number>(10000);
  const [price, setPrice] = useState<number>(50);
  const [variable, setVariable] = useState<number>(30);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const contribution = price - variable;
    const breakEvenUnits = fixed / contribution;
    const breakEvenRevenue = breakEvenUnits * price;
    setResult({ units: Math.ceil(breakEvenUnits).toLocaleString(), revenue: breakEvenRevenue.toFixed(0), margin: contribution });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Fixed Costs ($)</label>
          <input type="number" value={fixed} onChange={(e) => setFixed(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Price per Unit ($)</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Variable Cost/Unit ($)</label>
          <input type="number" value={variable} onChange={(e) => setVariable(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-green-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">{result.units} units</p>
          <p className="text-sm mt-2">Revenue: ${Number(result.revenue).toLocaleString()} | Margin: ${result.margin}</p>
        </div>
      )}
    </div>
  );
}
