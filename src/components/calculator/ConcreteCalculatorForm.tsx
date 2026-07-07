'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ConcreteCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(10);
  const [depth, setDepth] = useState<number>(4);
  const [price, setPrice] = useState<number>(150);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const cubicFeet = length * width * (depth / 12);
    const cubicYards = cubicFeet / 27;
    const bags60lb = cubicFeet / 0.45;
    const bags80lb = cubicFeet / 0.6;
    const totalCost = cubicYards * price;
    
    setResult({ cubicFeet: cubicFeet.toFixed(2), cubicYards: cubicYards.toFixed(2), bags60lb: Math.ceil(bags60lb), bags80lb: Math.ceil(bags80lb), totalCost: totalCost.toFixed(2) });
  }, [length, width, depth, price]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Length (feet)</label>
          <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Width (feet)</label>
          <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Depth (inches)</label>
          <input type="number" value={depth} onChange={(e) => setDepth(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Price per Cubic Yard ($)</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-bold text-lg text-gray-800 mb-3">Results</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded"><p className="text-sm text-gray-500">Cubic Feet</p><p className="text-xl font-bold">{result.cubicFeet}</p></div>
            <div className="bg-white p-3 rounded"><p className="text-sm text-gray-500">Cubic Yards</p><p className="text-xl font-bold">{result.cubicYards}</p></div>
            <div className="bg-white p-3 rounded"><p className="text-sm text-gray-500">60lb Bags Needed</p><p className="text-xl font-bold">{result.bags60lb}</p></div>
            <div className="bg-white p-3 rounded"><p className="text-sm text-gray-500">80lb Bags Needed</p><p className="text-xl font-bold">{result.bags80lb}</p></div>
            <div className="bg-white p-3 rounded col-span-2 lg:col-span-1"><p className="text-sm text-gray-500">Estimated Cost</p><p className="text-2xl font-bold text-green-600">${result.totalCost}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
