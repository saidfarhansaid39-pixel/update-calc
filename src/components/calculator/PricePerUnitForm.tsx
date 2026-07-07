'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function PricePerUnitForm() {
  const t = useTranslations('calculatorUI');
  const [totalPrice, setTotalPrice] = useState<number>(29.99);
  const [quantity, setQuantity] = useState<number>(12);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const perUnit = totalPrice / quantity;
    const comparePrice = perUnit * 100;
    setResult({ perUnit: perUnit.toFixed(2), per100: comparePrice.toFixed(2) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Total Price ($)</label>
          <input type="number" value={totalPrice} onChange={(e) => setTotalPrice(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Quantity</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-blue-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">${result.perUnit}/unit</p>
          <p className="text-sm mt-2">Per 100 units: ${result.per100}</p>
        </div>
      )}
    </div>
  );
}