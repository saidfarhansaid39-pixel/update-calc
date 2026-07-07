'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function HomeAffordabilityForm() {
  const t = useTranslations('calculatorUI');
  const [annualIncome, setAnnualIncome] = useState<number>(80000);
  const [monthlyDebt, setMonthlyDebt] = useState<number>(500);
  const [downPayment, setDownPayment] = useState<number>(60000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [term, setTerm] = useState<number>(30);
  const [propertyTax, setPropertyTax] = useState<number>(1.2);
  const [insurance, setInsurance] = useState<number>(1200);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const frontEndRatio = 0.28;
    const backEndRatio = 0.36;
    
    const monthlyIncome = annualIncome / 12;
    const maxFrontEnd = monthlyIncome * frontEndRatio;
    const maxBackEnd = monthlyIncome * backEndRatio;
    
    const maxMortgagePayment = maxBackEnd - monthlyDebt;
    
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = term * 12;
    
    const maxLoan = maxMortgagePayment * (Math.pow(1 + monthlyRate, totalPayments) - 1) / (Math.pow(1 + monthlyRate, totalPayments) * monthlyRate);
    const maxHomePrice = maxLoan + downPayment;
    
    const monthlyPropertyTax = (maxHomePrice * (propertyTax / 100)) / 12;
    const monthlyInsurance = insurance / 12;
    const totalMonthlyPayment = maxMortgagePayment + monthlyPropertyTax + monthlyInsurance;
    
    setResult({
      maxHomePrice: Math.round(maxHomePrice),
      maxLoan: Math.round(maxLoan),
      monthlyPayment: Math.round(maxMortgagePayment),
      totalMonthlyPayment: Math.round(totalMonthlyPayment),
      downPayment: downPayment,
      propertyTax: Math.round(monthlyPropertyTax),
      insurance: Math.round(monthlyInsurance)
    });
  }, [annualIncome, monthlyDebt, downPayment, interestRate, term, propertyTax, insurance]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Annual Household Income ($)</label>
          <input type="number" value={annualIncome} onChange={(e) => setAnnualIncome(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.monthlyDebt')}</label>
          <input type="number" value={monthlyDebt} onChange={(e) => setMonthlyDebt(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.downPayment')}</label>
          <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.interestRate')}</label>
          <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('formLabels.loanTerm')}</label>
          <input type="number" value={term} onChange={(e) => setTerm(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Property Tax Rate (%)</label>
          <input type="number" step="0.1" value={propertyTax} onChange={(e) => setPropertyTax(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Annual Insurance ($)</label>
          <input type="number" value={insurance} onChange={(e) => setInsurance(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-bold text-lg text-gray-800 mb-3">How Much Home You Can Afford</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded text-center">
              <p className="text-sm text-gray-500">Maximum Home Price</p>
              <p className="text-3xl font-bold text-green-600">${result.maxHomePrice.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded text-center">
              <p className="text-sm text-gray-500">Maximum Loan</p>
              <p className="text-2xl font-bold text-gray-700">${result.maxLoan.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded text-center">
              <p className="text-sm text-gray-500">Monthly P&I Payment</p>
              <p className="text-2xl font-bold text-gray-700">${result.monthlyPayment.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 bg-white p-3 rounded text-sm">
            <p className="text-gray-600"><strong>Total Monthly Payment:</strong> ${result.totalMonthlyPayment.toLocaleString()} (P&I: ${result.monthlyPayment} + Tax: ${result.propertyTax} + Insurance: ${result.insurance})</p>
          </div>
        </div>
      )}
    </div>
  );
}