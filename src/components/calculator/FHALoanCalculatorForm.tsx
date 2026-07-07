'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function FHALoanCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [homePrice, setHomePrice] = useState<number>(300000);
  const [downPayment, setDownPayment] = useState<number>(10500);
  const [term, setTerm] = useState<number>(30);
  const [rate, setRate] = useState<number>(6.5);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const loanAmount = homePrice - downPayment;
    const upfrontMIP = loanAmount * 0.018;
    const monthlyRate = rate / 100 / 12;
    const payments = term * 12;
    
    const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1);
    const monthlyMIP = loanAmount * 0.0055 / 12;
    const totalMonthly = monthlyPI + monthlyMIP;
    
    setResult({
      loanAmount,
      upfrontMIP: Math.round(upfrontMIP),
      monthlyPI: Math.round(monthlyPI),
      monthlyMIP: Math.round(monthlyMIP),
      totalMonthly: Math.round(totalMonthly),
      totalInterest: Math.round(monthlyPI * payments - loanAmount)
    });
  }, [homePrice, downPayment, term, rate]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.homePrice')}</label>
          <input type="number" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.downPayment')}</label>
          <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.loanTerm')}</label>
          <select value={term} onChange={(e) => setTerm(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded">
            <option value={15}>15 years</option>
            <option value={30}>30 years</option>
          </select></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.interestRate')}</label>
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-bold text-lg text-gray-800 mb-3">FHA Loan Summary</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-500">{t('formLabels.loanAmount')}</p><p className="text-xl font-bold">${result.loanAmount.toLocaleString()}</p></div>
            <div><p className="text-sm text-gray-500">Upfront MIP (1.75%)</p><p className="text-xl font-bold">${result.upfrontMIP.toLocaleString()}</p></div>
          </div>
          <div className="mt-4 p-3 bg-white rounded">
            <p className="text-sm text-gray-500">{t('results.monthlyPayment')}</p>
            <p className="text-3xl font-bold text-green-600">${result.totalMonthly.toLocaleString()}</p>
            <p className="text-xs text-gray-400">P&I: ${result.monthlyPI} + MIP: ${result.monthlyMIP}</p>
          </div>
        </div>
      )}
    </div>
  );
}