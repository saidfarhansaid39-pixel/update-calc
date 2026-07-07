'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function IRACalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [iraType, setIraType] = useState<'traditional' | 'roth'>('traditional');
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentBalance, setCurrentBalance] = useState<number>(10000);
  const [annualContribution, setAnnualContribution] = useState<number>(6000);
  const [expectedReturn, setExpectedReturn] = useState<number>(7);
  const [currentTaxRate, setCurrentTaxRate] = useState<number>(25);
  const [retirementTaxRate, setRetirementTaxRate] = useState<number>(20);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const years = retirementAge - currentAge;
    const rate = expectedReturn / 100;
    
    let futureValue = currentBalance * Math.pow(1 + rate, years);
    for (let i = 0; i < years; i++) {
      futureValue += annualContribution * Math.pow(1 + rate, years - i - 1);
    }
    futureValue = Math.round(futureValue);
    
    let annualContributionTotal = annualContribution * years;
    
    if (iraType === 'traditional') {
      const taxableAtEnd = futureValue;
      const afterTax = taxableAtEnd * (1 - retirementTaxRate / 100);
      const totalTax = taxableAtEnd - afterTax;
      setResult({
        futureValue,
        afterTaxValue: Math.round(afterTax),
        totalContributions: currentBalance + annualContributionTotal,
        totalEarnings: futureValue - currentBalance - annualContributionTotal,
        totalTaxes: Math.round(totalTax),
        monthlyIncome: Math.round((afterTax / 25) / 12)
      });
    } else {
      const afterTaxContributions = currentBalance + (annualContribution * (1 - currentTaxRate / 100) * years);
      const taxableAtEnd = futureValue - (currentBalance + annualContributionTotal) + (annualContribution * (1 - currentTaxRate / 100) * years);
      setResult({
        futureValue,
        afterTaxValue: futureValue,
        totalContributions: currentBalance + annualContributionTotal,
        totalEarnings: futureValue - currentBalance - annualContributionTotal,
        totalTaxes: Math.round(annualContribution * years * currentTaxRate / 100),
        monthlyIncome: Math.round((futureValue / 25) / 12),
        taxSavingsNow: Math.round(annualContribution * currentTaxRate / 100)
      });
    }
  }, [iraType, currentAge, retirementAge, currentBalance, annualContribution, expectedReturn, currentTaxRate, retirementTaxRate]);

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setIraType('traditional')}
          className={`px-4 py-2 rounded ${iraType === 'traditional' ? 'bg-green-button text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Traditional IRA
        </button>
        <button
          onClick={() => setIraType('roth')}
          className={`px-4 py-2 rounded ${iraType === 'roth' ? 'bg-green-button text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Roth IRA
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.age')}</label>
          <input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" min="18" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Retirement Age</label>
          <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" min="50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Balance ($)</label>
          <input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Annual Contribution ($)</label>
          <input type="number" value={annualContribution} onChange={(e) => setAnnualContribution(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" max="6500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Return (%)</label>
          <input type="number" step="0.5" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Tax Rate (%)</label>
          <input type="number" value={currentTaxRate} onChange={(e) => setCurrentTaxRate(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        {iraType === 'traditional' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Tax Rate at Retirement (%)</label>
            <input type="number" value={retirementTaxRate} onChange={(e) => setRetirementTaxRate(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
          </div>
        )}
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <h3 className="font-bold text-lg text-gray-800">Results at Age {retirementAge}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-medium text-gray-600 mb-2">IRA Balance</h4>
              <p className="text-2xl font-bold text-green-600">${result.futureValue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-medium text-gray-600 mb-2">After-Tax Value</h4>
              <p className="text-2xl font-bold text-green-600">${result.afterTaxValue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-medium text-gray-600 mb-2">Total Earnings</h4>
              <p className="text-2xl font-bold text-gray-700">${result.totalEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-medium text-gray-600 mb-2">Est. Monthly Income</h4>
              <p className="text-2xl font-bold text-gray-700">${result.monthlyIncome.toLocaleString()}</p>
            </div>
          </div>
          {iraType === 'roth' && result.taxSavingsNow > 0 && (
            <div className="bg-green-50 p-3 rounded border border-green-200 text-green-800">
              You save ${result.taxSavingsNow.toLocaleString()} in taxes annually by contributing to Roth IRA
            </div>
          )}
        </div>
      )}
    </div>
  );
}