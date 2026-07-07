'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function DueDateCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [lastPeriod, setLastPeriod] = useState<string>('2024-01-01');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const date = new Date(lastPeriod);
    const dueDate = new Date(date.getTime() + 280 * 24 * 60 * 60 * 1000);
    setResult({
      dueDate: dueDate.toISOString().split('T')[0],
      week: 40,
      trimesters: { first: 'Weeks 1-12', second: 'Weeks 13-26', third: 'Weeks 27-40' }
    });
  };

  return (
    <div className="space-y-6">
      <div><label className="block text-sm text-gray-700 mb-1">First Day of Last Period</label>
        <input type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} className="w-full px-4 py-3 border rounded-lg" /></div>
      <button onClick={calculate} className="bg-green-600 text-white px-6 py-2 rounded">Calculate Due Date</button>
      {result && (
        <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl p-6 text-white text-center">
          <p className="text-sm">Your Estimated Due Date</p>
          <p className="text-5xl font-bold">{result.dueDate}</p>
          <p className="mt-2">Week {result.week} of pregnancy</p>
        </div>
      )}
    </div>
  );
}
