'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function WeeklyPayForm() {
  const t = useTranslations('calculatorUI');
  const [annual, setAnnual] = useState<number>(50000);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const weekly = annual / 52;
    const biweekly = weekly * 2;
    const semimonthly = annual / 24;
    const monthly = annual / 12;
    setResult({ weekly: weekly.toFixed(2), biweekly: biweekly.toFixed(2), semimonthly: semimonthly.toFixed(2), monthly: monthly.toFixed(2) });
  };

  return (
    <div className="space-y-6">
      <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.salary_annual')}</label>
        <input type="number" value={annual} onChange={(e) => setAnnual(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      <button onClick={calculate} className="bg-purple-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">Weekly: ${result.weekly}</p>
          <p className="text-sm mt-2">Biweekly: ${result.biweekly} | Semi-monthly: ${result.semimonthly} | Monthly: ${result.monthly}</p>
        </div>
      )}
    </div>
  );
}