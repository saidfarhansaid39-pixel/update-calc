'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function NetWorthForm() {
  const t = useTranslations('calculatorUI');
  const [assets, setAssets] = useState<number>(100000);
  const [liabilities, setLiabilities] = useState<number>(50000);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const net = assets - liabilities;
    setResult({ net, positive: net >= 0 });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Total Assets ($)</label>
          <input type="number" value={assets} onChange={(e) => setAssets(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Total Liabilities ($)</label>
          <input type="number" value={liabilities} onChange={(e) => setLiabilities(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-blue-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className={`rounded-2xl p-6 text-white mt-6 ${result.positive ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'}`}>
          <p className="text-4xl font-bold">${result.net.toLocaleString()}</p>
          <p className="text-sm mt-2">{result.positive ? 'Positive Net Worth' : 'Negative Net Worth'}</p>
        </div>
      )}
    </div>
  );
}