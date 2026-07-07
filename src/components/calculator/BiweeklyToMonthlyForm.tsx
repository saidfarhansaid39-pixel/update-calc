'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function BiweeklyToMonthlyForm() {
  const t = useTranslations('calculatorUI');
  const [biweekly, setBiweekly] = useState<number>(2000);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const monthly = (biweekly * 26) / 12;
    setResult({ monthly: monthly.toFixed(2), annual: (biweekly * 26).toFixed(2) });
  };

  return (
    <div className="space-y-6">
      <div><label className="block text-sm text-gray-700 mb-1">Biweekly Income ($)</label>
        <input type="number" value={biweekly} onChange={(e) => setBiweekly(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      <button onClick={calculate} className="bg-purple-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">${result.monthly}/month</p>
          <p className="text-sm mt-2">Annual: ${Number(result.annual).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
