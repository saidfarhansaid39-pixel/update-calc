'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function CompoundInterestForm() {
  const t = useTranslations('calculatorUI');
  const [initialInvestment, setInitialInvestment] = useState<number>(10000);
  const [annualContribution, setAnnualContribution] = useState<number>(1200);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(100);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [compoundFrequency, setCompoundFrequency] = useState<string>('monthly');
  const [years, setYears] = useState<number>(10);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [inflationRate, setInflationRate] = useState<number>(0);
  const [result, setResult] = useState<any>(null);

  const frequencies: Record<string, number> = {
    'annually': 1, 'semiannually': 2, 'quarterly': 4, 'monthly': 12,
    'semimonthly': 24, 'biweekly': 26, 'weekly': 52, 'daily': 365, 'continuously': -1
  };

  useEffect(() => {
    const n = frequencies[compoundFrequency];
    const r = interestRate / 100;
    const t = years;
    
    let endBalance: number;
    if (n === -1) {
      endBalance = (initialInvestment + annualContribution / r) * Math.exp(r * t);
    } else {
      const principalGrowth = initialInvestment * Math.pow(1 + r / n, n * t);
      const annualContribFuture = annualContribution * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
      const monthlyContribFuture = monthlyContribution * ((Math.pow(1 + r / (n * 12), n * 12 * t) - 1) / (r / (n * 12)));
      endBalance = principalGrowth + annualContribFuture + monthlyContribFuture;
    }
    
    const totalContributions = initialInvestment + (annualContribution * t) + (monthlyContribution * 12 * t);
    const totalInterest = endBalance - totalContributions;
    const afterTaxInterest = totalInterest * (1 - taxRate / 100);
    const afterTaxBalance = initialInvestment + totalContributions + afterTaxInterest;
    
    const realRate = ((1 + interestRate / 100) / (1 + inflationRate / 100)) - 1;
    const inflationAdjustedBalance = endBalance / Math.pow(1 + inflationRate / 100, t);
    
    const yearlyData = [];
    for (let year = 1; year <= t; year++) {
      let yearBalance: number;
      if (n === -1) {
        yearBalance = (initialInvestment + annualContribution / r) * Math.exp(r * year);
      } else {
        const pg = initialInvestment * Math.pow(1 + r / n, n * year);
        const acf = annualContribution * ((Math.pow(1 + r / n, n * year) - 1) / (r / n));
        const mcf = monthlyContribution * ((Math.pow(1 + r / (n * 12), n * 12 * year) - 1) / (r / (n * 12)));
        yearBalance = pg + acf + mcf;
      }
      const yearContributions = initialInvestment + (annualContribution * year) + (monthlyContribution * 12 * year);
      const yearInterest = yearBalance - yearContributions;
      yearlyData.push({ year, balance: Math.round(yearBalance), contributions: Math.round(yearContributions), interest: Math.round(yearInterest) });
    }
    
    setResult({
      endBalance: Math.round(endBalance),
      totalContributions: Math.round(totalContributions),
      totalInterest: Math.round(totalInterest),
      afterTaxBalance: Math.round(afterTaxBalance),
      inflationAdjustedBalance: Math.round(inflationAdjustedBalance),
      yearlyData
    });
  }, [initialInvestment, annualContribution, monthlyContribution, interestRate, compoundFrequency, years, taxRate, inflationRate]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Initial Investment ($)</label>
          <input type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-green-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Annual Contribution ($)</label>
          <input type="number" value={annualContribution} onChange={(e) => setAnnualContribution(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-green-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Contribution ($)</label>
          <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-green-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
          <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-green-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Compound</label>
          <select value={compoundFrequency} onChange={(e) => setCompoundFrequency(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-green-500">
            <option value="annually">annually</option>
            <option value="semiannually">semiannually</option>
            <option value="quarterly">quarterly</option>
            <option value="monthly">monthly</option>
            <option value="semimonthly">semimonthly</option>
            <option value="biweekly">biweekly</option>
            <option value="weekly">weekly</option>
            <option value="daily">daily</option>
            <option value="continuously">continuously</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Years to Invest</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-green-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
          <input type="number" step="0.1" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-green-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Inflation Rate (%)</label>
          <input type="number" step="0.1" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-green-500" />
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium text-gray-700">End Balance</td>
                  <td className="py-2 text-right text-green-700 font-bold text-xl">${result.endBalance.toLocaleString()}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Starting Amount</td>
                  <td className="py-2 text-right text-gray-700">${initialInvestment.toLocaleString()}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Total Contributions</td>
                  <td className="py-2 text-right text-gray-700">${result.totalContributions.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Total Interest</td>
                  <td className="py-2 text-right text-gray-700">${result.totalInterest.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {taxRate > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <p className="font-medium text-gray-700 mb-2">After Tax (at {taxRate}%): ${result.afterTaxBalance.toLocaleString()}</p>
            </div>
          )}

          {inflationRate > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <p className="font-medium text-gray-700">Inflation Adjusted (at {inflationRate}%): ${result.inflationAdjustedBalance.toLocaleString()}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <h4 className="font-bold text-gray-800 mb-3">Accumulation Schedule</h4>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Year</th>
                  <th className="border p-2 text-right">Total</th>
                  <th className="border p-2 text-right">Interest</th>
                  <th className="border p-2 text-right">Contributions</th>
                  <th className="border p-2 text-right">Starting Amount</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyData.filter((_: any, i: number) => i % Math.max(1, Math.floor(years / 10)) === 0 || i === years - 1).map((row: any) => (
                  <tr key={row.year}>
                    <td className="border p-2">{row.year}</td>
                    <td className="border p-2 text-right">${row.balance.toLocaleString()}</td>
                    <td className="border p-2 text-right">${row.interest.toLocaleString()}</td>
                    <td className="border p-2 text-right">${row.contributions.toLocaleString()}</td>
                    <td className="border p-2 text-right">${initialInvestment.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
