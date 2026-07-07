'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ProfitCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [revenue, setRevenue] = useState<number>(50000);
  const [cost, setCost] = useState<number>(35000);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const profit = revenue - cost;
    const margin = (profit / revenue) * 100;
    const markup = (profit / cost) * 100;
    setResult({ profit: profit.toFixed(2), margin: margin.toFixed(1), markup: markup.toFixed(1) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Revenue ($)</label>
          <input type="number" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Cost ($)</label>
          <input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-blue-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">${Number(result.profit).toLocaleString()}</p>
          <p className="text-sm mt-2">Profit Margin: {result.margin}% | Markup: {result.markup}%</p>
        </div>
      )}
    </div>
  );
}