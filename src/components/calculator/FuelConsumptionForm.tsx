'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function FuelConsumptionForm() {
  const t = useTranslations('calculatorUI');
  const [distance, setDistance] = useState<number>(100);
  const [fuel, setFuel] = useState<number>(10);
  const [unit, setUnit] = useState<string>('mpg');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    if (unit === 'mpg') {
      const kmL = (distance / fuel) * 0.425144;
      const L100km = fuel ? (fuel / distance * 100) : 0;
      setResult({ mpg: (distance/fuel).toFixed(1), kmL: kmL.toFixed(1), L100km: L100km.toFixed(1) });
    } else {
      const km = distance * 1.60934;
      const gal = fuel * 0.264172;
      const mpg = km/gal;
      setResult({ mpg: mpg.toFixed(1), kmL: (distance/fuel).toFixed(1), L100km: (fuel/distance*100).toFixed(1) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.distance')}</label>
          <input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Fuel Used</label>
          <input type="number" value={fuel} onChange={(e) => setFuel(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Unit</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="mpg">Miles/Gal</option><option value="kmL">km/L</option>
          </select></div>
      </div>
      <button onClick={calculate} className="bg-orange-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">MPG: {result.mpg}</p>
          <p className="text-sm mt-2">km/L: {result.kmL} | L/100km: {result.L100km}</p>
        </div>
      )}
    </div>
  );
}