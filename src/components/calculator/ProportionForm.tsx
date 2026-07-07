'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ProportionForm() {
  const t = useTranslations('calculatorUI');
  const [a, setA] = useState<number>(3);
  const [b, setB] = useState<number>(6);
  const [c, setC] = useState<number>(9);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const x = (b * c) / a;
    setResult(x.toFixed(2));
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">A</label>
          <input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">B</label>
          <input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">C</label>
          <input type="number" value={c} onChange={(e) => setC(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <p className="text-gray-600 text-center">A:B = C:__</p>
      <button onClick={calculate} className="bg-blue-600 text-white px-6 py-2 rounded">Solve</button>
      {result && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mt-6 text-center">
          <p className="text-4xl font-bold">X = {result}</p>
        </div>
      )}
    </div>
  );
}
