'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function PregnancyWeightGainForm() {
  const t = useTranslations('calculatorUI');
  const [preWeight, setPreWeight] = useState<number>(140);
  const [height, setHeight] = useState<number>(65);
  const [weeks, setWeeks] = useState<number>(20);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const bmi = (preWeight / (height * height)) * 703;
    let min = 0, max = 0;
    if (bmi < 18.5) { min = 28; max = 40; }
    else if (bmi < 25) { min = 25; max = 35; }
    else if (bmi < 30) { min = 15; max = 25; }
    else { min = 11; max = 20; }
    const weekly = min / 40;
    const currentGain = weekly * weeks;
    setResult({ recommended: `${min}-${max}`, current: currentGain.toFixed(1), weekly: weekly.toFixed(1), bmi: bmi.toFixed(1) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Pre-pregnancy Weight (lbs)</label>
          <input type="number" value={preWeight} onChange={(e) => setPreWeight(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Height (inches)</label>
          <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Weeks Pregnant</label>
          <input type="number" value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-pink-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-3xl font-bold">BMI: {result.bmi}</p>
          <p className="text-sm mt-2">Recommended Total: {result.recommended} lbs | Current: {result.current} lbs</p>
        </div>
      )}
    </div>
  );
}