'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function GrossProfitForm() {
  const t = useTranslations('calculatorUI');
  const [revenue, setRevenue] = useState<number>(100000);
  const [cogs, setCogs] = useState<number>(60000);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const gross = revenue - cogs;
    const margin = (gross / revenue) * 100;
    setResult({ gross: gross.toFixed(2), margin: margin.toFixed(1), ratio: (cogs/revenue*100).toFixed(1) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Revenue ($)</label>
          <input type="number" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Cost of Goods Sold ($)</label>
          <input type="number" value={cogs} onChange={(e) => setCogs(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-green-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">${Number(result.gross).toLocaleString()}</p>
          <p className="text-sm mt-2">Gross Margin: {result.margin}%</p>
        </div>
      )}
    </div>
  );
}