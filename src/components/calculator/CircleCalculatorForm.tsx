'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function CircleCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [radius, setRadius] = useState<number>(5);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const area = Math.PI * radius * radius;
    const circumference = 2 * Math.PI * radius;
    const diameter = radius * 2;
    setResult({ area: area.toFixed(2), circumference: circumference.toFixed(2), diameter: diameter.toFixed(2) });
  }, [radius]);

  return (
    <div className="space-y-6">
      <div><label className="block text-sm text-gray-700 mb-1">Radius</label>
        <input type="number" value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      {result && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">Area: {result.area}</p>
          <p className="text-lg mt-2">Circumference: {result.circumference} | Diameter: {result.diameter}</p>
        </div>
      )}
    </div>
  );
}
