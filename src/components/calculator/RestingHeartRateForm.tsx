'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function RestingHeartRateForm() {
  const t = useTranslations('calculatorUI');
  const [age, setAge] = useState<number>(30);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const normal = 72 - (age * 0.1);
    const min = Math.round(60);
    const max = Math.round(100);
    const athlete = Math.round(40 + (age * 0.2));
    setResult({ normal: Math.round(normal), range: `${min}-${max}`, athlete });
  };

  return (
    <div className="space-y-6">
      <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.age')}</label>
        <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      <button onClick={calculate} className="bg-red-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">Normal RHR: {result.normal} bpm</p>
          <p className="text-sm mt-2">Typical Range: {result.range} bpm | Athletes: {result.athlete}+ bpm</p>
        </div>
      )}
    </div>
  );
}