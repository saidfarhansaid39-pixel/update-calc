'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function OvulationCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [lastPeriod, setLastPeriod] = useState<string>('2024-01-01');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const date = new Date(lastPeriod);
    const ovulation = new Date(date.getTime() + (cycleLength - 14) * 24 * 60 * 60 * 1000);
    const fertileStart = new Date(ovulation.getTime() - 5 * 24 * 60 * 60 * 1000);
    const fertileEnd = new Date(ovulation.getTime() + 1 * 24 * 60 * 60 * 1000);
    setResult({
      ovulation: ovulation.toISOString().split('T')[0],
      fertileStart: fertileStart.toISOString().split('T')[0],
      fertileEnd: fertileEnd.toISOString().split('T')[0],
      nextPeriod: new Date(date.getTime() + cycleLength * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Last Period Start</label>
          <input type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Cycle Length (days)</label>
          <input type="number" value={cycleLength} onChange={(e) => setCycleLength(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      <button onClick={calculate} className="bg-green-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl p-6 text-white">
          <p className="text-2xl font-bold">Ovulation: {result.ovulation}</p>
          <p className="mt-2">Fertile Window: {result.fertileStart} - {result.fertileEnd}</p>
          <p className="mt-2">Next Period: {result.nextPeriod}</p>
        </div>
      )}
    </div>
  );
}
