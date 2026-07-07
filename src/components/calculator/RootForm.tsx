'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function RootForm() {
  const t = useTranslations('calculatorUI');
  const [number, setNumber] = useState<number>(64);
  const [root, setRoot] = useState<number>(2);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const res = Math.pow(number, 1/root);
    setResult({ value: res.toFixed(6), exact: number === Math.pow(Math.round(res), root) ? Math.round(res).toString() : 'irrational' });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Number</label>
          <input type="number" value={number} onChange={(e) => setNumber(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Root</label>
          <input type="number" value={root} onChange={(e) => setRoot(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-teal-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">{result.value}</p>
          <p className="text-sm mt-2">{root}√{number} = {result.value}</p>
        </div>
      )}
    </div>
  );
}