'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function LCMCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [numbers, setNumbers] = useState<string>('12, 18');
  const [result, setResult] = useState<any>(null);

  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

  const calculate = () => {
    const arr = numbers.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (arr.length > 0) {
      const res = arr.reduce((a, b) => lcm(a, b));
      setResult(res);
    }
  };

  return (
    <div className="space-y-6">
      <div><label className="block text-sm text-gray-700 mb-1">Enter numbers (comma separated)</label>
        <input type="text" value={numbers} onChange={(e) => setNumbers(e.target.value)} className="w-full px-4 py-3 border rounded-lg" /></div>
      <button onClick={calculate} className="bg-blue-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mt-6 text-center">
          <p className="text-4xl font-bold">{result}</p>
        </div>
      )}
    </div>
  );
}