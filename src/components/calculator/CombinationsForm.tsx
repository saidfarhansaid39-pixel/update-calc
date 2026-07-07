'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CombinationsForm() {
  const t = useTranslations('calculatorUI');
  const [n, setN] = useState<number>(10);
  const [r, setR] = useState<number>(3);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const factorial = (num: number): bigint => {
      if (num <= 1) return BigInt(1);
      let res = BigInt(1);
      for (let i = 2; i <= num; i++) res *= BigInt(i);
      return res;
    };
    const comb = factorial(n) / (factorial(r) * factorial(n - r));
    setResult({ combinations: comb.toString(), permutations: (factorial(n) / factorial(n-r)).toString() });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Total Items (n)</label>
          <input type="number" value={n} onChange={(e) => setN(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Choose (r)</label>
          <input type="number" value={r} onChange={(e) => setR(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-purple-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">C({n},{r}) = {result.combinations}</p>
          <p className="text-sm mt-2">P({n},{r}) = {result.permutations}</p>
        </div>
      )}
    </div>
  );
}
