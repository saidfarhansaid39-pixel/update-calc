'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function PresentValueForm() {
  const t = useTranslations('calculatorUI');
  const [futureValue, setFutureValue] = useState<number>(10000);
  const [rate, setRate] = useState<number>(5);
  const [years, setYears] = useState<number>(10);
  const [compound, setCompound] = useState<number>(12);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const pv = futureValue / Math.pow(1 + (rate/100)/compound, compound * years);
    const totalValue = futureValue;
    const interestSaved = futureValue - pv;
    setResult({ presentValue: pv, totalValue, interestSaved });
  }, [futureValue, rate, years, compound]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Future Value ($)</label>
          <input type="number" value={futureValue} onChange={(e) => setFutureValue(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.rate')}</label>
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Years</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Compound</label>
          <select value={compound} onChange={(e) => setCompound(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded">
            <option value="1">Annually</option>
            <option value="2">Semiannually</option>
            <option value="4">Quarterly</option>
            <option value="12">Monthly</option>
            <option value="365">Daily</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium text-gray-700">Present Value</td>
                <td className="py-2 text-right text-green-700 font-bold text-xl">${result.presentValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-600">Interest Saved</td>
                <td className="py-2 text-right text-gray-700">${result.interestSaved.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}