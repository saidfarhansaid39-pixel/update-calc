'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function MortgagePayoffForm() {
  const t = useTranslations('calculatorUI');
  const [principal, setPrincipal] = useState<number>(300000);
  const [rate, setRate] = useState<number>(6.5);
  const [term, setTerm] = useState<number>(30);
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const monthlyRate = rate / 100 / 12;
    const totalPayments = term * 12;
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
    
    let balance = principal;
    let months = 0;
    let totalInterest = 0;
    const schedule = [];
    
    while (balance > 0 && months < totalPayments) {
      const interest = balance * monthlyRate;
      const principalPayment = monthlyPayment - interest;
      const actualPayment = Math.min(principalPayment + extraPayment, balance);
      balance = balance - actualPayment;
      totalInterest += interest;
      months++;
      
      if (months % 12 === 0 || balance <= 0) {
        schedule.push({ month: months, balance: Math.max(0, balance), totalInterest });
      }
    }
    
    const originalInterest = (monthlyPayment * totalPayments) - principal;
    const savings = originalInterest - totalInterest;
    
    setResult({
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalPaid: Math.round(totalInterest + principal),
      months,
      years: (months / 12).toFixed(1),
      savings: Math.round(savings),
      schedule
    });
  }, [principal, rate, term, extraPayment]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.principal')}</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.rate')}</label>
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.term')}</label>
          <input type="number" value={term} onChange={(e) => setTerm(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.extraPayment')}</label>
          <input type="number" value={extraPayment} onChange={(e) => setExtraPayment(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h3 className="font-bold text-lg text-gray-800 mb-3">{t('sections.payoffSummary')}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded"><p className="text-sm text-gray-500">{t('results.monthlyPayment')}</p><p className="text-xl font-bold">${result.monthlyPayment.toLocaleString()}</p></div>
              <div className="bg-white p-3 rounded"><p className="text-sm text-gray-500">Payoff Time</p><p className="text-xl font-bold text-green-600">{result.years} years</p></div>
              <div className="bg-white p-3 rounded"><p className="text-sm text-gray-500">{t('results.totalInterest')}</p><p className="text-xl font-bold text-red-600">${result.totalInterest.toLocaleString()}</p></div>
              <div className="bg-white p-3 rounded"><p className="text-sm text-gray-500">Interest Saved</p><p className="text-xl font-bold text-green-600">${result.savings.toLocaleString()}</p></div>
            </div>
          </div>
          
          {extraPayment > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-blue-800 font-medium">Adding ${extraPayment}/month saves ${result.savings.toLocaleString()} in interest and pays off {term - Math.floor(result.months/12)} years early!</p>
            </div>
          )}

          {result.schedule.length > 0 && (
            <div className="border border-gray-200 rounded overflow-x-auto">
              <h4 className="font-bold text-gray-800 p-3 bg-gray-50 border-b">Amortization Schedule (Yearly)</h4>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Year</th>
                    <th className="border p-2 text-right">Remaining Balance</th>
                    <th className="border p-2 text-right">Cumulative Interest</th>
                    <th className="border p-2 text-right">Equity</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row: any, i: number) => {
                    const yearNum = row.month / 12;
                    const shouldShow = yearNum <= 5 || yearNum >= Math.floor(result.years) - 2 || i === 0 || i === result.schedule.length - 1 || result.schedule.length <= 15;
                    if (!shouldShow && result.schedule.length > 15) return null;
                    return (
                      <tr key={row.month} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border p-2">Year {Math.floor(yearNum)}</td>
                        <td className="border p-2 text-right">${Math.round(row.balance).toLocaleString()}</td>
                        <td className="border p-2 text-right">${Math.round(row.totalInterest).toLocaleString()}</td>
                        <td className="border p-2 text-right">${Math.round(principal - row.balance).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* end */}
    </div>
  );
}