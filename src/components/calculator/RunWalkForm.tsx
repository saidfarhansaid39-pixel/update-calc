'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function RunWalkForm() {
  const t = useTranslations('calculatorUI');
  const [distance, setDistance] = useState<number>(5);
  const [runPace, setRunPace] = useState<number>(9);
  const [walkPace, setWalkPace] = useState<number>(15);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const runTime = (distance / runPace) * 60;
    const walkTime = (distance / walkPace) * 60;
    const runWalk = (runTime + walkTime) / 2;
    setResult({ runTime: (runTime/60).toFixed(2), walkTime: (walkTime/60).toFixed(2), runWalkTime: (runWalk/60).toFixed(2) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Distance (miles)</label>
          <input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Run Pace (min/mi)</label>
          <input type="number" value={runPace} onChange={(e) => setRunPace(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Walk Pace (min/mi)</label>
          <input type="number" value={walkPace} onChange={(e) => setWalkPace(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-orange-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-xl">Run: {result.runTime}h | Walk: {result.walkTime}h</p>
          <p className="text-2xl font-bold mt-2">Run/Walk: {result.runWalkTime}h</p>
        </div>
      )}
    </div>
  );
}
