'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function CaloriesBurnedForm() {
  const t = useTranslations('calculatorUI');
  const [activity, setActivity] = useState<string>('running');
  const [weight, setWeight] = useState<number>(70);
  const [duration, setDuration] = useState<number>(60);
  const [result, setResult] = useState<number>(0);

  const metValues: Record<string, number> = {
    running: 9.8, walking: 3.8, cycling: 7.5, swimming: 8.0, 
    hiking: 6.0, tennis: 7.3, basketball: 8.0, soccer: 10.0,
    weightlifting: 3.5, yoga: 2.5, jumping_rope: 11.0
  };

  useEffect(() => {
    const met = metValues[activity];
    const calories = met * weight * (duration / 60);
    setResult(Math.round(calories));
  }, [activity, weight, duration]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
          <select value={activity} onChange={(e) => setActivity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded">
            {Object.keys(metValues).map(a => <option key={a} value={a}>{a.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
          </select>
        </div>
        <div>          <label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.weight')}</label>
          <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
          <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
      </div>

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded text-center">
        <p className="text-sm text-gray-600">Calories Burned</p>
        <p className="text-4xl font-bold text-green-600">{result}</p>
        <p className="text-sm text-gray-500">calories</p>
      </div>
    </div>
  );
}