'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function PercentOffForm() {
  const t = useTranslations('calculatorUI');
  const [price, setPrice] = useState<number>(100);
  const [percentOff, setPercentOff] = useState<number>(25);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const discount = price * (percentOff / 100);
    const final = price - discount;
    setResult({ discount: discount.toFixed(2), final: final.toFixed(2), youSave: `You save $${discount.toFixed(2)}` });
  }, [price, percentOff]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Original Price ($)</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Percent Off (%)</label>
          <input type="number" value={percentOff} onChange={(e) => setPercentOff(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white mt-6 text-center">
          <p className="text-5xl font-bold">${Math.round(result.final)}</p>
          <p className="mt-2">{result.youSave}</p>
        </div>
      )}
    </div>
  );
}
