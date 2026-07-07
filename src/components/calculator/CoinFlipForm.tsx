'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CoinFlipForm() {
  const t = useTranslations('calculatorUI');
  const [flips, setFlips] = useState<number>(10);
  const [result, setResult] = useState<any>(null);

  const flip = () => {
    let heads = 0, tails = 0;
    for (let i = 0; i < flips; i++) {
      if (Math.random() > 0.5) heads++; else tails++;
    }
    setResult({ heads, tails, total: flips });
  };

  return (
    <div className="space-y-6">
      <div><label className="block text-sm text-gray-700 mb-1">Number of Flips</label>
        <input type="number" value={flips} onChange={(e) => setFlips(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      <button onClick={flip} className="bg-yellow-600 text-white px-6 py-2 rounded">Flip Coins</button>
      {result && (
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white mt-6 text-center">
          <p className="text-3xl font-bold">Heads: {result.heads} | Tails: {result.tails}</p>
          <p className="text-sm mt-2">Heads: {((result.heads/result.total)*100).toFixed(1)}% | Tails: {((result.tails/result.total)*100).toFixed(1)}%</p>
        </div>
      )}
    </div>
  );
}
