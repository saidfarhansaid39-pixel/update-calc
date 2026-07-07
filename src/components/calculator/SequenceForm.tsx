'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function SequenceForm() {
  const t = useTranslations('calculatorUI');
  const [type, setType] = useState<string>('arithmetic');
  const [a1, setA1] = useState<number>(1);
  const [d, setD] = useState<number>(2);
  const [n, setN] = useState<number>(10);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    let terms: number[] = [];
    for (let i = 0; i < n; i++) {
      if (type === 'arithmetic') terms.push(a1 + i * d);
      else terms.push(a1 * Math.pow(d, i));
    }
    const last = terms[terms.length - 1];
    const sum = terms.reduce((a, b) => a + b, 0);
    setResult({ terms: terms.slice(0, 10).join(', ') + (n > 10 ? '...' : ''), last: last.toFixed(1), sum: sum.toLocaleString() });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="arithmetic">Arithmetic</option><option value="geometric">Geometric</option>
          </select></div>
        <div><label className="block text-sm text-gray-700 mb-1">First Term</label>
          <input type="number" value={a1} onChange={(e) => setA1(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">{type === 'arithmetic' ? 'Difference' : 'Ratio'}</label>
          <input type="number" value={d} onChange={(e) => setD(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Number of Terms</label>
          <input type="number" value={n} onChange={(e) => setN(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-blue-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-xl font-bold">Terms: {result.terms}</p>
          <p className="text-sm mt-2">Last: {result.last} | Sum: {result.sum}</p>
        </div>
      )}
    </div>
  );
}