'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function AngleConverterForm() {
  const t = useTranslations('calculatorUI');
  const [value, setValue] = useState<number>(90);
  const [from, setFrom] = useState<string>('deg');
  const [to, setTo] = useState<string>('rad');
  const [result, setResult] = useState<any>(null);

  const toRad = (v: number, f: string) => {
    if (f === 'deg') return v * Math.PI / 180;
    if (f === 'grad') return v * Math.PI / 200;
    return v;
  };

  useEffect(() => {
    const rad = toRad(value, from);
    let res = 0;
    if (to === 'deg') res = rad * 180 / Math.PI;
    else if (to === 'grad') res = rad * 200 / Math.PI;
    else res = rad;
    setResult(res.toFixed(4));
  }, [value, from, to]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Value</label>
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="deg">Degrees</option><option value="rad">Radians</option><option value="grad">Gradians</option>
          </select></div>
        <div><label className="block text-sm text-gray-700 mb-1">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="rad">Radians</option><option value="deg">Degrees</option><option value="grad">Gradians</option>
          </select></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white mt-6 text-center">
          <p className="text-4xl font-bold">{result} {to}</p>
        </div>
      )}
    </div>
  );
}
