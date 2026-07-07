'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function AreaCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [shape, setShape] = useState<string>('rectangle');
  const [result, setResult] = useState<any>(null);
  const [inputs, setInputs] = useState<any>({});

  const calculate = () => {
    let area = 0;
    let perimeter = 0;
    
    switch(shape) {
      case 'rectangle':
        area = inputs.length * inputs.width;
        perimeter = 2 * (inputs.length + inputs.width);
        break;
      case 'square':
        area = inputs.side * inputs.side;
        perimeter = 4 * inputs.side;
        break;
      case 'circle':
        area = Math.PI * inputs.radius * inputs.radius;
        perimeter = 2 * Math.PI * inputs.radius;
        break;
      case 'triangle':
        const s = (inputs.a + inputs.b + inputs.c) / 2;
        area = Math.sqrt(s * (s - inputs.a) * (s - inputs.b) * (s - inputs.c));
        perimeter = inputs.a + inputs.b + inputs.c;
        break;
      case 'parallelogram':
        area = inputs.base * inputs.height;
        perimeter = 2 * (inputs.base + inputs.slantedSide);
        break;
    }
    
    setResult({ area: area.toFixed(2), perimeter: perimeter.toFixed(2), shape });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {['rectangle', 'square', 'circle', 'triangle', 'parallelogram'].map(s => (
          <button key={s} onClick={() => { setShape(s); setResult(null); setInputs({}); }} 
            className={`px-4 py-2 rounded capitalize ${shape === s ? 'bg-green-button text-white' : 'bg-gray-200'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {shape === 'rectangle' && (
          <>
            <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.length')}</label>
              <input type="number" onChange={(e) => setInputs({...inputs, length: Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.width')}</label>
              <input type="number" onChange={(e) => setInputs({...inputs, width: Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
          </>
        )}
        {shape === 'square' && (
          <div><label className="block text-sm text-gray-700 mb-1">Side</label>
            <input type="number" onChange={(e) => setInputs({...inputs, side: Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
        )}
        {shape === 'circle' && (
          <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.radius')}</label>
            <input type="number" onChange={(e) => setInputs({...inputs, radius: Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
        )}
        {shape === 'triangle' && (
          <>
            <div><label className="block text-sm text-gray-700 mb-1">Side A</label>
              <input type="number" onChange={(e) => setInputs({...inputs, a: Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm text-gray-700 mb-1">Side B</label>
              <input type="number" onChange={(e) => setInputs({...inputs, b: Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm text-gray-700 mb-1">Side C</label>
              <input type="number" onChange={(e) => setInputs({...inputs, c: Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
          </>
        )}
        {shape === 'parallelogram' && (
          <>
            <div><label className="block text-sm text-gray-700 mb-1">Base</label>
              <input type="number" onChange={(e) => setInputs({...inputs, base: Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.height_dim')}</label>
              <input type="number" onChange={(e) => setInputs({...inputs, height: Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm text-gray-700 mb-1">Slanted Side</label>
              <input type="number" onChange={(e) => setInputs({...inputs, slantedSide: Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
          </>
        )}
      </div>

      <button onClick={calculate} className="bg-green-button text-white px-6 py-2 rounded font-medium">{t('buttons.calculate')}</button>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded grid md:grid-cols-2 gap-4">
          <div><p className="text-sm text-gray-600">{t('formLabels.area')}</p><p className="text-2xl font-bold text-green-700">{result.area} sq units</p></div>
          <div><p className="text-sm text-gray-600">Perimeter</p><p className="text-2xl font-bold text-gray-700">{result.perimeter} units</p></div>
        </div>
      )}
    </div>
  );
}