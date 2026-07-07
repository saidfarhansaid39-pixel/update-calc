'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ElectricCurrentConverterForm() {
  const t = useTranslations('calculatorUI');
  const [value, setValue] = useState<number>(1);
  const [from, setFrom] = useState<string>('A');
  const [to, setTo] = useState<string>('mA');
  const [result, setResult] = useState<any>(null);

  const toA: any = { A: 1, mA: 0.001, uA: 0.000001, kA: 1000 };

  useEffect(() => {
    const a = value * toA[from];
    const res = a / toA[to];
    setResult(res.toFixed(4));
  }, [value, from, to]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Value</label>
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="A">Amperes</option><option value="mA">mA</option><option value="uA">µA</option><option value="kA">kA</option>
          </select></div>
        <div><label className="block text-sm text-gray-700 mb-1">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="mA">mA</option><option value="A">Amperes</option><option value="uA">µA</option><option value="kA">kA</option>
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
