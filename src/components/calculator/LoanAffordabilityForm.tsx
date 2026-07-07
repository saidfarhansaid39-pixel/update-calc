'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function LoanAffordabilityForm() {
  const t = useTranslations('calculatorUI');
  const [income, setIncome] = useState<number>(5000);
  const [expenses, setExpenses] = useState<number>(2000);
  const [rate, setRate] = useState<number>(6);
  const [years, setYears] = useState<number>(30);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const disposable = income - expenses;
    const maxPayment = disposable * 0.36;
    const r = rate / 100 / 12;
    const n = years * 12;
    const maxLoan = maxPayment * ((Math.pow(1+r,n)-1) / (r * Math.pow(1+r,n)));
    setResult({ payment: maxPayment.toFixed(0), loan: maxLoan.toFixed(0) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Monthly Income ($)</label>
          <input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Monthly Expenses ($)</label>
          <input type="number" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.rate')}</label>
          <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Years</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-blue-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">${Number(result.loan).toLocaleString()}</p>
          <p className="text-sm mt-2">Max Payment: ${result.payment}/mo</p>
        </div>
      )}
    </div>
  );
}