'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function HourlyWageForm() {
  const t = useTranslations('calculatorUI');
  const [annual, setAnnual] = useState<number>(50000);
  const [hours, setHours] = useState<number>(40);
  const [weeks, setWeeks] = useState<number>(50);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const hourly = annual / (hours * weeks);
    const monthly = annual / 12;
    const weekly = annual / 52;
    setResult({ hourly: hourly.toFixed(2), monthly: monthly.toFixed(2), weekly: weekly.toFixed(2) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.salary_annual')}</label>
          <input type="number" value={annual} onChange={(e) => setAnnual(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.hoursPerWeek')}</label>
          <input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Weeks/Year</label>
          <input type="number" value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-blue-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">${result.hourly}/hour</p>
          <p className="text-sm mt-2">Monthly: ${result.monthly} | Weekly: ${result.weekly}</p>
        </div>
      )}
    </div>
  );
}