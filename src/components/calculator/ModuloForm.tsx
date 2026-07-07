'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ModuloForm() {
  const t = useTranslations('calculatorUI');
  const [dividend, setDividend] = useState<number>(17);
  const [divisor, setDivisor] = useState<number>(5);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const quotient = Math.floor(dividend / divisor);
    const remainder = dividend % divisor;
    setResult({ remainder, quotient, full: `${quotient} R ${remainder}` });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Dividend</label>
          <input type="number" value={dividend} onChange={(e) => setDividend(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Divisor</label>
          <input type="number" value={divisor} onChange={(e) => setDivisor(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-purple-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white mt-6 text-center">
          <p className="text-4xl font-bold">{dividend} % {divisor} = {result.remainder}</p>
          <p className="text-sm mt-2">{result.full}</p>
        </div>
      )}
    </div>
  );
}