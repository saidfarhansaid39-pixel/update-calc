'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CreditCardPayoffForm() {
  const t = useTranslations('calculatorUI');
  const [balance, setBalance] = useState<number>(5000);
  const [rate, setRate] = useState<number>(18);
  const [payment, setPayment] = useState<number>(150);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const monthlyRate = rate / 100 / 12;
    let months = 0;
    let totalInterest = 0;
    let b = balance;
    while (b > 0 && months < 600) {
      const interest = b * monthlyRate;
      totalInterest += interest;
      b = b + interest - payment;
      months++;
    }
    setResult({ months, totalInterest: totalInterest.toFixed(2), payoffDate: new Date(Date.now() + months*30*24*60*60*1000).toLocaleDateString() });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Balance ($)</label>
          <input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">APR (%)</label>
          <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Monthly Payment ($)</label>
          <input type="number" value={payment} onChange={(e) => setPayment(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-purple-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">{result.months} months</p>
          <p className="text-sm mt-2">Total Interest: ${result.totalInterest} | Payoff: {result.payoffDate}</p>
        </div>
      )}
    </div>
  );
}
