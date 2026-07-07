'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function FactorialForm() {
  const t = useTranslations('calculatorUI');
  const [number, setNumber] = useState<number>(10);
  const [result, setResult] = useState<any>(null);

  const factorial = (n: number): string => {
    if (n > 20) return 'Too large (use approximation)';
    let res = BigInt(1);
    for (let i = 2; i <= n; i++) res *= BigInt(i);
    return res.toString();
  };

  const calculate = () => {
    setResult(factorial(number));
  };

  return (
    <div className="space-y-6">
      <div><label className="block text-sm text-gray-700 mb-1">Enter Number</label>
        <input type="number" value={number} onChange={(e) => setNumber(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      <button onClick={calculate} className="bg-purple-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">{number}! = {result}</p>
        </div>
      )}
    </div>
  );
}