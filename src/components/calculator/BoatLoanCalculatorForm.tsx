'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function BoatLoanCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [price, setPrice] = useState<number>(35000);
  const [downPayment, setDownPayment] = useState<number>(7000);
  const [term, setTerm] = useState<number>(120);
  const [rate, setRate] = useState<number>(7.5);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const loan = price - downPayment;
    const monthlyRate = rate / 100 / 12;
    const payment = loan * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    setResult({ payment: Math.round(payment), loan: Math.round(loan), total: Math.round(payment * term), interest: Math.round(payment * term - loan) });
  }, [price, downPayment, term, rate]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Boat Price</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Down Payment</label>
          <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Term (months)</label>
          <input type="number" value={term} onChange={(e) => setTerm(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Interest Rate (%)</label>
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-cyan-100 text-sm">Monthly Payment</p>
          <p className="text-4xl font-bold">${result.payment.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
