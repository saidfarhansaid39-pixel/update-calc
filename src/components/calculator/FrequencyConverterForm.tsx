'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function FrequencyConverterForm() {
  const t = useTranslations('calculatorUI');
  const [value, setValue] = useState<number>(1);
  const [from, setFrom] = useState<string>('hz');
  const [to, setTo] = useState<string>('khz');
  const [result, setResult] = useState<any>(null);

  const toHz: any = { hz: 1, khz: 1000, mhz: 1e6, ghz: 1e9, rpm: 1/60, thz: 1e12 };

  useEffect(() => {
    const hz = value * toHz[from];
    const res = hz / toHz[to];
    setResult(res.toFixed(4));
  }, [value, from, to]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Value</label>
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="hz">Hz</option><option value="khz">kHz</option><option value="mhz">MHz</option><option value="ghz">GHz</option><option value="rpm">RPM</option>
          </select></div>
        <div><label className="block text-sm text-gray-700 mb-1">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="khz">kHz</option><option value="hz">Hz</option><option value="mhz">MHz</option><option value="ghz">GHz</option>
          </select></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white mt-6 text-center">
          <p className="text-4xl font-bold">{result} {to}</p>
        </div>
      )}
    </div>
  );
}
