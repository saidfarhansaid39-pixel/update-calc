'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ProteinIntakeForm() {
  const t = useTranslations('calculatorUI');
  const [weight, setWeight] = useState<number>(160);
  const [activity, setActivity] = useState<string>('moderate');
  const [goal, setGoal] = useState<string>('maintain');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    let multiplier = 0.8;
    if (activity === 'high') multiplier = 1.0;
    if (activity === 'low') multiplier = 0.6;
    if (goal === 'build') multiplier += 0.2;
    if (goal === 'lose') multiplier += 0.1;
    const grams = Math.round(weight * multiplier);
    const calories = grams * 4;
    setResult({ grams, calories });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.weight')}</label>
          <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.activityLevel')}</label>
          <select value={activity} onChange={(e) => setActivity(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="low">Low (sedentary)</option><option value="moderate">Moderate</option><option value="high">High (athlete)</option>
          </select></div>
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.healthGoal')}</label>
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="maintain">Maintain</option><option value="build">Build Muscle</option><option value="lose">Lose Weight</option>
          </select></div>
      </div>
      <button onClick={calculate} className="bg-orange-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">{result.grams}g protein</p>
          <p className="text-sm mt-2">{result.calories} calories from protein</p>
        </div>
      )}
    </div>
  );
}