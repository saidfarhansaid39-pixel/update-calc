'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function StandardDeviationForm() {
  const t = useTranslations('calculatorUI');
  const [numbers, setNumbers] = useState<string>('10, 20, 30, 40, 50');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const arr = numbers.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    if (arr.length < 2) return;
    
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / (arr.length - 1);
    const stdDev = Math.sqrt(variance);
    
    setResult({ mean: mean.toFixed(2), variance: variance.toFixed(2), stdDev: stdDev.toFixed(2), count: arr.length });
  };

  return (
    <div className="space-y-6">
      <div><label className="block text-sm text-gray-700 mb-1">Enter numbers (comma separated)</label>
        <textarea value={numbers} onChange={(e) => setNumbers(e.target.value)} className="w-full px-4 py-3 border rounded-lg h-24" /></div>
      <button onClick={calculate} className="bg-green-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-2xl font-bold">Std Dev: {result.stdDev}</p>
          <p className="text-sm mt-2">Mean: {result.mean} | Variance: {result.variance} | Count: {result.count}</p>
        </div>
      )}
    </div>
  );
}