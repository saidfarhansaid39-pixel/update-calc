'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function RecoveryHeartRateForm() {
  const t = useTranslations('calculatorUI');
  const [maxHR, setMaxHR] = useState<number>(180);
  const [resting, setResting] = useState<number>(65);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const reserve = maxHR - resting;
    const zones = { z1: Math.round(resting + reserve * 0.5), z2: Math.round(resting + reserve * 0.6), z3: Math.round(resting + reserve * 0.7), z4: Math.round(resting + reserve * 0.8), z5: Math.round(resting + reserve * 0.9) };
    setResult({ zones, reserve });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Max Heart Rate</label>
          <input type="number" value={maxHR} onChange={(e) => setMaxHR(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Resting Heart Rate</label>
          <input type="number" value={resting} onChange={(e) => setResting(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-red-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="space-y-2 mt-6">
          {Object.entries(result.zones).map(([key, val]: any) => <div key={key} className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-3 text-white"><span className="font-bold">{key}: </span>{val} bpm</div>)}
        </div>
      )}
    </div>
  );
}
