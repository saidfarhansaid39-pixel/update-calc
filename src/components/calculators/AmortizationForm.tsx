'use client';

import React, { useState, useEffect } from 'react';
import { Input, Button, FormGroup, FormPanel } from '@/components/CalculatorFormElements';
import { CalculatorPieChart } from '@/components/calculators/ChartPresets';
import { generateAmortizationSchedule, aggregateAmortizationByYear } from '@/lib/calculators/amortizationEngine';

export function AmortizationForm() {
  const [inputs, setInputs] = useState({
    loanAmount: 200000,
    loanTermYears: 15,
    loanTermMonths: 0,
    interestRate: 6,
    makeExtraPayments: false,
    extraMonthly: 0
  });

  const [results, setResults] = useState<any>(null);

  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const val = parseFloat(e.target.value);
    setInputs(prev => ({ ...prev, [field]: isNaN(val) ? 0 : val }));
  };

  const handleCalculate = () => {
    const totalMonths = (inputs.loanTermYears * 12) + inputs.loanTermMonths;
    const schedule = generateAmortizationSchedule(
      inputs.loanAmount, 
      inputs.interestRate, 
      totalMonths, 
      inputs.makeExtraPayments ? inputs.extraMonthly : 0
    );
    
    if (schedule.length > 0) {
      const monthlyPayment = schedule[0].payment - (inputs.makeExtraPayments ? inputs.extraMonthly : 0);
      const totalInterest = schedule[schedule.length - 1].totalInterest;
      const totalPayments = inputs.loanAmount + totalInterest;
      const yearlySchedule = aggregateAmortizationByYear(schedule);

      setResults({
        monthlyPayment,
        totalInterest,
        totalPayments,
        totalMonths,
        schedule,
        yearlySchedule
      });
    }
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
            <FormGroup label="Loan amount">
              <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[1px] h-[22px]">$</span>
              <Input type="number" value={inputs.loanAmount} onChange={(e) => handleNumChange(e, 'loanAmount')} className="w-[120px]" />
            </FormGroup>
            
            <FormGroup label="Loan term">
              <Input type="number" value={inputs.loanTermYears} onChange={(e) => handleNumChange(e, 'loanTermYears')} className="w-[50px]" />
              <span className="px-1 text-gray-600">years</span>
              <Input type="number" value={inputs.loanTermMonths} onChange={(e) => handleNumChange(e, 'loanTermMonths')} className="w-[50px]" />
              <span className="px-1 text-gray-600">months</span>
            </FormGroup>
            
            <FormGroup label="Interest rate">
              <Input type="number" value={inputs.interestRate} onChange={(e) => handleNumChange(e, 'interestRate')} className="w-[60px]" step="0.1" />
              <span className="px-1">%</span>
            </FormGroup>
            
            <div className="my-3 pl-[140px] flex items-center gap-1">
              <input type="checkbox" checked={inputs.makeExtraPayments} onChange={(e) => setInputs(prev => ({...prev, makeExtraPayments: e.target.checked}))} className="w-3 h-3" />
              <span className="font-bold">Optional: make extra payments</span>
            </div>

            {inputs.makeExtraPayments && (
              <FormGroup label="Extra monthly">
                <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[1px] h-[22px]">$</span>
                <Input type="number" value={inputs.extraMonthly} onChange={(e) => handleNumChange(e, 'extraMonthly')} className="w-[120px]" />
              </FormGroup>
            )}

            <div className="pl-[140px] flex gap-2 mt-4">
              <Button onClick={handleCalculate}>Calculate</Button>
              <Button variant="secondary" onClick={() => {}}>Clear</Button>
            </div>
          </FormPanel>
        </div>

        {results && (
          <div className="flex-1">
            <div className="bg-[#4cae4c] text-white font-bold py-1 px-3 mb-4 flex justify-between items-center text-[15px]">
              <span>Monthly Pay: {formatCurrency(results.monthlyPayment)}</span>
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

      {results && results.yearlySchedule && (
        <div className="mt-2">
          <h2 className="text-[18px] font-bold text-primary-dark mb-2">Amortization schedule</h2>
          <div className="flex gap-4 mb-2">
            <span className="font-bold border-b-2 border-[#333333] pb-[1px]">Annual Schedule</span>
            <button type="button" className="text-[#005596] hover:underline">Monthly Schedule</button>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <table className="w-full lg:w-[400px] text-right border-collapse text-[13px] border border-[#cccccc]">
              <thead>
                <tr className="bg-[#3366aa] text-white">
                  <th className="p-1 text-center font-normal border border-[#cccccc]">Year</th>
                  <th className="p-1 text-center font-normal border border-[#cccccc]">Interest</th>
                  <th className="p-1 text-center font-normal border border-[#cccccc]">Principal</th>
                  <th className="p-1 text-center font-normal border border-[#cccccc]">Ending Balance</th>
                </tr>
              </thead>
              <tbody>
                {results.yearlySchedule.map((row: any) => (
                  <tr key={row.year} className={row.year % 2 === 0 ? "bg-[#f8f8f8]" : ""}>
                    <td className="p-1 text-center border-l border-r border-[#cccccc]">{row.year}</td>
                    <td className="p-1 border-r border-[#cccccc]">{formatCurrency(row.interest)}</td>
                    <td className="p-1 border-r border-[#cccccc]">{formatCurrency(row.principal)}</td>
                    <td className="p-1 border-r border-[#cccccc]">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="w-[300px] h-[200px] border border-[#cccccc] flex items-center justify-center text-gray-400 bg-white shadow-sm mt-4 lg:mt-0">
              {/* Amortization Line Chart Placeholder to match original structure */}
              <div className="text-[11px] text-center px-4">
                [Amortization Graph Placeholder]<br/>
                Requires Recharts LineChart mapping Balance, Interest, Payment
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
