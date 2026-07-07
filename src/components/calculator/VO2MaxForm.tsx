'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function VO2MaxForm() {
  const t = useTranslations('calculatorUI');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<string>('male');
  const [time, setTime] = useState<number>(12);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    let vo2 = 132.853 - (0.0769 * time * 60) - (0.3873 * age);
    if (gender === 'female') vo2 -= 6.818;
    vo2 = Math.max(vo2, 20);
    let rating = 'Poor';
    if (vo2 > 55) rating = 'Excellent';
    else if (vo2 > 47) rating = 'Good';
    else if (vo2 > 40) rating = 'Average';
    else if (vo2 > 30) rating = 'Below Average';
    setResult({ vo2: vo2.toFixed(1), rating });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.age')}</label>
          <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.gender')}</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
            <option value="male">{t('formLabels.male')}</option><option value="female">{t('formLabels.female')}</option>
          </select></div>
        <div><label className="block text-sm text-gray-700 mb-1">1.5 Mile Run Time (min)</label>
          <input type="number" value={time} onChange={(e) => setTime(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-red-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">{result.vo2} ml/kg/min</p>
          <p className="text-lg mt-2">Rating: {result.rating}</p>
        </div>
      )}
    </div>
  );
}