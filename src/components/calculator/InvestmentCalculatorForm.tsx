'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { calculateInvestment, calculateCompoundInterest, calculateSimpleInterest } from '@/engines/finance/investment';

export default function InvestmentCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [calcType, setCalcType] = useState<'investment' | 'compound' | 'simple'>('investment');
  
  const [initialAmount, setInitialAmount] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [annualRate, setAnnualRate] = useState<number>(7);
  const [years, setYears] = useState<number>(20);
  
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (calcType === 'investment') {
      const res = calculateInvestment(initialAmount, monthlyContribution, annualRate, years);
      setResult(res);
    } else if (calcType === 'compound') {
      const res = calculateCompoundInterest(initialAmount, annualRate, years);
      setResult(res);
    } else {
      const res = calculateSimpleInterest(initialAmount, annualRate, years);
      setResult({ amount: res, totalInterest: res - initialAmount });
    }
  }, [calcType, initialAmount, monthlyContribution, annualRate, years]);

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setCalcType('investment')}
          className={`px-4 py-2 rounded ${calcType === 'investment' ? 'bg-green-button text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Investment
        </button>
        <button
          onClick={() => setCalcType('compound')}
          className={`px-4 py-2 rounded ${calcType === 'compound' ? 'bg-green-button text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Compound Interest
        </button>
        <button
          onClick={() => setCalcType('simple')}
          className={`px-4 py-2 rounded ${calcType === 'simple' ? 'bg-green-button text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Simple Interest
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {calcType === 'investment' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Investment ($)</label>
            <input
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              min="0"
            />
          </div>
        )}
        {calcType !== 'simple' && (
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
        )}
        {calcType === 'simple' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.principal')}</label>
            <input
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              min="0"
            />
          </div>
        )}
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
              <h4 className="font-medium text-gray-600 mb-2">{calcType === 'simple' ? 'Final Amount' : 'Future Value'}</h4>
              <p className="text-2xl font-bold text-green-600">${result.futureValue?.toLocaleString() || result.amount?.toLocaleString()}</p>
            </div>
            
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-medium text-gray-600 mb-2">Total Interest</h4>
              <p className="text-2xl font-bold text-green-600">${result.totalInterest?.toLocaleString()}</p>
            </div>

            {calcType === 'investment' && (
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="font-medium text-gray-600 mb-2">Total Contributions</h4>
                <p className="text-2xl font-bold text-gray-700">${result.totalContributions?.toLocaleString()}</p>
              </div>
            )}
          </div>

          {calcType === 'investment' && result.yearlyBreakdown && result.yearlyBreakdown.length > 0 && (
            <div className="bg-white p-4 rounded shadow-sm overflow-x-auto">
              <h4 className="font-medium text-gray-600 mb-3">Yearly Breakdown</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Year</th>
                    <th className="text-right py-2">Value</th>
                    <th className="text-right py-2">Contributions</th>
                    <th className="text-right py-2">Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyBreakdown.filter((_: any, i: number) => i % 5 === 0 || i === result.yearlyBreakdown.length - 1).map((row: any) => (
                    <tr key={row.year} className="border-b">
                      <td className="py-2">{row.year}</td>
                      <td className="text-right">${row.value.toLocaleString()}</td>
                      <td className="text-right">${row.contributions.toLocaleString()}</td>
                      <td className="text-right">${row.interest.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}