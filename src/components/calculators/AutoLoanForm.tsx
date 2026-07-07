'use client';

import React, { useState, useEffect } from 'react';
import { Input, Select, Button, FormGroup, FormPanel } from '@/components/CalculatorFormElements';
import { CalculatorPieChart } from '@/components/calculators/ChartPresets';
import { generateAmortizationSchedule, aggregateAmortizationByYear } from '@/lib/calculators/amortizationEngine';

export function AutoLoanForm() {
  const [activeTab, setActiveTab] = useState<'total' | 'monthly'>('total');
  
  const [inputs, setInputs] = useState({
    autoPrice: 50000,
    loanTerm: 60,
    interestRate: 5,
    cashIncentives: 0,
    downPayment: 10000,
    tradeInValue: 0,
    amountOwedOnTradeIn: 0,
    state: '',
    salesTax: 7,
    fees: 2000,
    includeTaxesAndFees: false,
  });

  const [results, setResults] = useState<any>(null);

  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const val = parseFloat(e.target.value);
    setInputs(prev => ({ ...prev, [field]: isNaN(val) ? 0 : val }));
  };

  const handleCalculate = () => {
    // Math Logic for Total Price mode
    const tradeInNet = inputs.tradeInValue - inputs.amountOwedOnTradeIn;
    const taxableAmount = inputs.autoPrice - inputs.cashIncentives - (tradeInNet > 0 ? tradeInNet : 0); // simplification of state rules
    const salesTaxAmount = taxableAmount * (inputs.salesTax / 100);
    
    const upfrontPayment = inputs.downPayment + (inputs.includeTaxesAndFees ? 0 : salesTaxAmount + inputs.fees);
    const loanAmount = inputs.autoPrice - inputs.downPayment - inputs.cashIncentives - tradeInNet + (inputs.includeTaxesAndFees ? salesTaxAmount + inputs.fees : 0);
    
    const schedule = generateAmortizationSchedule(loanAmount, inputs.interestRate, inputs.loanTerm);
    const monthlyPayment = schedule.length > 0 ? schedule[0].payment : 0;
    const totalInterest = schedule.length > 0 ? schedule[schedule.length - 1].totalInterest : 0;
    const totalLoanPayments = monthlyPayment * inputs.loanTerm;
    const totalCost = inputs.autoPrice + totalInterest + salesTaxAmount + inputs.fees;

    const yearlySchedule = aggregateAmortizationByYear(schedule);

    setResults({
      monthlyPayment,
      loanAmount,
      salesTaxAmount,
      upfrontPayment,
      totalLoanPayments,
      totalInterest,
      totalCost,
      yearlySchedule
    });
  };

  useEffect(() => {
    handleCalculate();
  }, []);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="flex flex-col gap-6 font-sans text-[13px] text-[#333333]">
      <div className="flex bg-[#3366aa] text-white">
        <div 
          className={`flex-1 text-center py-2 font-bold cursor-pointer border border-[#3366aa] ${activeTab === 'total' ? 'bg-[#f0f0f0] text-[#333333] border-b-transparent' : 'hover:bg-[#4477bb]'}`}
          onClick={() => setActiveTab('total')}
        >
          Total Price
        </div>
        <div 
          className={`flex-1 text-center py-2 font-bold cursor-pointer border border-[#3366aa] ${activeTab === 'monthly' ? 'bg-[#f0f0f0] text-[#333333] border-b-transparent' : 'hover:bg-[#4477bb]'}`}
          onClick={() => setActiveTab('monthly')}
        >
          Monthly Payment
        </div>
      </div>
      
      <div className="-mt-6">
        <FormPanel header="Modify the values and click the Calculate button to use">
          <FormGroup label="Auto Price">
            <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[1px] h-[22px]">$</span>
            <Input type="number" value={inputs.autoPrice} onChange={(e) => handleNumChange(e, 'autoPrice')} className="w-[120px]" />
          </FormGroup>
          
          <FormGroup label="Loan Term">
            <Input type="number" value={inputs.loanTerm} onChange={(e) => handleNumChange(e, 'loanTerm')} className="w-[50px]" />
            <span className="px-1 text-gray-600">months</span>
          </FormGroup>
          
          <FormGroup label="Interest Rate">
            <Input type="number" value={inputs.interestRate} onChange={(e) => handleNumChange(e, 'interestRate')} className="w-[50px]" step="0.1" />
            <span className="px-1">%</span>
          </FormGroup>
          
          <FormGroup label="Cash Incentives">
            <span className="text-[#888888] cursor-help mr-1">?</span>
            <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[1px] h-[22px]">$</span>
            <Input type="number" value={inputs.cashIncentives} onChange={(e) => handleNumChange(e, 'cashIncentives')} className="w-[120px]" />
          </FormGroup>
          
          <FormGroup label="Down Payment">
            <span className="text-[#888888] cursor-help mr-1">?</span>
            <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[1px] h-[22px]">$</span>
            <Input type="number" value={inputs.downPayment} onChange={(e) => handleNumChange(e, 'downPayment')} className="w-[120px]" />
          </FormGroup>
          
          <FormGroup label="Trade-in Value">
            <span className="text-[#888888] cursor-help mr-1">?</span>
            <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[1px] h-[22px]">$</span>
            <Input type="number" value={inputs.tradeInValue} onChange={(e) => handleNumChange(e, 'tradeInValue')} className="w-[120px]" />
          </FormGroup>
          
          <FormGroup label="Amount Owed on Trade-in">
            <span className="text-[#888888] cursor-help mr-1">?</span>
            <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[1px] h-[22px]">$</span>
            <Input type="number" value={inputs.amountOwedOnTradeIn} onChange={(e) => handleNumChange(e, 'amountOwedOnTradeIn')} className="w-[120px]" />
          </FormGroup>
          
          <FormGroup label="Your State">
            <Select value={inputs.state} onChange={(e) => setInputs(prev => ({...prev, state: e.target.value}))} className="w-[145px]">
              <option value="">-- Select --</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
            </Select>
          </FormGroup>
          
          <FormGroup label="Sales Tax">
            <span className="text-[#888888] cursor-help mr-1">?</span>
            <Input type="number" value={inputs.salesTax} onChange={(e) => handleNumChange(e, 'salesTax')} className="w-[50px]" step="0.1" />
            <span className="px-1">%</span>
          </FormGroup>
          
          <FormGroup label="Title, Registration and Other Fees">
            <span className="text-[#888888] cursor-help mr-1">?</span>
            <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[1px] h-[22px]">$</span>
            <Input type="number" value={inputs.fees} onChange={(e) => handleNumChange(e, 'fees')} className="w-[120px]" />
          </FormGroup>
          
          <div className="my-3 pl-[140px] flex items-center gap-1">
            <input type="checkbox" checked={inputs.includeTaxesAndFees} onChange={(e) => setInputs(prev => ({...prev, includeTaxesAndFees: e.target.checked}))} className="w-3 h-3" />
            <span>Include taxes and fees in loan</span>
          </div>

          <div className="pl-[140px] flex gap-2">
            <Button onClick={handleCalculate}>Calculate</Button>
          </div>
        </FormPanel>
      </div>

      {/* Results Section */}
      {results && (
        <div className="flex flex-col md:flex-row gap-4 -mt-2">
          <div className="flex-1 border border-[#cccccc] p-3 pt-0 bg-[#f8f8f8]">
            <div className="bg-[#4cae4c] text-white font-bold py-1 px-3 -mx-3 mb-2 flex justify-between items-center text-[15px]">
              <span>Monthly Pay: {formatCurrency(results.monthlyPayment)}</span>
              <span className="bg-white/20 px-1 rounded cursor-pointer text-[12px]" title="Save">💾</span>
            </div>
            
            <table className="w-full text-right border-collapse text-[12px]">
              <tbody>
                <tr>
                  <td className="text-left p-1 border-b border-[#e0e0e0]">Total Loan Amount</td>
                  <td className="p-1 border-b border-[#e0e0e0]">{formatCurrency(results.loanAmount)}</td>
                </tr>
                <tr>
                  <td className="text-left p-1 border-b border-[#e0e0e0]">Sale Tax</td>
                  <td className="p-1 border-b border-[#e0e0e0]">{formatCurrency(results.salesTaxAmount)}</td>
                </tr>
                <tr>
                  <td className="text-left p-1 border-b border-[#e0e0e0]">Upfront Payment <span className="text-[#888888] cursor-help">?</span></td>
                  <td className="p-1 border-b border-[#e0e0e0]">{formatCurrency(results.upfrontPayment)}</td>
                </tr>
                <tr><td colSpan={2} className="py-2"></td></tr>
                <tr>
                  <td className="text-left p-1 border-b border-[#e0e0e0]">Total of {inputs.loanTerm} Loan Payments</td>
                  <td className="p-1 border-b border-[#e0e0e0]">{formatCurrency(results.totalLoanPayments)}</td>
                </tr>
                <tr>
                  <td className="text-left p-1 border-b border-[#e0e0e0]">Total Loan Interest</td>
                  <td className="p-1 border-b border-[#e0e0e0]">{formatCurrency(results.totalInterest)}</td>
                </tr>
                <tr>
                  <td className="text-left p-1 border-b border-[#e0e0e0] font-bold">Total Cost (price, interest, tax, fees)</td>
                  <td className="p-1 border-b border-[#e0e0e0] font-bold">{formatCurrency(results.totalCost)}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4">
              <h3 className="font-bold text-center text-[13px] mb-2">Loan Breakdown</h3>
              <CalculatorPieChart 
                data={[
                  { name: 'Principal', value: results.loanAmount },
                  { name: 'Interest', value: results.totalInterest }
                ]}
              />
            </div>
          </div>
        </div>
      )}
      
      {results && results.yearlySchedule && (
        <div className="mt-4">
          <h2 className="text-[18px] font-bold text-primary-dark border-b border-[#cccccc] pb-1 mb-2">Amortization schedule</h2>
          <div className="flex gap-4">
            <span className="font-bold">Annual Schedule</span>
            <button type="button" className="text-[#005596] hover:underline">Monthly Schedule</button>
          </div>
          
          <div className="flex gap-6 mt-4">
            <table className="w-[300px] text-right border-collapse text-[12px] border border-[#cccccc]">
              <thead>
                <tr className="bg-[#3366aa] text-white">
                  <th className="p-1 text-center border border-[#cccccc]">Year</th>
                  <th className="p-1 text-center border border-[#cccccc]">Interest</th>
                  <th className="p-1 text-center border border-[#cccccc]">Principal</th>
                  <th className="p-1 text-center border border-[#cccccc]">Ending Balance</th>
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
            
            <div className="flex-1 h-[200px] border border-[#cccccc] bg-gray-50 flex items-center justify-center text-gray-400">
              [Amortization Graph Placeholder]
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
