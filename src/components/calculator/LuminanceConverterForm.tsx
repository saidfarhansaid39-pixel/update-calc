'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function LuminanceConverterForm() {
  const t = useTranslations('calculatorUI');
  const [value, setValue] = useState<number>(1);
  const [from, setFrom] = useState<string>('cdm2');
  const [to, setTo] = useState<string>('fl');
  const [result, setResult] = useState<any>(null);

  const toCdm2: any = { cdm2: 1, fl: 0.31831, lambert: 10000, nit: 1, stilb: 10000 };

  useEffect(() => {
    const cdm2 = value * toCdm2[from];
    const res = cdm2 / toCdm2[to];
    setResult(res.toFixed(4));
  }, [value, from, to]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Value</label>
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="cdm2">cd/m² (nit)</option><option value="fl">footlambert</option><option value="lambert">Lambert</option>
          </select></div>
        <div><label className="block text-sm text-gray-700 mb-1">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="fl">footlambert</option><option value="cdm2">cd/m²</option><option value="lambert">Lambert</option>
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
