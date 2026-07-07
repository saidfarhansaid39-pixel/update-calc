'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function HeartRateZonesForm() {
  const t = useTranslations('calculatorUI');
  const [age, setAge] = useState<number>(30);
  const [maxHR, setMaxHR] = useState<number | null>(null);
  const [zones, setZones] = useState<any>(null);

  const calculate = () => {
    const max = maxHR || (220 - age);
    setZones({
      zone1: { min: Math.round(max * 0.5), max: Math.round(max * 0.6), name: 'Very Light', color: 'bg-blue-200' },
      zone2: { min: Math.round(max * 0.6), max: Math.round(max * 0.7), name: 'Light', color: 'bg-green-200' },
      zone3: { min: Math.round(max * 0.7), max: Math.round(max * 0.8), name: 'Moderate', color: 'bg-yellow-200' },
      zone4: { min: Math.round(max * 0.8), max: Math.round(max * 0.9), name: 'Hard', color: 'bg-orange-200' },
      zone5: { min: Math.round(max * 0.9), max: max, name: 'Maximum', color: 'bg-red-200' }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.age')}</label>
          <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Max Heart Rate (optional)</label>
          <input type="number" value={maxHR || ''} onChange={(e) => setMaxHR(e.target.value ? Number(e.target.value) : null)} className="w-full px-4 py-3 border rounded-lg" placeholder="Auto: 220-age" /></div>
      </div>
      <button onClick={calculate} className="bg-red-600 text-white px-6 py-2 rounded">Calculate Zones</button>
      {zones && (
        <div className="space-y-3 mt-6">
          {Object.entries(zones).map(([key, z]: any) => (
            <div key={key} className={`${z.color} p-4 rounded-lg`}>
              <p className="font-bold">{z.name} ({key})</p>
              <p>{z.min} - {z.max} BPM</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}