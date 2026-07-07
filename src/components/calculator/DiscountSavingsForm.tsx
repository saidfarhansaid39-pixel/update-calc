'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function DiscountSavingsForm() {
  const t = useTranslations('calculatorUI');
  const [original, setOriginal] = useState<number>(100);
  const [discount, setDiscount] = useState<number>(25);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const savings = original * (discount / 100);
    const final = original - savings;
    setResult({ savings: savings.toFixed(2), final: final.toFixed(2), youSave: `You save ${discount}%` });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Original Price ($)</label>
          <input type="number" value={original} onChange={(e) => setOriginal(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Discount (%)</label>
          <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-red-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">${result.final}</p>
          <p className="text-sm mt-2">You save: ${result.savings}</p>
        </div>
      )}
    </div>
  );
}