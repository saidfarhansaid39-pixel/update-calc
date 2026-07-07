'use client';

import { useState, useEffect } from 'react';

export default function Calculator401KForm() {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentBalance, setCurrentBalance] = useState<number>(50000);
  const [annualContribution, setAnnualContribution] = useState<number>(15000);
  const [employerMatch, setEmployerMatch] = useState<number>(5);
  const [salary, setSalary] = useState<number>(75000);
  const [expectedReturn, setExpectedReturn] = useState<number>(7);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const years = retirementAge - currentAge;
    const rate = expectedReturn / 100;
    const monthlyRate = rate / 12;
    
    const employerContrib = salary * (employerMatch / 100);
    const totalAnnualContrib = annualContribution + employerContrib;
    
    let futureValue = currentBalance * Math.pow(1 + rate, years);
    futureValue += totalAnnualContrib * ((Math.pow(1 + rate, years) - 1) / rate);
    
    const totalContributions = currentBalance + (totalAnnualContrib * years);
    const totalEarnings = futureValue - totalContributions;
    
    setResult({
      balance: Math.round(futureValue),
      totalContributions: Math.round(totalContributions),
      totalEarnings: Math.round(totalEarnings),
      years,
      annualContrib: annualContribution,
      employerContrib: Math.round(employerContrib),
      totalAnnual: Math.round(totalAnnualContrib)
    });
  }, [currentAge, retirementAge, currentBalance, annualContribution, employerMatch, salary, expectedReturn]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div><label className="block text-sm text-gray-700 mb-1">Current Age</label>
          <input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} className="w-full p-2 border rounded" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Retirement Age</label>
          <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} className="w-full p-2 border rounded" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Current 401(k) Balance</label>
          <input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(Number(e.target.value))} className="w-full p-2 border rounded" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Annual Contribution ($)</label>
          <input type="number" value={annualContribution} onChange={(e) => setAnnualContribution(Number(e.target.value))} className="w-full p-2 border rounded" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Annual Salary ($)</label>
          <input type="number" value={salary} onChange={(e) => setSalary(Number(e.target.value))} className="w-full p-2 border rounded" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Employer Match (%)</label>
          <input type="number" value={employerMatch} onChange={(e) => setEmployerMatch(Number(e.target.value))} className="w-full p-2 border rounded" /></div>
        <div><label className="block text-sm text-gray-700 mb-1">Expected Return (%)</label>
          <input type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} className="w-full p-2 border rounded" /></div>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-bold text-xl text-gray-800 mb-4">At Retirement (Age {retirementAge})</h3>
          <p className="text-4xl font-bold text-green-600 mb-4">${result.balance.toLocaleString()}</p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div><p className="text-gray-500">Your Contributions</p><p className="font-bold">${result.annualContrib.toLocaleString()}/yr</p></div>
            <div><p className="text-gray-500">Employer Match</p><p className="font-bold">${result.employerContrib.toLocaleString()}/yr</p></div>
            <div><p className="text-gray-500">Total Interest</p><p className="font-bold text-green-600">${result.totalEarnings.toLocaleString()}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}