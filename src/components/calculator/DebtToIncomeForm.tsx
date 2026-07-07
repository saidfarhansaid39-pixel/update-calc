'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function DebtToIncomeForm() {
  const t = useTranslations('calculatorUI');
  const [income, setIncome] = useState<number>(5000);
  const [debts, setDebts] = useState<number>(500);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const dti = (debts / income) * 100;
    const frontEnd = (income * 0.28) / 100;
    const backEnd = (income * 0.36) / 100;
    const maxMortgage = income * 0.28;
    
    let status = 'Excellent';
    if (dti > 43) status = 'Poor';
    else if (dti > 36) status = 'Fair';
    else if (dti > 28) status = 'Good';
    
    setResult({ dti: dti.toFixed(1), status, frontEnd, backEnd, maxMortgage: Math.round(maxMortgage) });
  }, [income, debts]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Monthly Gross Income</label>
          <input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.monthlyDebt')}</label>
          <input type="number" value={debts} onChange={(e) => setDebts(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>

      {result && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-blue-100 text-sm">Debt-to-Income Ratio</p>
          <p className="text-4xl font-bold">{result.dti}%</p>
          <p className="text-xl mt-2">{result.status}</p>
          <div className="mt-4 text-sm">
            <p>Max mortgage payment: ${result.maxMortgage}/month</p>
          </div>
        </div>
      )}
    </div>
  );
}