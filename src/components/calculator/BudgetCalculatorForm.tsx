'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function BudgetCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [income, setIncome] = useState<number>(5000);
  const [housing, setHousing] = useState<number>(1500);
  const [utilities, setUtilities] = useState<number>(200);
  const [transportation, setTransportation] = useState<number>(400);
  const [food, setFood] = useState<number>(500);
  const [insurance, setInsurance] = useState<number>(200);
  const [healthcare, setHealthcare] = useState<number>(100);
  const [savings, setSavings] = useState<number>(500);
  const [entertainment, setEntertainment] = useState<number>(200);
  const [debt, setDebt] = useState<number>(300);
  const [other, setOther] = useState<number>(200);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const expenses = housing + utilities + transportation + food + insurance + healthcare + savings + entertainment + debt + other;
    const remaining = income - expenses;
    const savingsRate = (savings / income) * 100;
    const housingRatio = (housing / income) * 100;
    
    setResult({
      totalIncome: income,
      totalExpenses: expenses,
      remaining,
      savingsRate,
      housingRatio,
      breakdown: [
        { category: 'Housing', amount: housing, percentage: (housing/income)*100 },
        { category: 'Utilities', amount: utilities, percentage: (utilities/income)*100 },
        { category: 'Transportation', amount: transportation, percentage: (transportation/income)*100 },
        { category: 'Food', amount: food, percentage: (food/income)*100 },
        { category: 'Insurance', amount: insurance, percentage: (insurance/income)*100 },
        { category: 'Healthcare', amount: healthcare, percentage: (healthcare/income)*100 },
        { category: 'Savings', amount: savings, percentage: (savings/income)*100 },
        { category: 'Entertainment', amount: entertainment, percentage: (entertainment/income)*100 },
        { category: 'Debt', amount: debt, percentage: (debt/income)*100 },
        { category: 'Other', amount: other, percentage: (other/income)*100 },
      ].filter(x => x.amount > 0)
    });
  }, [income, housing, utilities, transportation, food, insurance, healthcare, savings, entertainment, debt, other]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-4 rounded border border-green-200">
          <label className="block text-sm font-bold text-green-800 mb-1">Monthly Income ($)</label>
          <input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full px-3 py-2 border border-green-300 rounded text-xl font-bold" />
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Housing (rent/mortgage)</label>
          <input type="number" value={housing} onChange={(e) => setHousing(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Utilities</label>
          <input type="number" value={utilities} onChange={(e) => setUtilities(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Transportation</label>
          <input type="number" value={transportation} onChange={(e) => setTransportation(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Food & Groceries</label>
          <input type="number" value={food} onChange={(e) => setFood(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Insurance</label>
          <input type="number" value={insurance} onChange={(e) => setInsurance(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Healthcare</label>
          <input type="number" value={healthcare} onChange={(e) => setHealthcare(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Savings</label>
          <input type="number" value={savings} onChange={(e) => setSavings(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Entertainment</label>
          <input type="number" value={entertainment} onChange={(e) => setEntertainment(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Debt Payments</label>
          <input type="number" value={debt} onChange={(e) => setDebt(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Other</label>
          <input type="number" value={other} onChange={(e) => setOther(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium text-gray-700">Monthly Income</td>
                  <td className="py-2 text-right text-green-700 font-bold">${result.totalIncome.toLocaleString()}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Total Expenses</td>
                  <td className="py-2 text-right text-gray-700">${result.totalExpenses.toLocaleString()}</td>
                </tr>
                <tr className={result.remaining >= 0 ? 'border-b bg-green-100' : 'border-b bg-red-100'}>
                  <td className="py-2 font-medium text-gray-700">Remaining</td>
                  <td className={`py-2 text-right font-bold ${result.remaining >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    ${result.remaining.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {result.remaining < 0 && (
            <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800">
              Warning: Your expenses exceed your income. Consider reducing expenses or increasing income.
            </div>
          )}

          <div className="bg-white border rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-right">% of Income</th>
                </tr>
              </thead>
              <tbody>
                {result.breakdown.map((item: any) => (
                  <tr key={item.category} className="border-t">
                    <td className="p-3">{item.category}</td>
                    <td className="p-3 text-right">${item.amount.toLocaleString()}</td>
                    <td className="p-3 text-right">{item.percentage.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className={`p-4 rounded border ${result.savingsRate >= 20 ? 'bg-green-100 border-green-300' : 'bg-yellow-100 border-yellow-300'}`}>
              <p className="text-sm text-gray-600">Savings Rate</p>
              <p className="text-2xl font-bold">{result.savingsRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">{result.savingsRate >= 20 ? 'Good - 20%+ recommended' : 'Aim for 20% savings'}</p>
            </div>
            <div className={`p-4 rounded border ${result.housingRatio <= 30 ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'}`}>
              <p className="text-sm text-gray-600">Housing Ratio</p>
              <p className="text-2xl font-bold">{result.housingRatio.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">{result.housingRatio <= 30 ? 'Good - under 30%' : 'High - aim for under 30%'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
