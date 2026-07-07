'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function PressureConverterForm() {
  const t = useTranslations('calculatorUI');
  const [value, setValue] = useState<number>(1);
  const [from, setFrom] = useState<string>('atm');
  const [to, setTo] = useState<string>('bar');
  const [result, setResult] = useState<any>(null);

  const toPa: any = { atm: 101325, bar: 100000, Pa: 1, kPa: 1000, psi: 6894.76, mmHg: 133.322 };

  useEffect(() => {
    const pa = value * toPa[from];
    const res = pa / toPa[to];
    setResult(res.toFixed(4));
  }, [value, from, to]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Value</label>
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="atm">Atmosphere</option><option value="bar">Bar</option><option value="Pa">Pascal</option><option value="kPa">kPa</option><option value="psi">PSI</option><option value="mmHg">mmHg</option>
          </select></div>
        <div><label className="block text-sm text-gray-700 mb-1">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="bar">Bar</option><option value="atm">Atmosphere</option><option value="Pa">Pascal</option><option value="kPa">kPa</option><option value="psi">PSI</option><option value="mmHg">mmHg</option>
          </select></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white mt-6 text-center">
          <p className="text-4xl font-bold">{result} {to}</p>
        </div>
      )}
    </div>
  );
}
