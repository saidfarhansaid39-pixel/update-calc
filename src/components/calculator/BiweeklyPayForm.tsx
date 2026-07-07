'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function BiweeklyPayForm() {
  const t = useTranslations('calculatorUI');
  const [hourly, setHourly] = useState<number>(25);
  const [hours, setHours] = useState<number>(80);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const biweekly = hourly * hours;
    const annual = biweekly * 26;
    const monthly = annual / 12;
    setResult({ biweekly: biweekly.toFixed(2), annual: annual.toFixed(2), monthly: monthly.toFixed(2) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Hourly Rate ($)</label>
          <input type="number" value={hourly} onChange={(e) => setHourly(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Hours per Pay Period</label>
          <input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-teal-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">Biweekly: ${result.biweekly}</p>
          <p className="text-sm mt-2">Annual: ${result.annual} | Monthly: ${result.monthly}</p>
        </div>
      )}
    </div>
  );
}
