'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ROICalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [initialInvestment, setInitialInvestment] = useState<number>(10000);
  const [finalValue, setFinalValue] = useState<number>(15000);
  const [years, setYears] = useState<number>(3);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const roi = ((finalValue - initialInvestment) / initialInvestment) * 100;
    const annualizedROI = (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100;
    const profit = finalValue - initialInvestment;
    setResult({ roi, annualizedROI, profit });
  }, [initialInvestment, finalValue, years]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Initial Investment ($)</label>
          <input type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Final Value ($)</label>
          <input type="number" value={finalValue} onChange={(e) => setFinalValue(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Investment Period (years)</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium text-gray-700">Total ROI</td>
                <td className="py-2 text-right text-green-700 font-bold text-xl">{result.roi.toFixed(2)}%</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-gray-600">Annualized ROI</td>
                <td className="py-2 text-right text-gray-700 font-bold text-lg">{result.annualizedROI.toFixed(2)}%</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-600">Total Profit</td>
                <td className="py-2 text-right text-gray-700 font-bold">${result.profit.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}