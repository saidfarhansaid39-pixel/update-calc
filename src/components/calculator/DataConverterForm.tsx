'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function DataConverterForm() {
  const t = useTranslations('calculatorUI');
  const [value, setValue] = useState<number>(1);
  const [from, setFrom] = useState<string>('GB');
  const [to, setTo] = useState<string>('MB');
  const [result, setResult] = useState<any>(null);

  const conversions: any = { B: 1, KB: 1024, MB: 1024**2, GB: 1024**3, TB: 1024**4, PB: 1024**5 };

  useEffect(() => {
    const res = (value * conversions[from]) / conversions[to];
    setResult(res.toFixed(2));
  }, [value, from, to]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Value</label>
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="B">Bytes</option><option value="KB">KB</option><option value="MB">MB</option><option value="GB">GB</option><option value="TB">TB</option>
          </select></div>
        <div><label className="block text-sm text-gray-700 mb-1">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="MB">MB</option><option value="GB">GB</option><option value="KB">KB</option><option value="B">Bytes</option><option value="TB">TB</option>
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
