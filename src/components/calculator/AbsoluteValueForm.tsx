'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function AbsoluteValueForm() {
  const t = useTranslations('calculatorUI');
  const [number, setNumber] = useState<number>(-42);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const abs = Math.abs(number);
    const sign = Math.sign(number);
    setResult({ abs, sign, isNegative: number < 0 });
  };

  return (
    <div className="space-y-6">
      <div><label className="block text-sm text-gray-700 mb-1">Enter Number</label>
        <input type="number" value={number} onChange={(e) => setNumber(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      <button onClick={calculate} className="bg-blue-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mt-6 text-center">
          <p className="text-4xl font-bold">|{number}| = {result.abs}</p>
          <p className="text-sm mt-2">Sign: {result.sign === 1 ? '+' : result.sign === -1 ? '-' : '0'}</p>
        </div>
      )}
    </div>
  );
}
