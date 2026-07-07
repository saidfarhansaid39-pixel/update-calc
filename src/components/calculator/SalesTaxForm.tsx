'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function SalesTaxForm() {
  const t = useTranslations('calculatorUI');
  const [amount, setAmount] = useState<number>(100);
  const [rate, setRate] = useState<number>(8.5);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const tax = amount * (rate / 100);
    const total = amount + tax;
    setResult({ tax: tax.toFixed(2), total: total.toFixed(2) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Amount ($)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Tax Rate (%)</label>
          <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-blue-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">${result.total}</p>
          <p className="text-sm mt-2">Tax: ${result.tax}</p>
        </div>
      )}
    </div>
  );
}