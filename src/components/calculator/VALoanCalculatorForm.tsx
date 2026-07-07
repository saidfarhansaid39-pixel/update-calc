'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function VALoanCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [homePrice, setHomePrice] = useState<number>(300000);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [term, setTerm] = useState<number>(30);
  const [rate, setRate] = useState<number>(6.5);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const loanAmount = homePrice - downPayment;
    const fundingFee = loanAmount * 0.02233;
    const monthlyRate = rate / 100 / 12;
    const payments = term * 12;
    
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1);
    
    setResult({
      loanAmount,
      fundingFee: Math.round(fundingFee),
      totalLoan: Math.round(loanAmount + fundingFee),
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(monthlyPayment * payments - loanAmount)
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
          <h3 className="font-bold text-lg text-gray-800 mb-3">VA Loan Summary</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-500">Base Loan</p><p className="text-xl font-bold">${result.loanAmount.toLocaleString()}</p></div>
            <div><p className="text-sm text-gray-500">Funding Fee (2.233%)</p><p className="text-xl font-bold">${result.fundingFee.toLocaleString()}</p></div>
          </div>
          <div className="mt-4 p-3 bg-white rounded">
            <p className="text-sm text-gray-500">{t('results.monthlyPayment')}</p>
            <p className="text-3xl font-bold text-green-600">${result.monthlyPayment.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}