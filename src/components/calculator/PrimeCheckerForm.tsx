'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function PrimeCheckerForm() {
  const t = useTranslations('calculatorUI');
  const [number, setNumber] = useState<number>(17);
  const [result, setResult] = useState<any>(null);

  const checkPrime = (n: number) => {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  };

  const check = () => {
    const isPrime = checkPrime(number);
    const factors: number[] = [];
    for (let i = 1; i <= Math.sqrt(number); i++) {
      if (number % i === 0) { factors.push(i); if (i !== number/i) factors.push(number/i); }
    }
    setResult({ isPrime, factors: factors.sort((a,b) => a-b) });
  };

  return (
    <div className="space-y-6">
      <div><label className="block text-sm text-gray-700 mb-1">Enter Number</label>
        <input type="number" value={number} onChange={(e) => setNumber(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      <button onClick={check} className="bg-purple-600 text-white px-6 py-2 rounded">Check</button>
      {result && (
        <div className="rounded-2xl p-6 mt-6" style={{ background: result.isPrime ? 'linear-gradient(to bottom right, #10b981, #059669)' : 'linear-gradient(to bottom right, #ef4444, #dc2626)' }}>
          <p className="text-4xl font-bold text-white">{result.isPrime ? 'Prime Number' : 'Not Prime'}</p>
          <p className="text-sm mt-2 text-white">Factors: {result.factors.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
