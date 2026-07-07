'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function FuelCostCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [distance, setDistance] = useState<number>(100);
  const [mpg, setMpg] = useState<number>(25);
  const [price, setPrice] = useState<number>(3.50);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const gallons = distance / mpg;
    const cost = gallons * price;
    setResult({ gallons: gallons.toFixed(2), cost: cost.toFixed(2) });
  }, [distance, mpg, price]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Distance (miles)</label>
          <input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Fuel Efficiency (MPG)</label>
          <input type="number" value={mpg} onChange={(e) => setMpg(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Gas Price ($/gallon)</label>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded grid md:grid-cols-2 gap-4">
          <div><p className="text-sm text-gray-600">Gallons Needed</p><p className="text-2xl font-bold text-gray-700">{result.gallons}</p></div>
          <div><p className="text-sm text-gray-600">Fuel Cost</p><p className="text-2xl font-bold text-green-600">${result.cost}</p></div>
        </div>
      )}
    </div>
  );
}
