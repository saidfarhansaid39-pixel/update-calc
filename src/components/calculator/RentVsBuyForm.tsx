'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function RentVsBuyForm() {
  const t = useTranslations('calculatorUI');
  const [rent, setRent] = useState<number>(2000);
  const [homePrice, setHomePrice] = useState<number>(350000);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const monthlyRent = rent * 12;
    const yearlyAppreciation = homePrice * 0.03;
    const maintenance = homePrice * 0.01;
    const taxes = homePrice * 0.012;
    const firstYear = maintenance + taxes;
    const rent5yr = monthlyRent * 5 * 1.03;
    const buy5yr = firstYear * 5 + homePrice - (homePrice * 1.03 * 1.03 * 1.03 * 1.03 * 1.03);
    setResult({ rent: rent5yr.toFixed(0), buy: Math.abs(buy5yr).toFixed(0), better: buy5yr < rent5yr ? 'Buy' : 'Rent' });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Monthly Rent ($)</label>
          <input type="number" value={rent} onChange={(e) => setRent(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.homePrice')}</label>
          <input type="number" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-blue-600 text-white px-6 py-2 rounded">Compare</button>
      {result && (
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">After 5 years: {result.better}</p>
          <p className="text-sm mt-2">Rent cost: ${result.rent} | Buy cost: ${result.buy}</p>
        </div>
      )}
    </div>
  );
}