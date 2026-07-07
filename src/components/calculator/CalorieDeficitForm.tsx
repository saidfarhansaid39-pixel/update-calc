'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CalorieDeficitForm() {
  const t = useTranslations('calculatorUI');
  const [currentWeight, setCurrentWeight] = useState<number>(180);
  const [goalWeight, setGoalWeight] = useState<number>(160);
  const [calories, setCalories] = useState<number>(2000);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const weightDiff = currentWeight - goalWeight;
    const caloriesPerLb = 3500;
    const totalCalories = weightDiff * caloriesPerLb;
    const dailyDeficit = calories - 2000;
    const days = dailyDeficit > 0 ? Math.ceil(totalCalories / dailyDeficit) : 0;
    const weeks = (days / 7).toFixed(1);
    setResult({ days, weeks, totalCalories: totalCalories.toLocaleString() });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Current Weight (lbs)</label>
          <input type="number" value={currentWeight} onChange={(e) => setCurrentWeight(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Goal Weight (lbs)</label>
          <input type="number" value={goalWeight} onChange={(e) => setGoalWeight(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Daily Calorie Intake</label>
          <input type="number" value={calories} onChange={(e) => setCalories(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-orange-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">{result.weeks} weeks</p>
          <p className="text-sm mt-2">{result.days} days to reach goal</p>
        </div>
      )}
    </div>
  );
}