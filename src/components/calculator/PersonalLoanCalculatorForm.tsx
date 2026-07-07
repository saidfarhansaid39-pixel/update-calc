'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function PersonalLoanCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [amount, setAmount] = useState<number>(10000);
  const [term, setTerm] = useState<number>(36);
  const [rate, setRate] = useState<number>(10);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const monthlyRate = rate / 100 / 12;
    const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    const total = payment * term;
    const interest = total - amount;
    setResult({ payment: Math.round(payment), total: Math.round(total), interest: Math.round(interest) });
  }, [amount, term, rate]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.loanAmount')}</label>
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.term')}</label>
          <input type="number" value={term} onChange={(e) => setTerm(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.interestRate')}</label>
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-indigo-100 text-sm">{t('results.monthlyPayment')}</p>
          <p className="text-4xl font-bold">${result.payment.toLocaleString()}</p>
          <div className="mt-4 text-sm"><p>Total: ${result.total.toLocaleString()} | Interest: ${result.interest.toLocaleString()}</p></div>
        </div>
      )}
    </div>
  );
}