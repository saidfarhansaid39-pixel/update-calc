'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function StepCounterForm() {
  const t = useTranslations('calculatorUI');
  const [steps, setSteps] = useState<number>(10000);
  const [weight, setWeight] = useState<number>(160);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const miles = steps / 2000;
    const calories = steps * 0.04 * (weight / 160);
    const km = miles * 1.60934;
    setResult({ miles: miles.toFixed(2), km: km.toFixed(2), calories: Math.round(calories) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Steps</label>
          <input type="number" value={steps} onChange={(e) => setSteps(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.weight')}</label>
          <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-green-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">{result.miles} miles</p>
          <p className="text-sm mt-2">{result.km} km | {result.calories} calories</p>
        </div>
      )}
    </div>
  );
}