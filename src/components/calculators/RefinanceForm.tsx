'use client';

import React, { useState, useEffect } from 'react';
import { Input, Button, FormGroup, FormPanel } from '@/components/CalculatorFormElements';
import { generateAmortizationSchedule } from '@/lib/calculators/amortizationEngine';

export function RefinanceForm() {
  const [inputs, setInputs] = useState({
    originalAmount: 250000,
    originalTerm: 30,
    originalRate: 6.5,
    yearsRemaining: 25,
    newTerm: 15,
    newRate: 4.5,
    fees: 3000,
    rollFeesIntoLoan: false
  });

  const [results, setResults] = useState<any>(null);

  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const val = parseFloat(e.target.value);
    setInputs(prev => ({ ...prev, [field]: isNaN(val) ? 0 : val }));
  };

  const handleCalculate = () => {
    // Current Loan Calculations
    const oldSchedule = generateAmortizationSchedule(inputs.originalAmount, inputs.originalRate, inputs.originalTerm * 12);
    const monthsPaid = (inputs.originalTerm - inputs.yearsRemaining) * 12;
    const currentBalance = oldSchedule.length > monthsPaid ? oldSchedule[monthsPaid - 1].balance : 0;
    const oldMonthly = oldSchedule.length > 0 ? oldSchedule[0].payment : 0;
    
    let remainingInterestOld = 0;
    if (oldSchedule.length > monthsPaid) {
      remainingInterestOld = oldSchedule[oldSchedule.length - 1].totalInterest - oldSchedule[monthsPaid - 1].totalInterest;
    }

    // New Loan Calculations
    const newPrincipal = inputs.rollFeesIntoLoan ? currentBalance + inputs.fees : currentBalance;
    const newSchedule = generateAmortizationSchedule(newPrincipal, inputs.newRate, inputs.newTerm * 12);
    const newMonthly = newSchedule.length > 0 ? newSchedule[0].payment : 0;
    const newTotalInterest = newSchedule.length > 0 ? newSchedule[newSchedule.length - 1].totalInterest : 0;

    const monthlySavings = oldMonthly - newMonthly;
    const upfrontCost = inputs.rollFeesIntoLoan ? 0 : inputs.fees;
    const lifetimeSavings = remainingInterestOld - newTotalInterest - upfrontCost;
    
    let breakevenMonths = 0;
    if (monthlySavings > 0) {
      breakevenMonths = inputs.fees / monthlySavings;
    }

    setResults({
      currentBalance,
      oldMonthly,
      newMonthly,
      monthlySavings,
      remainingInterestOld,
      newTotalInterest,
      lifetimeSavings,
      breakevenMonths
    });
  };

  useEffect(() => {
    handleCalculate();
  }, []);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="flex flex-col gap-6 font-sans text-[13px] text-[#333333]">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-[380px]">
          <FormPanel header="Current Loan">
            <FormGroup label="Original Amount">
              <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[1px] h-[22px]">$</span>
              <Input type="number" value={inputs.originalAmount} onChange={(e) => handleNumChange(e, 'originalAmount')} className="w-[120px]" />
            </FormGroup>
            <FormGroup label="Original Term">
              <Input type="number" value={inputs.originalTerm} onChange={(e) => handleNumChange(e, 'originalTerm')} className="w-[50px]" />
              <span className="px-1 text-gray-600">years</span>
            </FormGroup>
            <FormGroup label="Interest Rate">
              <Input type="number" value={inputs.originalRate} onChange={(e) => handleNumChange(e, 'originalRate')} className="w-[60px]" step="0.1" />
              <span className="px-1">%</span>
            </FormGroup>
            <FormGroup label="Years Remaining">
              <Input type="number" value={inputs.yearsRemaining} onChange={(e) => handleNumChange(e, 'yearsRemaining')} className="w-[50px]" />
              <span className="px-1 text-gray-600">years</span>
            </FormGroup>
          </FormPanel>

          <FormPanel header="New Refinance Loan">
            <FormGroup label="New Term">
              <Input type="number" value={inputs.newTerm} onChange={(e) => handleNumChange(e, 'newTerm')} className="w-[50px]" />
              <span className="px-1 text-gray-600">years</span>
            </FormGroup>
            <FormGroup label="New Interest Rate">
              <Input type="number" value={inputs.newRate} onChange={(e) => handleNumChange(e, 'newRate')} className="w-[60px]" step="0.1" />
              <span className="px-1">%</span>
            </FormGroup>
            <FormGroup label="Refinance Fees">
              <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[1px] h-[22px]">$</span>
              <Input type="number" value={inputs.fees} onChange={(e) => handleNumChange(e, 'fees')} className="w-[120px]" />
            </FormGroup>
            <div className="my-3 pl-[140px] flex items-center gap-1">
              <input type="checkbox" checked={inputs.rollFeesIntoLoan} onChange={(e) => setInputs(prev => ({...prev, rollFeesIntoLoan: e.target.checked}))} className="w-3 h-3" />
              <span>Roll fees into new loan</span>
            </div>

            <div className="pl-[140px] flex gap-2 mt-4">
              <Button onClick={handleCalculate}>Calculate</Button>
              <Button variant="secondary" onClick={() => {}}>Clear</Button>
            </div>
          </FormPanel>
        </div>

        {results && (
          <div className="flex-1">
            <div className={`text-white font-bold py-1 px-3 mb-4 flex justify-between items-center text-[15px] ${results.lifetimeSavings > 0 ? 'bg-[#4cae4c]' : 'bg-[#d9534f]'}`}>
              <span>Lifetime Savings: {formatCurrency(results.lifetimeSavings)}</span>
              <span className="bg-white/20 px-1 rounded cursor-pointer text-[12px]" title="Save">💾</span>
            </div>

            <table className="w-full text-right border-collapse text-[13px] bg-[#f8f8f8]">
              <thead>
                <tr className="bg-[#3366aa] text-white">
                  <th className="p-1 border border-[#cccccc] text-left">Metric</th>
                  <th className="p-1 border border-[#cccccc]">Current Loan</th>
                  <th className="p-1 border border-[#cccccc]">New Loan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-left p-1 border border-[#e0e0e0] font-bold">Monthly Payment</td>
                  <td className="p-1 border border-[#e0e0e0]">{formatCurrency(results.oldMonthly)}</td>
                  <td className="p-1 border border-[#e0e0e0] font-bold text-[#4cae4c]">{formatCurrency(results.newMonthly)}</td>
                </tr>
                <tr>
                  <td className="text-left p-1 border border-[#e0e0e0]">Current Balance</td>
                  <td className="p-1 border border-[#e0e0e0]" colSpan={2}>{formatCurrency(results.currentBalance)}</td>
                </tr>
                <tr>
                  <td className="text-left p-1 border border-[#e0e0e0]">Remaining Interest</td>
                  <td className="p-1 border border-[#e0e0e0]">{formatCurrency(results.remainingInterestOld)}</td>
                  <td className="p-1 border border-[#e0e0e0]">{formatCurrency(results.newTotalInterest)}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4 p-3 border border-[#cccccc] bg-white">
              <h3 className="font-bold mb-2">Analysis</h3>
              <p className="mb-2">
                Refinancing will {results.monthlySavings > 0 ? <span className="text-green-600 font-bold">lower</span> : <span className="text-red-600 font-bold">increase</span>} your monthly payment by <strong>{formatCurrency(Math.abs(results.monthlySavings))}</strong>.
              </p>
              {results.monthlySavings > 0 && inputs.fees > 0 && (
                <p>
                  It will take <strong>{results.breakevenMonths.toFixed(1)} months</strong> to break even on the refinance fees.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
