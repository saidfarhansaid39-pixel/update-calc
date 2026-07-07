'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function VolumeCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [shape, setShape] = useState<string>('cube');
  const [result, setResult] = useState<any>(null);
  const [inputs, setInputs] = useState<any>({});

  const calculate = () => {
    let volume = 0;
    let surfaceArea = 0;
    
    switch(shape) {
      case 'cube':
        volume = inputs.side ** 3;
        surfaceArea = 6 * (inputs.side ** 2);
        break;
      case 'sphere':
        volume = (4/3) * Math.PI * (inputs.radius ** 3);
        surfaceArea = 4 * Math.PI * (inputs.radius ** 2);
        break;
      case 'cylinder':
        volume = Math.PI * (inputs.radius ** 2) * inputs.height;
        surfaceArea = 2 * Math.PI * inputs.radius * (inputs.radius + inputs.height);
        break;
      case 'cone':
        volume = (1/3) * Math.PI * (inputs.radius ** 2) * inputs.height;
        const slantHeight = Math.sqrt((inputs.radius ** 2) + (inputs.height ** 2));
        surfaceArea = Math.PI * inputs.radius * (inputs.radius + slantHeight);
        break;
      case 'rectangular':
        volume = inputs.length * inputs.width * inputs.height;
        surfaceArea = 2 * (inputs.length*inputs.width + inputs.width*inputs.height + inputs.length*inputs.height);
        break;
    }
    
    setResult({ volume: volume.toFixed(2), surfaceArea: surfaceArea.toFixed(2) });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {['cube', 'sphere', 'cylinder', 'cone', 'rectangular'].map(s => (
          <button key={s} onClick={() => { setShape(s); setResult(null); setInputs({}); }} 
            className={`px-4 py-2 rounded capitalize ${shape === s ? 'bg-green-button text-white' : 'bg-gray-200'}`}>
            {s === 'rectangular' ? 'Rectangular Prism' : s}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {shape === 'cube' && <div><label className="block text-sm text-gray-700 mb-1">Side</label>
          <input type="number" onChange={(e) => setInputs({...inputs, side: Number(e.target.value)})} className="w-full p-2 border rounded" /></div>}
        {shape === 'sphere' && <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.radius')}</label>
          <input type="number" onChange={(e) => setInputs({...inputs, radius: Number(e.target.value)})} className="w-full p-2 border rounded" /></div>}
        {shape === 'cylinder' && (<>
          <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.radius')}</label>
            <input type="number" onChange={(e) => setInputs({...inputs, radius: Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
          <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.height_dim')}</label>
            <input type="number" onChange={(e) => setInputs({...inputs, height: Number(e.target.value)})} className="w-full p-2 border rounded" /></div></>)}
        {shape === 'cone' && (<>
          <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.radius')}</label>
            <input type="number" onChange={(e) => setInputs({...inputs, radius: Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
          <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.height_dim')}</label>
            <input type="number" onChange={(e) => setInputs({...inputs, height: Number(e.target.value)})} className="w-full p-2 border rounded" /></div></>)}
        {shape === 'rectangular' && (<>
          <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.length')}</label>
            <input type="number" onChange={(e) => setInputs({...inputs, length: Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
          <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.width')}</label>
            <input type="number" onChange={(e) => setInputs({...inputs, width: Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
          <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.height_dim')}</label>
            <input type="number" onChange={(e) => setInputs({...inputs, height: Number(e.target.value)})} className="w-full p-2 border rounded" /></div></>)}
      </div>

      <button onClick={calculate} className="bg-green-button text-white px-6 py-2 rounded font-medium">{t('buttons.calculate')}</button>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded grid md:grid-cols-2 gap-4">
          <div><p className="text-sm text-gray-600">{t('formLabels.volume')}</p><p className="text-2xl font-bold text-green-700">{result.volume} cubic units</p></div>
          <div><p className="text-sm text-gray-600">Surface Area</p><p className="text-2xl font-bold text-gray-700">{result.surfaceArea} sq units</p></div>
        </div>
      )}
    </div>
  );
}