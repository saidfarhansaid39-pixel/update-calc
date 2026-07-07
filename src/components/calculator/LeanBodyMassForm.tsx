'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function LeanBodyMassForm() {
  const t = useTranslations('calculatorUI');
  const [weight, setWeight] = useState<number>(80);
  const [bodyFat, setBodyFat] = useState<number>(20);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fatMass = weight * (bodyFat / 100);
    const leanMass = weight - fatMass;
    setResult({ leanMass: leanMass.toFixed(1), fatMass: fatMass.toFixed(1) });
  }, [weight, bodyFat]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.weight')}</label>
          <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.bodyFat')}</label>
          <input type="number" value={bodyFat} onChange={(e) => setBodyFat(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">Lean Mass: {result.leanMass} kg</p>
          <p className="text-sm mt-2">Fat Mass: {result.fatMass} kg</p>
        </div>
      )}
    </div>
  );
}