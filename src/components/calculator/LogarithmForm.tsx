'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function LogarithmForm() {
  const t = useTranslations('calculatorUI');
  const [number, setNumber] = useState<number>(100);
  const [base, setBase] = useState<number>(10);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const log = Math.log(number) / Math.log(base);
    const natural = Math.log(number);
    const common = Math.log10(number);
    setResult({ log: log.toFixed(6), natural: natural.toFixed(6), common: common.toFixed(6) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Number</label>
          <input type="number" value={number} onChange={(e) => setNumber(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Base</label>
          <input type="number" value={base} onChange={(e) => setBase(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-indigo-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">log<sub>{base}</sub>({number}) = {result.log}</p>
          <p className="text-sm mt-2">ln: {result.natural} | log₁₀: {result.common}</p>
        </div>
      )}
    </div>
  );
}