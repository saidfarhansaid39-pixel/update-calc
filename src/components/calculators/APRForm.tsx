'use client';

import React, { useState, useEffect } from 'react';
import { Input, Button, FormGroup, FormPanel } from '@/components/CalculatorFormElements';
import { generateAmortizationSchedule } from '@/lib/calculators/amortizationEngine';

// APR calculation using Newton-Raphson or binary search
function calculateAPR(loanAmount: number, monthlyPayment: number, termMonths: number, upfrontFees: number): number {
  const actualLoanAmount = loanAmount - upfrontFees; // Net proceeds to borrower
  
  if (actualLoanAmount <= 0) return 0;

  let low = 0.0;
  let high = 1.0;
  let mid = 0;

  for (let i = 0; i < 100; i++) {
    mid = (low + high) / 2;
    const guessPmt = actualLoanAmount * (mid * Math.pow(1 + mid, termMonths)) / (Math.pow(1 + mid, termMonths) - 1);
    
    if (guessPmt > monthlyPayment) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return mid * 12 * 100; // Annualized APR
}

export function APRForm() {
  const [inputs, setInputs] = useState({
    loanAmount: 100000,
    loanTermYears: 30,
    loanTermMonths: 0,
    interestRate: 6,
    fees: 2500
  });

  const [results, setResults] = useState<any>(null);

  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const val = parseFloat(e.target.value);
    setInputs(prev => ({ ...prev, [field]: isNaN(val) ? 0 : val }));
  };

  const handleCalculate = () => {
    const totalMonths = (inputs.loanTermYears * 12) + inputs.loanTermMonths;
    const schedule = generateAmortizationSchedule(inputs.loanAmount, inputs.interestRate, totalMonths);
    const monthlyPayment = schedule.length > 0 ? schedule[0].payment : 0;
    
    const apr = calculateAPR(inputs.loanAmount, monthlyPayment, totalMonths, inputs.fees);

    setResults({
      monthlyPayment,
      apr,
      totalMonths
    });
  };

  useEffect(() => {
    handleCalculate();
  }, []);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="flex flex-col gap-6 font-sans text-[13px] text-[#333333]">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-[340px]">
          <FormPanel header="Modify the values and click the Calculate button to use">
            <FormGroup label="Loan Amount">
              <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[1px] h-[22px]">$</span>
              <Input type="number" value={inputs.loanAmount} onChange={(e) => handleNumChange(e, 'loanAmount')} className="w-[120px]" />
            </FormGroup>
            
            <FormGroup label="Loan Term">
              <Input type="number" value={inputs.loanTermYears} onChange={(e) => handleNumChange(e, 'loanTermYears')} className="w-[50px]" />
              <span className="px-1 text-gray-600">years</span>
              <Input type="number" value={inputs.loanTermMonths} onChange={(e) => handleNumChange(e, 'loanTermMonths')} className="w-[50px]" />
              <span className="px-1 text-gray-600">months</span>
            </FormGroup>
            
            <FormGroup label="Interest Rate">
              <Input type="number" value={inputs.interestRate} onChange={(e) => handleNumChange(e, 'interestRate')} className="w-[60px]" step="0.1" />
              <span className="px-1">%</span>
            </FormGroup>
            
            <FormGroup label="Loan Fees">
              <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[1px] h-[22px]">$</span>
              <Input type="number" value={inputs.fees} onChange={(e) => handleNumChange(e, 'fees')} className="w-[120px]" />
            </FormGroup>

            <div className="pl-[140px] flex gap-2 mt-4">
              <Button onClick={handleCalculate}>Calculate</Button>
              <Button variant="secondary" onClick={() => {}}>Clear</Button>
            </div>
          </FormPanel>
        </div>

        {results && (
          <div className="flex-1">
            <div className="bg-[#4cae4c] text-white font-bold py-1 px-3 mb-4 flex justify-between items-center text-[15px]">
              <span>Real APR: {results.apr.toFixed(3)} %</span>
              <span className="bg-white/20 px-1 rounded cursor-pointer text-[12px]" title="Save">💾</span>
            </div>

            <table className="w-full text-right border-collapse text-[13px] bg-[#f8f8f8]">
              <tbody>
                <tr>
                  <td className="text-left p-1 border border-[#e0e0e0]">Monthly Payment</td>
                  <td className="p-1 border border-[#e0e0e0] font-bold">{formatCurrency(results.monthlyPayment)}</td>
                </tr>
                <tr>
                  <td className="text-left p-1 border border-[#e0e0e0]">Nominal Interest Rate</td>
                  <td className="p-1 border border-[#e0e0e0]">{inputs.interestRate.toFixed(3)} %</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
