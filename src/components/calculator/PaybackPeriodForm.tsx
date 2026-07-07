'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function PaybackPeriodForm() {
  const t = useTranslations('calculatorUI');
  const [initialInvestment, setInitialInvestment] = useState<number>(10000);
  const [annualCashFlow, setAnnualCashFlow] = useState<number>(2000);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const payback = initialInvestment / annualCashFlow;
    const roi = ((annualCashFlow * 10 - initialInvestment) / initialInvestment) * 100;
    setResult({ payback: payback.toFixed(1), roi: roi.toFixed(1), totalReturn: annualCashFlow * 10 });
  }, [initialInvestment, annualCashFlow]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Initial Investment ($)</label>
          <input type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Annual Cash Flow ($)</label>
          <input type="number" value={annualCashFlow} onChange={(e) => setAnnualCashFlow(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-2xl font-bold">Payback Period: {result.payback} years</p>
          <p className="text-sm mt-2">ROI: {result.roi}% | 10yr Return: ${result.totalReturn.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}