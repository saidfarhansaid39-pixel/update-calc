'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function AnnuityCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [type, setType] = useState<'deferred' | 'immediate'>('deferred');
  const [premium, setPremium] = useState<number>(100000);
  const [rate, setRate] = useState<number>(5);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [payoutYears, setPayoutYears] = useState<number>(20);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const years = retirementAge - currentAge;
    const monthlyRate = rate / 100 / 12;
    let monthlyPayout = 0;
    
    if (type === 'deferred') {
      const futureValue = premium * Math.pow(1 + rate / 100, years);
      monthlyPayout = futureValue * monthlyRate / (1 - Math.pow(1 + monthlyRate, -payoutYears * 12));
    } else {
      monthlyPayout = premium * monthlyRate / (1 - Math.pow(1 + monthlyRate, -payoutYears * 12));
    }
    
    const totalPayout = monthlyPayout * payoutYears * 12;
    const totalContributed = type === 'immediate' ? premium * payoutYears : premium;
    
    setResult({
      monthlyPayout: Math.round(monthlyPayout),
      annualPayout: Math.round(monthlyPayout * 12),
      totalPayout: Math.round(totalPayout),
      totalContributed: type === 'deferred' ? premium : premium,
      totalInterest: Math.round(totalPayout - (type === 'deferred' ? premium : premium * payoutYears))
    });
  }, [type, premium, rate, retirementAge, currentAge, payoutYears]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4">
        <button onClick={() => setType('deferred')} className={`px-4 py-2 rounded ${type === 'deferred' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>Deferred Annuity</button>
        <button onClick={() => setType('immediate')} className={`px-4 py-2 rounded ${type === 'immediate' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>Immediate Annuity</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Premium/Principal</label>
          <input type="number" value={premium} onChange={(e) => setPremium(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Annual Return (%)</label>
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Current Age</label>
          <input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Retirement Age</label>
          <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Payout Years</label>
          <input type="number" value={payoutYears} onChange={(e) => setPayoutYears(Number(e.target.value))} className="w-full px-4 py-3 border rounded-lg" /></div>
      </div>

      {result && (
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <p className="text-green-100 text-sm">Monthly Payout</p>
            <p className="text-4xl font-bold">${result.monthlyPayout.toLocaleString()}</p>
            <p className="text-green-100 mt-2">${result.annualPayout.toLocaleString()}/year</p>
          </div>
          <div className="bg-white p-5 rounded-xl border">
            <h3 className="font-semibold text-gray-800 mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Total Payout</span><span className="font-medium">${result.totalPayout.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Total Interest</span><span className="font-medium text-green-600">${result.totalInterest.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
