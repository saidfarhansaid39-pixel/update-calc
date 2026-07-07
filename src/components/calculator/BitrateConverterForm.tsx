'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function BitrateConverterForm() {
  const t = useTranslations('calculatorUI');
  const [value, setValue] = useState<number>(1);
  const [from, setFrom] = useState<string>('mbps');
  const [to, setTo] = useState<string>('kbps');
  const [result, setResult] = useState<any>(null);

  const toBps: any = { bps: 1, kbps: 1000, mbps: 1e6, gbps: 1e9, Bps: 8, KBps: 8000, MBps: 8e6, GBps: 8e9 };

  useEffect(() => {
    const bps = value * toBps[from];
    const res = bps / toBps[to];
    setResult(res.toFixed(2));
  }, [value, from, to]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Value</label>
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="mbps">Mbps</option><option value="kbps">Kbps</option><option value="gbps">Gbps</option><option value="MBps">MB/s</option>
          </select></div>
        <div><label className="block text-sm text-gray-700 mb-1">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="kbps">Kbps</option><option value="mbps">Mbps</option><option value="MBps">MB/s</option><option value="gbps">Gbps</option>
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
