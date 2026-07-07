'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function DensityConverterForm() {
  const t = useTranslations('calculatorUI');
  const [value, setValue] = useState<number>(1);
  const [from, setFrom] = useState<string>('gcm3');
  const [to, setTo] = useState<string>('kgm3');
  const [result, setResult] = useState<any>(null);

  const toKgm3: any = { gcm3: 1000, kgm3: 1, gml: 1000, lbft3: 16.0185, lbin3: 27679.9, kgin3: 1000000 };

  useEffect(() => {
    const kgm3 = value * toKgm3[from];
    const res = kgm3 / toKgm3[to];
    setResult(res.toFixed(4));
  }, [value, from, to]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Value</label>
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="gcm3">g/cm³</option><option value="kgm3">kg/m³</option><option value="gml">g/ml</option><option value="lbft3">lb/ft³</option>
          </select></div>
        <div><label className="block text-sm text-gray-700 mb-1">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="kgm3">kg/m³</option><option value="gcm3">g/cm³</option><option value="lbft3">lb/ft³</option><option value="gml">g/ml</option>
          </select></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-6 text-white mt-6 text-center">
          <p className="text-4xl font-bold">{result} {to}</p>
        </div>
      )}
    </div>
  );
}
