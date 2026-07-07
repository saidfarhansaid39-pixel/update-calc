'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function LeaseCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [price, setPrice] = useState<number>(40000);
  const [downPayment, setDownPayment] = useState<number>(3000);
  const [tradeIn, setTradeIn] = useState<number>(0);
  const [months, setMonths] = useState<number>(36);
  const [rate, setRate] = useState<number>(5);
  const [residual, setResidual] = useState<number>(20);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const capCost = price - downPayment - tradeIn;
    const residualValue = price * (residual / 100);
    const depreciable = capCost - residualValue;
    const monthlyDepreciation = depreciable / months;
    const moneyFactor = rate / 100 / 2400;
    const monthlyInterest = (capCost + residualValue) * moneyFactor;
    const monthlyPayment = monthlyDepreciation + monthlyInterest;
    const totalLease = monthlyPayment * months + downPayment;
    
    setResult({
      monthlyPayment: Math.round(monthlyPayment),
      residualValue: Math.round(residualValue),
      totalLease: Math.round(totalLease),
      totalInterest: Math.round(monthlyInterest * months)
    });
  }, [price, downPayment, tradeIn, months, rate, residual]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Vehicle Price</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.downPayment')}</label>
          <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Lease Term (months)</label>
          <input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Money Factor (%)</label>
          <input type="number" step="0.01" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Residual Value (%)</label>
          <input type="number" value={residual} onChange={(e) => setResidual(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>

      {result && (
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-purple-100 text-sm">Monthly Lease Payment</p>
          <p className="text-4xl font-bold">${result.monthlyPayment.toLocaleString()}</p>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div><p className="text-purple-100">Residual Value</p><p className="font-bold">${result.residualValue.toLocaleString()}</p></div>
            <div><p className="text-purple-100">Total Lease Cost</p><p className="font-bold">${result.totalLease.toLocaleString()}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}