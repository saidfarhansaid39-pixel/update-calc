'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function OhmLawForm() {
  const t = useTranslations('calculatorUI');
  const [voltage, setVoltage] = useState<number>(120);
  const [resistance, setResistance] = useState<number>(10);
  const [result, setResult] = useState<any>(null);

  const calculate = (v: number, r: number, i: number) => {
    if (v && r) return { current: (v/r).toFixed(2), voltage: v, resistance: r };
    if (v && i) return { voltage: (i*r).toFixed(2), current: i, resistance: r };
    if (r && i) return { resistance: (v/i).toFixed(2), voltage: v, current: i };
    return null;
  };

  const calc = () => {
    const r = calculate(voltage, resistance, 0);
    setResult(r);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.voltage')}</label>
          <input type="number" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">{t('formLabels.resistance')}</label>
          <input type="number" value={resistance} onChange={(e) => setResistance(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calc} className="bg-green-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">I = {(voltage/resistance).toFixed(2)}A</p>
          <p className="text-sm mt-2">V = {voltage}V × I = {resistance}Ω</p>
        </div>
      )}
    </div>
  );
}