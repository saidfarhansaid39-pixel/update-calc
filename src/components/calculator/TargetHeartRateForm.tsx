'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function TargetHeartRateForm() {
  const t = useTranslations('calculatorUI');
  const [age, setAge] = useState<number>(30);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const maxHR = 220 - age;
    const zones = {
      veryLight: { min: Math.round(maxHR * 0.5), max: Math.round(maxHR * 0.6) },
      light: { min: Math.round(maxHR * 0.6), max: Math.round(maxHR * 0.7) },
      moderate: { min: Math.round(maxHR * 0.7), max: Math.round(maxHR * 0.8) },
      hard: { min: Math.round(maxHR * 0.8), max: Math.round(maxHR * 0.9) },
      maximum: { min: Math.round(maxHR * 0.9), max: maxHR }
    };
    setResult({ maxHR, ...zones });
  }, [age]);

  return (
    <div className="space-y-6">
      <div className="max-w-xs">
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Age</label>
        <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Target Heart Rate Zones</h3>
          <p className="text-sm text-gray-600 mb-4">Maximum Heart Rate: <strong>{result.maxHR} BPM</strong></p>
          <div className="space-y-2">
            {[
              { label: 'Very Light (50-60%)', range: `${result.veryLight.min}-${result.veryLight.max}`, color: 'bg-blue-100' },
              { label: 'Light (60-70%)', range: `${result.light.min}-${result.light.max}`, color: 'bg-green-100' },
              { label: 'Moderate (70-80%)', range: `${result.moderate.min}-${result.moderate.max}`, color: 'bg-yellow-100' },
              { label: 'Hard (80-90%)', range: `${result.hard.min}-${result.hard.max}`, color: 'bg-orange-100' },
              { label: 'Maximum (90-100%)', range: `${result.maximum.min}-${result.maximum.max}`, color: 'bg-red-100' }
            ].map(z => (
              <div key={z.label} className={`${z.color} p-3 rounded flex justify-between`}>
                <span className="font-medium">{z.label}</span>
                <span className="font-bold">{z.range} BPM</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
