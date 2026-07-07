'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function AnnualIncomeForm() {
  const t = useTranslations('calculatorUI');
  const [hourly, setHourly] = useState<number>(25);
  const [hours, setHours] = useState<number>(40);
  const [weeks, setWeeks] = useState<number>(50);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const annual = hourly * hours * weeks;
    const monthly = annual / 12;
    const biweekly = annual / 26;
    const weekly = annual / 52;
    setResult({ annual: annual.toLocaleString(), monthly: monthly.toLocaleString(), biweekly: biweekly.toLocaleString(), weekly: weekly.toLocaleString() });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Hourly Rate ($)</label>
          <input type="number" value={hourly} onChange={(e) => setHourly(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Hours/Week</label>
          <input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Weeks/Year</label>
          <input type="number" value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-green-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">${result.annual}/year</p>
          <p className="text-sm mt-2">Monthly: ${result.monthly} | Biweekly: ${result.biweekly} | Weekly: ${result.weekly}</p>
        </div>
      )}
    </div>
  );
}
