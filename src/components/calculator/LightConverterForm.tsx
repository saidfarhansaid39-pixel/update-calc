'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function LightConverterForm() {
  const t = useTranslations('calculatorUI');
  const [value, setValue] = useState<number>(1);
  const [from, setFrom] = useState<string>('c');
  const [to, setTo] = useState<string>('km');
  const [result, setResult] = useState<any>(null);

  const toMeters: any = { m: 1, km: 1000, mi: 1609.34, ly: 9.461e15, au: 1.496e11, ft: 0.3048, in: 0.0254 };

  useEffect(() => {
    const meters = value * toMeters[from];
    const res = meters / toMeters[to];
    setResult(res.toExponential(4));
  }, [value, from, to]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Value</label>
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="c">Speed of Light</option><option value="m">Meters</option><option value="km">km</option><option value="mi">Miles</option><option value="ly">Light Years</option>
          </select></div>
        <div><label className="block text-sm text-gray-700 mb-1">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="km">km</option><option value="mi">Miles</option><option value="m">Meters</option><option value="ly">Light Years</option>
          </select></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white mt-6 text-center">
          <p className="text-4xl font-bold">{result} {to}</p>
        </div>
      )}
    </div>
  );
}
