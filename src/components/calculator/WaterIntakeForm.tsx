'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function WaterIntakeForm() {
  const t = useTranslations('calculatorUI');
  const [weight, setWeight] = useState<number>(160);
  const [activity, setActivity] = useState<number>(30);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const base = weight * 0.5;
    const activityAdd = activity * 0.4;
    const total = base + activityAdd;
    const cups = total / 8;
    const bottles = total / 16.9;
    setResult({ total: total.toFixed(0), cups: cups.toFixed(1), bottles: bottles.toFixed(1) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.weight')}</label>
          <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Daily Activity (min)</label>
          <input type="number" value={activity} onChange={(e) => setActivity(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-cyan-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">{result.total} oz</p>
          <p className="text-sm mt-2">~{result.cups} cups | ~{result.bottles} bottles</p>
        </div>
      )}
    </div>
  );
}