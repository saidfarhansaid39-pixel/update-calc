'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ViscosityConverterForm() {
  const t = useTranslations('calculatorUI');
  const [value, setValue] = useState<number>(1);
  const [from, setFrom] = useState<string>('cP');
  const [to, setTo] = useState<string>('Pa.s');
  const [result, setResult] = useState<any>(null);

  const toPas: any = { 'Pa.s': 1, cP: 0.001, 'mPa.s': 0.001 };

  useEffect(() => {
    const pas = value * toPas[from];
    const res = pas / toPas[to];
    setResult(res.toFixed(4));
  }, [value, from, to]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Value</label>
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="cP">Centipoise</option><option value="Pa.s">Pa·s</option><option value="mPa.s">mPa·s</option>
          </select></div>
        <div><label className="block text-sm text-gray-700 mb-1">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="Pa.s">Pa·s</option><option value="cP">Centipoise</option><option value="mPa.s">mPa·s</option>
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
