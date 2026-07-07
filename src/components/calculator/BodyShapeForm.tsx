'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function BodyShapeForm() {
  const t = useTranslations('calculatorUI');
  const [waist, setWaist] = useState<number>(32);
  const [hip, setHip] = useState<number>(38);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const ratio = waist / hip;
    let shape = 'Hourglass';
    if (ratio < 0.7) shape = 'Pear';
    else if (ratio > 0.9) shape = 'Apple';
    else if (ratio > 0.8) shape = 'Rectangle';
    setResult({ ratio: ratio.toFixed(2), shape });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.waist')}</label>
          <input type="number" value={waist} onChange={(e) => setWaist(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.hip')}</label>
          <input type="number" value={hip} onChange={(e) => setHip(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-pink-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">{result.shape}</p>
          <p className="text-sm mt-2">Waist-to-Hip Ratio: {result.ratio}</p>
        </div>
      )}
    </div>
  );
}