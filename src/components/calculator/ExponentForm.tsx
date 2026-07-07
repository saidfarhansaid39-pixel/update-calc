'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ExponentForm() {
  const t = useTranslations('calculatorUI');
  const [base, setBase] = useState<number>(2);
  const [exponent, setExponent] = useState<number>(10);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const res = Math.pow(base, exponent);
    const log2 = Math.log2(res);
    setResult({ value: res.toExponential(4), exact: res.toLocaleString(), log: log2.toFixed(2) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Base</label>
          <input type="number" value={base} onChange={(e) => setBase(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Exponent</label>
          <input type="number" value={exponent} onChange={(e) => setExponent(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-indigo-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">{base}^{exponent} = {result.value}</p>
          <p className="text-sm mt-2">{result.exact} | log₂ = {result.log}</p>
        </div>
      )}
    </div>
  );
}