'use client';

import React, { useState, useEffect } from 'react';
import { Input, Button, FormGroup, FormPanel } from '@/components/CalculatorFormElements';
import { CalculatorPieChart } from '@/components/calculators/ChartPresets';

function solveForInterestRate(pv: number, pmt: number, n: number): number {
  if (pv <= 0 || pmt <= 0 || n <= 0) return 0;
  if (pmt * n <= pv) return 0; // Negative or 0 interest rate

  let low = 0.0;
  let high = 1.0; // 100% monthly rate max
  let mid = 0;

  for (let i = 0; i < 100; i++) {
    mid = (low + high) / 2;
    const guessPmt = pv * (mid * Math.pow(1 + mid, n)) / (Math.pow(1 + mid, n) - 1);
    
    if (guessPmt > pmt) {
      high = mid;
    } else {
      low = mid;
    }
  }

  // mid is monthly rate, return annual rate percentage
  return mid * 12 * 100;
}

export function InterestRateForm() {
  const [inputs, setInputs] = useState({
    loanAmount: 10000,
    loanTermYears: 5,
    loanTermMonths: 0,
    monthlyPay: 193.33
  });

  const [results, setResults] = useState<any>(null);

  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const val = parseFloat(e.target.value);
    setInputs(prev => ({ ...prev, [field]: isNaN(val) ? 0 : val }));
  };

  const handleCalculate = () => {
    const totalMonths = (inputs.loanTermYears * 12) + inputs.loanTermMonths;
    const rate = solveForInterestRate(inputs.loanAmount, inputs.monthlyPay, totalMonths);
    
    const totalPayments = inputs.monthlyPay * totalMonths;
    const totalInterest = totalPayments - inputs.loanAmount;

    setResults({
      rate,
      totalPayments,
      totalInterest,
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
            
            <FormGroup label="Monthly Pay">
              <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[1px] h-[22px]">$</span>
              <Input type="number" value={inputs.monthlyPay} onChange={(e) => handleNumChange(e, 'monthlyPay')} className="w-[120px]" step="0.01" />
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
              <span>Interest Rate: {results.rate.toFixed(3)} %</span>
              <span className="bg-white/20 px-1 rounded cursor-pointer text-[12px]" title="Save">💾</span>
            </div>

            <div className="flex justify-center my-4">
              <CalculatorPieChart 
                data={[
                  { name: 'Principal', value: inputs.loanAmount },
                  { name: 'Interest', value: results.totalInterest }
                ]}
              />
            </div>

            <table className="w-full text-right border-collapse text-[13px] bg-[#f8f8f8]">
              <tbody>
                <tr>
                  <td className="text-left p-1 border border-[#e0e0e0]">Total of {results.totalMonths} monthly payments</td>
                  <td className="p-1 border border-[#e0e0e0] font-bold">{formatCurrency(results.totalPayments)}</td>
                </tr>
                <tr>
                  <td className="text-left p-1 border border-[#e0e0e0]">Total interest</td>
                  <td className="p-1 border border-[#e0e0e0] font-bold">{formatCurrency(results.totalInterest)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
