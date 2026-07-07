'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { calculateRetirement } from '@/engines/finance/investment';

export default function RetirementCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentSavings, setCurrentSavings] = useState<number>(50000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [expectedReturn, setExpectedReturn] = useState<number>(7);
  const [monthlySpending, setMonthlySpending] = useState<number>(3000);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (retirementAge > currentAge) {
      const res = calculateRetirement(currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn, monthlySpending);
      setResult(res);
    }
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn, monthlySpending]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.age')}</label>
          <input
            type="number"
            value={currentAge}
            onChange={(e) => setCurrentAge(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            min="18"
            max="80"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Retirement Age</label>
          <input
            type="number"
            value={retirementAge}
            onChange={(e) => setRetirementAge(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            min="40"
            max="90"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Savings ($)</label>
          <input
            type="number"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Contribution ($)</label>
          <input
            type="number"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Annual Return (%)</label>
          <input
            type="number"
            step="0.5"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            min="1"
            max="15"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Desired Monthly Spending ($)</label>
          <input
            type="number"
            value={monthlySpending}
            onChange={(e) => setMonthlySpending(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            min="0"
          />
        </div>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <h3 className="font-bold text-lg text-gray-800">{t('sections.results')}</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-medium text-gray-600 mb-2">At Retirement</h4>
              <p className="text-2xl font-bold text-green-600">${result.totalAtRetirement.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-medium text-gray-600 mb-2">Monthly Income</h4>
              <p className="text-2xl font-bold text-green-600">${result.monthlyIncome.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-medium text-gray-600 mb-2">Funds Last</h4>
              <p className="text-2xl font-bold text-gray-700">{result.yearsLasts} years</p>
            </div>
          </div>
          {result.monthlyIncome < monthlySpending && (
            <div className="bg-red-50 p-3 rounded border border-red-200 text-red-800">
              Warning: Your projected monthly income is less than your desired spending. Consider increasing contributions or retiring later.
            </div>
          )}
        </div>
      )}
    </div>
  );
}