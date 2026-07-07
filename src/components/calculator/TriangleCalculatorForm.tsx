'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function TriangleCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [sideA, setSideA] = useState<number>(3);
  const [sideB, setSideB] = useState<number>(4);
  const [sideC, setSideC] = useState<number>(5);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const s = (sideA + sideB + sideC) / 2;
    const area = Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));
    const perimeter = sideA + sideB + sideC;
    
    let type = 'Scalene';
    if (sideA === sideB && sideB === sideC) type = 'Equilateral';
    else if (sideA === sideB || sideB === sideC || sideA === sideC) type = 'Isosceles';
    
    const angles = [
      Math.acos((sideA**2 + sideB**2 - sideC**2) / (2 * sideA * sideB)) * 180 / Math.PI,
      Math.acos((sideA**2 + sideC**2 - sideB**2) / (2 * sideA * sideC)) * 180 / Math.PI,
      Math.acos((sideB**2 + sideC**2 - sideA**2) / (2 * sideB * sideC)) * 180 / Math.PI
    ];
    
    if (area > 0 && area < Infinity) {
      setResult({ area: area.toFixed(2), perimeter, type, angles: angles.map(a => a.toFixed(1)) });
    } else {
      setResult({ error: 'Invalid triangle - sides do not form a valid triangle' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Side A</label>
          <input type="number" value={sideA} onChange={(e) => setSideA(Number(e.target.value))} className="w-full p-2 border rounded" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Side B</label>
          <input type="number" value={sideB} onChange={(e) => setSideB(Number(e.target.value))} className="w-full p-2 border rounded" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Side C</label>
          <input type="number" value={sideC} onChange={(e) => setSideC(Number(e.target.value))} className="w-full p-2 border rounded" /></div>
      </div>

      <button onClick={calculate} className="bg-green-button text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>

      {result && !result.error && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center"><p className="text-sm text-gray-500">Area</p><p className="text-2xl font-bold">{result.area} sq units</p></div>
            <div className="text-center"><p className="text-sm text-gray-500">Perimeter</p><p className="text-2xl font-bold">{result.perimeter}</p></div>
            <div className="text-center"><p className="text-sm text-gray-500">Type</p><p className="text-2xl font-bold">{result.type}</p></div>
          </div>
          <div className="mt-4 text-center"><p className="text-sm text-gray-500">Angles: {result.angles[0]}°, {result.angles[1]}°, {result.angles[2]}°</p></div>
        </div>
      )}
      {result?.error && <div className="mt-4 p-3 bg-red-100 rounded text-red-800">{result.error}</div>}
    </div>
  );
}