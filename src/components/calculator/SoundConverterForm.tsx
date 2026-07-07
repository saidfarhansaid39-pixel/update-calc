'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function SoundConverterForm() {
  const t = useTranslations('calculatorUI');
  const [value, setValue] = useState<number>(1);
  const [from, setFrom] = useState<string>('mach');
  const [to, setTo] = useState<string>('mph');
  const [result, setResult] = useState<any>(null);

  const toMps: any = { mach: 343, mph: 0.44704, kph: 0.277778, mps: 1, fps: 0.3048 };

  useEffect(() => {
    const mps = value * toMps[from];
    const res = mps / toMps[to];
    setResult(res.toFixed(2));
  }, [value, from, to]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Value</label>
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="mach">Mach</option><option value="mph">MPH</option><option value="kph">km/h</option><option value="mps">m/s</option><option value="fps">ft/s</option>
          </select></div>
        <div><label className="block text-sm text-gray-700 mb-1">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="mph">MPH</option><option value="mach">Mach</option><option value="kph">km/h</option><option value="mps">m/s</option>
          </select></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white mt-6 text-center">
          <p className="text-4xl font-bold">{result} {to}</p>
        </div>
      )}
    </div>
  );
}
