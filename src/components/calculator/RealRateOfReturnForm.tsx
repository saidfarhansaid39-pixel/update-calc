'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function RealRateOfReturnForm() {
  const t = useTranslations('calculatorUI');
  const [investment, setInvestment] = useState<number>(10000);
  const [final, setFinal] = useState<number>(15000);
  const [years, setYears] = useState<number>(5);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const totalReturn = ((final - investment) / investment) * 100;
    const cagr = (Math.pow(final/investment, 1/years) - 1) * 100;
    setResult({ totalReturn: totalReturn.toFixed(1), cagr: cagr.toFixed(2) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Initial Investment ($)</label>
          <input type="number" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Final Value ($)</label>
          <input type="number" value={final} onChange={(e) => setFinal(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Years</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-blue-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">{result.cagr}% CAGR</p>
          <p className="text-sm mt-2">Total Return: {result.totalReturn}%</p>
        </div>
      )}
    </div>
  );
}