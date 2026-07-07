'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function BraSizeForm() {
  const t = useTranslations('calculatorUI');
  const [band, setBand] = useState<number>(34);
  const [bust, setBust] = useState<number>(36);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const cup = Math.round((bust - band) / 2);
    let size = '';
    if (cup <= 0) size = 'AA';
    else if (cup === 1) size = 'A';
    else if (cup === 2) size = 'B';
    else if (cup === 3) size = 'C';
    else if (cup === 4) size = 'D';
    else if (cup === 5) size = 'DD';
    else size = 'DDD';
    setResult({ size, band, cup, difference: cup });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Under Bust (inches)</label>
          <input type="number" value={band} onChange={(e) => setBand(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Full Bust (inches)</label>
          <input type="number" value={bust} onChange={(e) => setBust(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-green-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl p-6 text-white mt-6 text-center">
          <p className="text-pink-100 text-sm">Your Bra Size</p>
          <p className="text-5xl font-bold">{result.band}{result.size}</p>
        </div>
      )}
    </div>
  );
}
