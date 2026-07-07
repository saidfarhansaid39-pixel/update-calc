'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function PythagoreanTheoremForm() {
  const t = useTranslations('calculatorUI');
  const [sideA, setSideA] = useState<number>(3);
  const [sideB, setSideB] = useState<number>(4);
  const [calculateC, setCalculateC] = useState<boolean>(true);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    if (calculateC) {
      const c = Math.sqrt(sideA**2 + sideB**2);
      setResult({ c: c.toFixed(2), formula: `√(${sideA}² + ${sideB}²) = ${c.toFixed(2)}` });
    } else {
      const a = Math.sqrt(sideB**2 - sideA**2);
      if (sideB <= sideA) {
        setResult({ error: 'Side B must be greater than Side A' });
      } else {
        setResult({ c: a.toFixed(2), formula: `√(${sideB}² - ${sideA}²) = ${a.toFixed(2)}` });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-4">
        <button onClick={() => { setCalculateC(true); setResult(null); }} className={`px-4 py-2 rounded ${calculateC ? 'bg-green-button text-white' : 'bg-gray-200'}`}>Find Hypotenuse (c)</button>
        <button onClick={() => { setCalculateC(false); setResult(null); }} className={`px-4 py-2 rounded ${!calculateC ? 'bg-green-button text-white' : 'bg-gray-200'}`}>Find Leg (a or b)</button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">{calculateC ? 'Leg A' : 'Leg A (known)'}</label>
          <input type="number" value={sideA} onChange={(e) => setSideA(Number(e.target.value))} className="w-full p-2 border rounded" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">{calculateC ? 'Leg B' : 'Hypotenuse'}</label>
          <input type="number" value={sideB} onChange={(e) => setSideB(Number(e.target.value))} className="w-full p-2 border rounded" /></div>
      </div>

      <button onClick={calculate} className="bg-green-button text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>

      {result && !result.error && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded text-center">
          <p className="text-4xl font-bold text-green-600">{result.c}</p>
          <p className="text-sm text-gray-500 mt-2">{result.formula}</p>
        </div>
      )}
      {result?.error && <div className="mt-4 p-3 bg-red-100 rounded text-red-800">{result.error}</div>}
    </div>
  );
}