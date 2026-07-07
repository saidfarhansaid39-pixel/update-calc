'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CarValueForm() {
  const t = useTranslations('calculatorUI');
  const [price, setPrice] = useState<number>(30000);
  const [years, setYears] = useState<number>(5);
  const [depreciation, setDepreciation] = useState<number>(15);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    let value = price;
    for (let i = 0; i < years; i++) {
      value -= value * (depreciation / 100);
    }
    setResult({ value: value.toFixed(0), totalDepreciation: (price - value).toFixed(0) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">New Car Price ($)</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Years Old</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Annual Depreciation (%)</label>
          <input type="number" value={depreciation} onChange={(e) => setDepreciation(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-blue-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">${Number(result.value).toLocaleString()}</p>
          <p className="text-sm mt-2">Total Depreciation: ${Number(result.totalDepreciation).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
