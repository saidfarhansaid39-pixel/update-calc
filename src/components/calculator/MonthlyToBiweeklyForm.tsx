'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function MonthlyToBiweeklyForm() {
  const t = useTranslations('calculatorUI');
  const [monthly, setMonthly] = useState<number>(4000);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const biweekly = (monthly * 12) / 26;
    setResult({ biweekly: biweekly.toFixed(2), annual: (monthly * 12).toFixed(2) });
  };

  return (
    <div className="space-y-6">
      <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.salary_monthly')}</label>
        <input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      <button onClick={calculate} className="bg-blue-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">${result.biweekly}/biweekly</p>
          <p className="text-sm mt-2">Annual: ${Number(result.annual).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}