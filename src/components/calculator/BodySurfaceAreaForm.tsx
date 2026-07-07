'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function BodySurfaceAreaForm() {
  const t = useTranslations('calculatorUI');
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const bsa = 0.007184 * Math.pow(weight, 0.425) * Math.pow(height, 0.725);
    setResult({ bsa: bsa.toFixed(2), duBois: bsa.toFixed(2) });
  }, [weight, height]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.weight')}</label>
          <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.height')}</label>
          <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">{result.bsa} m²</p>
          <p className="text-sm mt-2">Body Surface Area (DuBois)</p>
        </div>
      )}
    </div>
  );
}