'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { calculateSavings } from '@/engines/finance/investment';

export default function SavingsCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [initialDeposit, setInitialDeposit] = useState<number>(5000);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(200);
  const [annualRate, setAnnualRate] = useState<number>(5);
  const [years, setYears] = useState<number>(10);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const res = calculateSavings(initialDeposit, monthlyDeposit, annualRate, years);
    setResult(res);
  }, [initialDeposit, monthlyDeposit, annualRate, years]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Initial Deposit ($)</label>
          <input
            type="number"
            value={initialDeposit}
            onChange={(e) => setInitialDeposit(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Deposit ($)</label>
          <input
            type="number"
            value={monthlyDeposit}
            onChange={(e) => setMonthlyDeposit(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.rate')}</label>
          <input
            type="number"
            step="0.1"
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Period (Years)</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            min="1"
          />
        </div>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <h3 className="font-bold text-lg text-gray-800">{t('sections.results')}</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-medium text-gray-600 mb-2">Total Savings</h4>
              <p className="text-2xl font-bold text-green-600">${result.futureValue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-medium text-gray-600 mb-2">Total Interest Earned</h4>
              <p className="text-2xl font-bold text-green-600">${result.totalInterest.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-medium text-gray-600 mb-2">Total Deposited</h4>
              <p className="text-2xl font-bold text-gray-700">${result.totalContributions.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}