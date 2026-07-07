'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function OneRepMaxForm() {
  const t = useTranslations('calculatorUI');
  const [weight, setWeight] = useState<number>(100);
  const [reps, setReps] = useState<number>(5);
  const [result, setResult] = useState<{ oneRM: number; percentages: Record<number, number> } | null>(null);

  useEffect(() => {
    const oneRM = weight * (1 + reps / 30);
    const percentages: Record<number, number> = {};
    [100, 95, 90, 85, 80, 75, 70, 65, 60].forEach(p => {
      percentages[p] = Math.round(oneRM * p / 100);
    });
    setResult({ oneRM: Math.round(oneRM), percentages });
  }, [weight, reps]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Weight Lifted</label>
          <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Reps Performed</label>
          <input type="number" value={reps} onChange={(e) => setReps(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>
      {result && (
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-orange-100 text-sm">Estimated 1 Rep Max</p>
          <p className="text-4xl font-bold">{result.oneRM} lbs</p>
          <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
            {Object.entries(result.percentages).map(([p, w]) => (
              <div key={p} className="bg-white/20 p-2 rounded text-center">
                <p>{p}%</p><p className="font-bold">{w}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}