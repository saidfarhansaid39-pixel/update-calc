'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function CookingConverterForm() {
  const t = useTranslations('calculatorUI');
  const [value, setValue] = useState<number>(1);
  const [from, setFrom] = useState<string>('cup');
  const [to, setTo] = useState<string>('ml');
  const [result, setResult] = useState<any>(null);

  const conversions: any = {
    cup: 236.588, ml: 1, tbsp: 14.787, tsp: 4.929, oz: 29.574, lb: 453.592, g: 1, kg: 1000
  };

  useEffect(() => {
    const fromVal = conversions[from] || 1;
    const toVal = conversions[to] || 1;
    const res = (value * fromVal) / toVal;
    setResult(res.toFixed(2));
  }, [value, from, to]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Value</label>
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="cup">Cup</option><option value="ml">ml</option><option value="tbsp">Tbsp</option>
            <option value="tsp">Tsp</option><option value="oz">oz</option><option value="g">g</option>
          </select></div>
        <div><label className="block text-sm text-gray-700 mb-1">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="ml">ml</option><option value="cup">Cup</option><option value="tbsp">Tbsp</option>
            <option value="tsp">Tsp</option><option value="oz">oz</option><option value="g">g</option>
          </select></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white mt-6 text-center">
          <p className="text-4xl font-bold">{result} {to}</p>
        </div>
      )}
    </div>
  );
}
