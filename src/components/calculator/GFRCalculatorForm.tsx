'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function GFRCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [age, setAge] = useState<number>(40);
  const [creatinine, setCreatinine] = useState<number>(1.0);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    let gfr = 175 * Math.pow(creatinine, -1.154) * Math.pow(age, -0.203);
    if (gender === 'female') gfr *= 0.742;
    
    let stage = 'Normal';
    if (gfr < 15) stage = 'Kidney Failure';
    else if (gfr < 30) stage = 'Severe';
    else if (gfr < 60) stage = 'Moderate';
    
    setResult({ gfr: Math.round(gfr), stage });
  }, [age, creatinine, gender]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.age')}</label>
          <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Serum Creatinine (mg/dL)</label>
          <input type="number" step="0.1" value={creatinine} onChange={(e) => setCreatinine(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.gender')}</label>
          <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="w-full px-4 py-3 border rounded-lg">
            <option value="male">{t('formLabels.male')}</option>
            <option value="female">{t('formLabels.female')}</option>
          </select></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">GFR: {result.gfr}</p>
          <p className="text-lg mt-2">Stage: {result.stage}</p>
        </div>
      )}
    </div>
  );
}