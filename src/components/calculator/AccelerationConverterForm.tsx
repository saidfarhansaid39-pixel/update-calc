'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function AccelerationConverterForm() {
  const t = useTranslations('calculatorUI');
  const [value, setValue] = useState<number>(1);
  const [from, setFrom] = useState<string>('ms2');
  const [to, setTo] = useState<string>('g');
  const [result, setResult] = useState<any>(null);

  const toMs2: any = { ms2: 1, gs: 9.80665, fts2: 0.3048, mphs: 0.44704 };

  useEffect(() => {
    const ms2 = value * toMs2[from];
    const res = ms2 / toMs2[to];
    setResult(res.toFixed(4));
  }, [value, from, to]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Value</label>
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="ms2">m/s²</option><option value="gs">g-force</option><option value="fts2">ft/s²</option><option value="mphs">mph/s</option>
          </select></div>
        <div><label className="block text-sm text-gray-700 mb-1">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="gs">g-force</option><option value="ms2">m/s²</option><option value="fts2">ft/s²</option><option value="mphs">mph/s</option>
          </select></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white mt-6 text-center">
          <p className="text-4xl font-bold">{result} {to}</p>
        </div>
      )}
    </div>
  );
}
