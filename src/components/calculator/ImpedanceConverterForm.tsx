'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ImpedanceConverterForm() {
  const t = useTranslations('calculatorUI');
  const [value, setValue] = useState<number>(1);
  const [from, setFrom] = useState<string>('ohm');
  const [to, setTo] = useState<string>('kohm');
  const [result, setResult] = useState<any>(null);

  const toOhm: any = { ohm: 1, kohm: 1000, mohm: 1000000, milliohm: 0.001 };

  useEffect(() => {
    const ohm = value * toOhm[from];
    const res = ohm / toOhm[to];
    setResult(res.toFixed(4));
  }, [value, from, to]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Value</label>
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="ohm">Ohms</option><option value="kohm">kΩ</option><option value="mohm">MΩ</option><option value="milliohm">mΩ</option>
          </select></div>
        <div><label className="block text-sm text-gray-700 mb-1">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="kohm">kΩ</option><option value="ohm">Ohms</option><option value="mohm">MΩ</option><option value="milliohm">mΩ</option>
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
