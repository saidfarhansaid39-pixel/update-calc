'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function GradeCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [scores, setScores] = useState<string>('85, 90, 78, 92, 88');
  const [weights, setWeights] = useState<string>('20, 20, 20, 20, 20');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const s = scores.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    const w = weights.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    const totalWeight = w.reduce((a, b) => a + b, 0);
    const weightedSum = s.reduce((sum, score, i) => sum + score * (w[i] || 1), 0);
    const avg = weightedSum / totalWeight;
    let grade = 'F';
    if (avg >= 90) grade = 'A'; else if (avg >= 80) grade = 'B'; else if (avg >= 70) grade = 'C'; else if (avg >= 60) grade = 'D';
    setResult({ average: avg.toFixed(2), grade, totalWeight });
  };

  return (
    <div className="space-y-6">
      <div><label className="block text-sm text-gray-700 mb-1">Scores (comma separated)</label>
        <input type="text" value={scores} onChange={(e) => setScores(e.target.value)} className="w-full px-4 py-3 border rounded-lg" /></div>
      <div><label className="block text-sm text-gray-700 mb-1">Weights (comma separated)</label>
        <input type="text" value={weights} onChange={(e) => setWeights(e.target.value)} className="w-full px-4 py-3 border rounded-lg" placeholder="optional" /></div>
      <button onClick={calculate} className="bg-purple-600 text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>
      {result && (
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white mt-6">
          <p className="text-4xl font-bold">Average: {result.average}%</p>
          <p className="text-2xl mt-2">Grade: {result.grade}</p>
        </div>
      )}
    </div>
  );
}