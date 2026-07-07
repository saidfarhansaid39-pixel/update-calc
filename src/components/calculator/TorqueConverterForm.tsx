'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function TorqueConverterForm() {
  const t = useTranslations('calculatorUI');
  const [value, setValue] = useState<number>(1);
  const [from, setFrom] = useState<string>('nm');
  const [to, setTo] = useState<string>('ftlb');
  const [result, setResult] = useState<any>(null);

  const toNm: any = { nm: 1, kgm: 9.80665, ftlb: 1.35582, inlb: 0.112984, lbfft: 1.35582, dynecm: 1e-7 };

  useEffect(() => {
    const nm = value * toNm[from];
    const res = nm / toNm[to];
    setResult(res.toFixed(4));
  }, [value, from, to]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Value</label>
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="nm">Newton-meters</option><option value="kgm">kg·m</option><option value="ftlb">ft·lb</option><option value="inlb">in·lb</option>
          </select></div>
        <div><label className="block text-sm text-gray-700 mb-1">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="ftlb">ft·lb</option><option value="nm">Newton-meters</option><option value="kgm">kg·m</option><option value="inlb">in·lb</option>
          </select></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white mt-6 text-center">
          <p className="text-4xl font-bold">{result} {to}</p>
        </div>
      )}
    </div>
  );
}
