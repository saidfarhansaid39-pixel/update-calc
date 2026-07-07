'use client';

import React, { useState, useEffect } from 'react';
import { Input, Select, Button, FormGroup, FormPanel } from '@/components/CalculatorFormElements';
import { calculateMortgage, MortgageInputs, MortgageResults } from '@/lib/calculators/mortgage';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#2ca02c', '#1f77b4', '#ff7f0e', '#d62728']; // Green, Blue, Orange, Red (Approximated from screenshot)

export function MortgageForm() {
  const [inputs, setInputs] = useState<MortgageInputs>({
    homePrice: 400000,
    downPaymentPercent: 20,
    loanTermYears: 30,
    interestRate: 6.609,
    startDateMonth: 4, // May (0-indexed)
    startDateYear: 2026,
    includeTaxesAndCosts: true,
    propertyTaxPercent: 1.2,
    homeInsuranceYearly: 1500,
    pmiPercent: 0,
    hoaFeeMonthly: 0,
    otherCostsYearly: 4000,
  });

  const [results, setResults] = useState<MortgageResults | null>(null);

  // Helper to safely handle numeric input changes
  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof MortgageInputs) => {
    const val = parseFloat(e.target.value);
    setInputs(prev => ({ ...prev, [field]: isNaN(val) ? 0 : val }));
  };

  const handleCalculate = () => {
    const res = calculateMortgage(inputs);
    setResults(res);
  };

  useEffect(() => {
    handleCalculate(); // Calculate on mount
  }, []);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  const formatPercent = (val: number) => (val * 100).toFixed(0) + '%';

  const chartData = results ? [
    { name: 'Principal & Interest', value: results.monthlyPrincipalAndInterest },
    { name: 'Property Taxes', value: results.monthlyPropertyTax },
    { name: 'Home Insurance', value: results.monthlyHomeInsurance },
    { name: 'Other Cost', value: results.monthlyOtherCosts + results.monthlyPMI + results.monthlyHOA },
  ] : [];

  return (
    <div className="flex flex-col gap-6 font-sans text-[13px] text-[#333333]">
      <FormPanel header="Modify the values and click the Calculate button to use">
        <FormGroup label="Home Price">
          <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[2px]">$</span>
          <Input type="number" value={inputs.homePrice} onChange={(e) => handleNumChange(e, 'homePrice')} className="w-[120px]" />
        </FormGroup>
        
        <FormGroup label="Down Payment">
          <Input type="number" value={inputs.downPaymentPercent} onChange={(e) => handleNumChange(e, 'downPaymentPercent')} className="w-[50px]" />
          <span className="px-1">%</span>
          <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[2px]">$</span>
          <Input type="number" value={inputs.homePrice * (inputs.downPaymentPercent / 100)} readOnly className="w-[80px] bg-[#f8f8f8]" />
        </FormGroup>
        
        <FormGroup label="Loan Term">
          <Input type="number" value={inputs.loanTermYears} onChange={(e) => handleNumChange(e, 'loanTermYears')} className="w-[50px]" />
          <span className="px-1">years</span>
        </FormGroup>
        
        <FormGroup label="Interest Rate">
          <Input type="number" value={inputs.interestRate} onChange={(e) => handleNumChange(e, 'interestRate')} className="w-[60px]" step="0.001" />
          <span className="px-1">%</span>
        </FormGroup>
        
        <FormGroup label="Start Date">
          <Select value={inputs.startDateMonth} onChange={(e) => setInputs(prev => ({...prev, startDateMonth: parseInt(e.target.value)}))} className="w-[80px]">
            <option value={0}>Jan</option>
            <option value={1}>Feb</option>
            <option value={2}>Mar</option>
            <option value={3}>Apr</option>
            <option value={4}>May</option>
            <option value={5}>Jun</option>
            <option value={6}>Jul</option>
            <option value={7}>Aug</option>
            <option value={8}>Sep</option>
            <option value={9}>Oct</option>
            <option value={10}>Nov</option>
            <option value={11}>Dec</option>
          </Select>
          <Input type="number" value={inputs.startDateYear} onChange={(e) => handleNumChange(e, 'startDateYear')} className="w-[60px] ml-1" />
        </FormGroup>
        
        <div className="my-3 pl-[140px] flex items-center gap-1">
          <input type="checkbox" checked={inputs.includeTaxesAndCosts} onChange={(e) => setInputs(prev => ({...prev, includeTaxesAndCosts: e.target.checked}))} className="w-3 h-3" />
          <span className="font-bold">Include Taxes & Costs Below</span>
        </div>
        
        {inputs.includeTaxesAndCosts && (
          <>
            <FormGroup label="Property Taxes">
              <Input type="number" value={inputs.propertyTaxPercent} onChange={(e) => handleNumChange(e, 'propertyTaxPercent')} className="w-[50px]" step="0.1" />
              <span className="px-1">%</span>
              <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[2px]">$</span>
              <Input type="number" value={(inputs.homePrice * (inputs.propertyTaxPercent / 100)).toFixed(0)} readOnly className="w-[80px] bg-[#f8f8f8]" />
              <span className="px-1 text-gray-500">/yr</span>
            </FormGroup>
            
            <FormGroup label="Home Insurance">
              <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[2px]">$</span>
              <Input type="number" value={inputs.homeInsuranceYearly} onChange={(e) => handleNumChange(e, 'homeInsuranceYearly')} className="w-[80px]" />
              <span className="px-1 text-gray-500">/yr</span>
            </FormGroup>
            
            <FormGroup label="PMI Insurance">
              <Input type="number" value={inputs.pmiPercent} onChange={(e) => handleNumChange(e, 'pmiPercent')} className="w-[50px]" step="0.1" />
              <span className="px-1">%</span>
              <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[2px]">$</span>
              <Input type="number" value={((inputs.homePrice * (1 - inputs.downPaymentPercent/100)) * (inputs.pmiPercent / 100)).toFixed(0)} readOnly className="w-[80px] bg-[#f8f8f8]" />
              <span className="px-1 text-gray-500">/yr</span>
            </FormGroup>
            
            <FormGroup label="HOA Fee">
              <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[2px]">$</span>
              <Input type="number" value={inputs.hoaFeeMonthly} onChange={(e) => handleNumChange(e, 'hoaFeeMonthly')} className="w-[80px]" />
              <span className="px-1 text-gray-500">/mo</span>
            </FormGroup>
            
            <FormGroup label="Other Costs">
              <span className="bg-[#e6e6e6] border border-[#cccccc] border-r-0 px-2 py-[2px]">$</span>
              <Input type="number" value={inputs.otherCostsYearly} onChange={(e) => handleNumChange(e, 'otherCostsYearly')} className="w-[80px]" />
              <span className="px-1 text-gray-500">/yr</span>
            </FormGroup>
          </>
        )}

        <div className="pl-[140px] mt-2 mb-4">
          <button type="button" className="text-[#005596] hover:underline text-[12px]">+ More Options</button>
        </div>

        <div className="pl-[140px] flex gap-2">
          <Button onClick={handleCalculate}>Calculate</Button>
          <Button variant="secondary" onClick={() => {}}>Clear</Button>
        </div>
      </FormPanel>

      {/* Results Section */}
      {results && (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 border border-[#cccccc] p-3 pt-0">
            <div className="bg-[#4cae4c] text-white font-bold py-1 px-3 -mx-3 mb-2 flex justify-between items-center text-[15px]">
              <span>Monthly Pay: {formatCurrency(results.totalMonthlyPayment)}</span>
              <span className="bg-white/20 px-1 rounded cursor-pointer" title="Print">🖨️</span>
            </div>
            
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-[#cccccc] font-bold">
                  <th className="text-left font-normal pb-1"></th>
                  <th className="pb-1 w-[80px]">Monthly</th>
                  <th className="pb-1 w-[90px]">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-left py-[2px]">Mortgage Payment</td>
                  <td>{formatCurrency(results.monthlyPrincipalAndInterest)}</td>
                  <td>{formatCurrency(results.totalPrincipalAndInterest)}</td>
                </tr>
                {inputs.includeTaxesAndCosts && (
                  <>
                    <tr>
                      <td className="text-left py-[2px]">Property Tax</td>
                      <td>{formatCurrency(results.monthlyPropertyTax)}</td>
                      <td>{formatCurrency(results.totalPropertyTax)}</td>
                    </tr>
                    <tr>
                      <td className="text-left py-[2px]">Home Insurance</td>
                      <td>{formatCurrency(results.monthlyHomeInsurance)}</td>
                      <td>{formatCurrency(results.totalHomeInsurance)}</td>
                    </tr>
                    <tr>
                      <td className="text-left py-[2px]">Other Costs</td>
                      <td>{formatCurrency(results.monthlyOtherCosts + results.monthlyPMI + results.monthlyHOA)}</td>
                      <td>{formatCurrency(results.totalOtherCosts)}</td>
                    </tr>
                  </>
                )}
                <tr className="border-t border-[#cccccc] font-bold bg-[#f8f8f8]">
                  <td className="text-left py-1">Total Out-of-Pocket</td>
                  <td>{formatCurrency(results.totalMonthlyPayment)}</td>
                  <td>{formatCurrency(results.totalOutOfPocket)}</td>
                </tr>
              </tbody>
            </table>

            {/* Pie Chart */}
            <div className="h-[180px] mt-4 flex">
              <div className="flex-1">
                 <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.filter(d => d.value > 0)}
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-[120px] flex flex-col justify-center gap-1 text-[11px]">
                 {chartData.filter(d => d.value > 0).map((entry, idx) => (
                   <div key={idx} className="flex items-center gap-1">
                     <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                     <span className="leading-tight">{entry.name}</span>
                   </div>
                 ))}
              </div>
            </div>

            <table className="w-full text-right mt-4 border-collapse bg-[#f8f8f8] border border-[#cccccc] p-2 text-[12px]">
              <tbody>
                <tr>
                  <td className="text-left font-bold p-1">House Price</td>
                  <td className="p-1">{formatCurrency(inputs.homePrice)}</td>
                </tr>
                <tr>
                  <td className="text-left p-1 border-t border-[#e0e0e0]">Loan Amount</td>
                  <td className="p-1 border-t border-[#e0e0e0]">{formatCurrency(results.principalAmount)}</td>
                </tr>
                <tr>
                  <td className="text-left p-1 border-t border-[#e0e0e0]">Down Payment</td>
                  <td className="p-1 border-t border-[#e0e0e0]">{formatCurrency(results.downPaymentAmount)}</td>
                </tr>
                <tr>
                  <td className="text-left p-1 border-t border-[#e0e0e0]">Total of {inputs.loanTermYears * 12} Mortgage Payments</td>
                  <td className="p-1 border-t border-[#e0e0e0]">{formatCurrency(results.totalPrincipalAndInterest)}</td>
                </tr>
                <tr>
                  <td className="text-left p-1 border-t border-[#e0e0e0]">Total Interest</td>
                  <td className="p-1 border-t border-[#e0e0e0]">{formatCurrency(results.totalInterestPaid)}</td>
                </tr>
                <tr>
                  <td className="text-left p-1 border-t border-[#e0e0e0]">Mortgage Payoff Date</td>
                  <td className="p-1 border-t border-[#e0e0e0]">
                    {results.payoffDate.toLocaleString('en-US', { month: 'short' })}. {results.payoffDate.getFullYear()}
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div className="mt-4 flex justify-center gap-2">
              <span className="text-white bg-[#005596] hover:bg-[#003366] px-3 py-1 font-bold rounded-sm text-[12px] cursor-default">Latest Mortgage Rates</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
