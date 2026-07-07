'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function MarkupForm() {
  const t = useTranslations('calculatorUI');
  const [cost, setCost] = useState<number>(50);
  const [sellingPrice, setSellingPrice] = useState<number>(75);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const profit = sellingPrice - cost;
    const markup = (profit / cost) * 100;
    const margin = (profit / sellingPrice) * 100;
    setResult({ profit: profit.toFixed(2), markup: markup.toFixed(1), margin: margin.toFixed(1) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Cost ($)</label>
          <input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Selling Price ($)</label>
          <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-blue-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">Markup: {result.markup}%</p>
          <p className="text-sm mt-2">Profit: ${result.profit} | Margin: {result.margin}%</p>
        </div>
      )}
    </div>
  );
}