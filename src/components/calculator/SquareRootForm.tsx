'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function SquareRootForm() {
  const t = useTranslations('calculatorUI');
  const [number, setNumber] = useState<number>(144);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const sqrt = Math.sqrt(number);
    const isPerfect = Number.isInteger(sqrt);
    const cube = Math.cbrt(number);
    const isPerfectCube = Number.isInteger(cube);
    setResult({ sqrt: sqrt.toFixed(6), perfect: isPerfect, cube: cube.toFixed(6), perfectCube: isPerfectCube });
  };

  return (
    <div className="space-y-6">
      <div><label className="block text-sm text-gray-700 mb-1">Enter Number</label>
        <input type="number" value={number} onChange={(e) => setNumber(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      <button onClick={calculate} className="bg-green-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">√{number} = {result.sqrt}</p>
          <p className="text-sm mt-2">{result.perfect ? 'Perfect Square' : 'Not a Perfect Square'}</p>
          <p className="text-2xl mt-4">∛{number} = {result.cube}</p>
        </div>
      )}
    </div>
  );
}