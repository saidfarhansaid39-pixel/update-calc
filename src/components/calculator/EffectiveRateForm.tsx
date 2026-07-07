'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function EffectiveRateForm() {
  const t = useTranslations('calculatorUI');
  const [nominal, setNominal] = useState<number>(12);
  const [compounds, setCompounds] = useState<number>(12);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const effective = (Math.pow(1 + nominal/100/compounds, compounds) - 1) * 100;
    setResult({ effective: effective.toFixed(2), nominal: nominal });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Nominal Rate (%)</label>
          <input type="number" value={nominal} onChange={(e) => setNominal(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Compounding/Year</label>
          <input type="number" value={compounds} onChange={(e) => setCompounds(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-green-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">{result.effective}%</p>
          <p className="text-sm mt-2">Effective Annual Rate</p>
        </div>
      )}
    </div>
  );
}