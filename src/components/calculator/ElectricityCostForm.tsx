'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ElectricityCostForm() {
  const t = useTranslations('calculatorUI');
  const [watts, setWatts] = useState<number>(1000);
  const [hours, setHours] = useState<number>(1);
  const [rate, setRate] = useState<number>(0.12);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const kwh = (watts / 1000) * hours;
    const cost = kwh * rate;
    setResult({ kwh: kwh.toFixed(2), cost: cost.toFixed(2), monthly: (cost * 30).toFixed(2) });
  }, [watts, hours, rate]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Watts</label>
          <input type="number" value={watts} onChange={(e) => setWatts(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Hours/Day</label>
          <input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Rate ($/kWh)</label>
          <input type="number" step="0.01" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">${result.cost}</p>
          <p className="text-sm mt-2">{result.kwh} kWh | Monthly: ${result.monthly}</p>
        </div>
      )}
    </div>
  );
}
