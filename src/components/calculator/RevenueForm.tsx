'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function RevenueForm() {
  const t = useTranslations('calculatorUI');
  const [price, setPrice] = useState<number>(29.99);
  const [quantity, setQuantity] = useState<number>(1000);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const revenue = price * quantity;
    const avgRevenue = revenue / quantity;
    setResult({ revenue: revenue.toFixed(2), avgRevenue: avgRevenue.toFixed(2) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Price per Unit ($)</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Quantity Sold</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-green-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">${Number(result.revenue).toLocaleString()}</p>
          <p className="text-sm mt-2">Avg Revenue/Unit: ${result.avgRevenue}</p>
        </div>
      )}
    </div>
  );
}