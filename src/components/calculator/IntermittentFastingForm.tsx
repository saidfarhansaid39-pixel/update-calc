'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function IntermittentFastingForm() {
  const t = useTranslations('calculatorUI');
  const [hours, setHours] = useState<number>(16);
  const [meals, setMeals] = useState<number>(2);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const eatingWindow = 24 - hours;
    const timeBetweenMeals = eatingWindow / (meals - 1 || 1);
    setResult({ eatingWindow: eatingWindow.toFixed(1), timeBetweenMeals: timeBetweenMeals.toFixed(1), fastingHours: hours });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Fasting Hours</label>
          <input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Meals per Day</label>
          <input type="number" value={meals} onChange={(e) => setMeals(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-green-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">{result.eatingWindow}h eating window</p>
          <p className="text-sm mt-2">{result.timeBetweenMeals}h between meals</p>
        </div>
      )}
    </div>
  );
}