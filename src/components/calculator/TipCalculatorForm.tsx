'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function TipCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [bill, setBill] = useState<number>(50);
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [people, setPeople] = useState<number>(1);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const tipAmount = bill * (tipPercent / 100);
    const total = bill + tipAmount;
    const perPerson = total / people;
    setResult({ tipAmount, total, perPerson });
  }, [bill, tipPercent, people]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bill Amount ($)</label>
          <input type="number" value={bill} onChange={(e) => setBill(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded text-xl" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tip Percentage</label>
          <div className="flex gap-2">
            {[10, 15, 18, 20, 25].map(p => (
              <button key={p} onClick={() => setTipPercent(p)} className={`px-3 py-2 rounded ${tipPercent === p ? 'bg-green-button text-white' : 'bg-gray-200'}`}>{p}%</button>
            ))}
          </div>
          <input type="number" value={tipPercent} onChange={(e) => setTipPercent(Number(e.target.value))} className="w-full mt-2 px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of People</label>
          <input type="number" value={people} onChange={(e) => setPeople(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-600">Tip Amount</p><p className="text-xl font-bold text-gray-700">${result.tipAmount.toFixed(2)}</p></div>
            <div><p className="text-sm text-gray-600">Total</p><p className="text-xl font-bold text-green-700">${result.total.toFixed(2)}</p></div>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="text-sm text-gray-600">Per Person</p>
            <p className="text-2xl font-bold text-green-600">${result.perPerson.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
