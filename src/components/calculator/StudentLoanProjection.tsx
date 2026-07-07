"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, Save } from 'lucide-react';

export function StudentLoanProjection() {
  const [toGraduate, setToGraduate] = useState("2");
  const [loanAmount, setLoanAmount] = useState("10,000");
  const [currentBalance, setCurrentBalance] = useState("20,000");
  const [loanTerm, setLoanTerm] = useState("10");
  const [gracePeriod, setGracePeriod] = useState("6");
  const [interestRate, setInterestRate] = useState("6.8");
  const [payInterest, setPayInterest] = useState("No");

  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    let yGrad = parseFloat(toGraduate) || 0;
    let lAmt = parseFloat(loanAmount.replace(/,/g, '')) || 0;
    let cBal = parseFloat(currentBalance.replace(/,/g, '')) || 0;
    let lTerm = parseFloat(loanTerm) || 0;
    let gPer = parseFloat(gracePeriod) || 0;
    let r = (parseFloat(interestRate) || 0) / 100 / 12;

    if (r === 0 || lTerm === 0) return;

    let totalBorrowed = cBal + (lAmt * yGrad);
    
    // Simulate school period
    let balance = cBal;
    let monthsGrad = yGrad * 12;
    let monthlyAddition = lAmt / 12;

    if (payInterest === 'Yes') {
      // If paying interest, balance only goes up by the principal additions
      balance += (lAmt * yGrad);
    } else {
      // Compounding monthly
      for (let i = 0; i < monthsGrad; i++) {
        balance = balance * (1 + r) + monthlyAddition;
      }
    }

    let balAfterGrad = balance;

    // Grace period
    if (payInterest !== 'Yes') {
      balAfterGrad = balAfterGrad * Math.pow(1 + r, gPer);
    }
    
    let balAfterGrace = balAfterGrad;

    // Repayment
    let n = lTerm * 12;
    let pmt = balAfterGrace * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    let totalPayment = pmt * n;
    let totalInterest = totalPayment - balAfterGrace + (balAfterGrace - totalBorrowed); // Total paid - borrowed

    setResults({
      pmt, totalBorrowed, balAfterGrad: balance, balAfterGrace, totalInterest, totalPayment
    });
  };

  const clear = () => {
    setToGraduate(""); setLoanAmount(""); setCurrentBalance(""); setLoanTerm(""); setGracePeriod(""); setInterestRate(""); setResults(null);
  };

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mb-8 mt-12 border-t pt-8">
      <h2 className="text-[20px] font-bold text-[#1c4587] mb-2 font-sans">Student Loan Projection Calculator</h2>
      <p className="mb-2 text-[13px] text-gray-800">Use the calculator below to estimate the loan balance and repayment obligation after graduation. This calculator is mainly for those still in college or who haven't started. Before estimating, it may be helpful to first consult our College Cost Calculator to get a rough idea of how much college may cost.</p>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Form */}
        <div className="w-full md:w-[320px]">
          <div className="bg-[#f0f0f0] border border-gray-300 rounded text-[13px]">
            <div className="p-4 grid grid-cols-[120px_1fr] gap-y-2 items-center">
              
              <label>To Graduate In</label>
              <div className="flex items-center bg-white border border-gray-400">
                <input type="text" className="w-full px-1 py-0.5 outline-none" value={toGraduate} onChange={e => setToGraduate(e.target.value)} />
                <span className="px-2 bg-gray-100 border-l border-gray-400">years</span>
              </div>

              <label>Estimated Loan Amount</label>
              <div className="flex items-center bg-white border border-gray-400">
                <span className="px-1 bg-gray-100 border-r border-gray-400">$</span>
                <input type="text" className="w-full px-1 py-0.5 outline-none" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} />
                <span className="px-1 bg-gray-100 border-l border-gray-400">/year</span>
              </div>

              <label>Current Balance</label>
              <div className="flex items-center bg-white border border-gray-400">
                <span className="px-2 bg-gray-100 border-r border-gray-400">$</span>
                <input type="text" className="w-full px-1 py-0.5 outline-none" value={currentBalance} onChange={e => setCurrentBalance(e.target.value)} />
              </div>

              <label>Loan Term</label>
              <div className="flex items-center bg-white border border-gray-400">
                <input type="text" className="w-full px-1 py-0.5 outline-none" value={loanTerm} onChange={e => setLoanTerm(e.target.value)} />
                <span className="px-2 bg-gray-100 border-l border-gray-400">years</span>
              </div>

              <label>Grace Period</label>
              <div className="flex items-center bg-white border border-gray-400">
                <input type="text" className="w-full px-1 py-0.5 outline-none" value={gracePeriod} onChange={e => setGracePeriod(e.target.value)} />
                <span className="px-1 bg-gray-100 border-l border-gray-400">months</span>
              </div>

              <label>Interest Rate</label>
              <div className="flex items-center bg-white border border-gray-400">
                <input type="text" className="w-full px-1 py-0.5 outline-none" value={interestRate} onChange={e => setInterestRate(e.target.value)} />
                <span className="px-2 bg-gray-100 border-l border-gray-400">%</span>
              </div>

              <label className="leading-tight">Do you pay interest during school years?</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" checked={payInterest === 'Yes'} onChange={() => setPayInterest('Yes')} /> Yes
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" checked={payInterest === 'No'} onChange={() => setPayInterest('No')} /> No
                </label>
              </div>

            </div>

            <div className="flex gap-2 p-4 border-t border-gray-300">
              <button onClick={calculate} className="bg-[#306e3e] hover:bg-[#255630] text-white px-4 py-1 font-bold rounded shadow border border-[#1f4a27] flex items-center gap-1">
                Calculate <span className="bg-white text-[#306e3e] rounded-full w-3 h-3 flex items-center justify-center text-[8px]">▶</span>
              </button>
              <button onClick={clear} className="bg-[#aaaaaa] hover:bg-[#999999] text-white px-4 py-1 font-bold rounded shadow border border-[#888888]">
                Clear
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-[10px] text-gray-500 leading-tight">
            * The "Grace Period" is the period between the date of graduation and the date that repayment of a student loan must begin.<br/>
            * For some direct subsidized loans, you do not need to pay interest during school years or the grace period.<br/>
            * This calculator assumes loans to be repaid each month equally right after graduation or grace period. It also does not take into account any loan fees.
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="w-full md:flex-1">
            <div className="font-sans text-[13px] text-gray-800">
              <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
                <span className="text-[16px]">Result</span>
                <Save size={16} />
              </div>
              <div className="bg-white border border-gray-300 border-t-0 p-4 leading-relaxed">
                <div className="grid grid-cols-[160px_1fr] gap-y-1 text-[14px]">
                  <div>Repayment:</div>
                  <div className="font-bold text-[#599e28]">${results.pmt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}/month</div>
                  
                  <div>Amount Borrowed:</div>
                  <div>${results.totalBorrowed.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                  
                  <div>Balance After Graduation:</div>
                  <div>${results.balAfterGrad.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                  
                  <div>Balance After Grace Period:</div>
                  <div>${results.balAfterGrace.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                  
                  <div>Total Interest:</div>
                  <div>${results.totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-6">
                  {/* SVG Pie Chart */}
                  <div className="relative w-[100px] h-[100px]">
                    <svg viewBox="0 0 32 32" className="w-full h-full transform -rotate-90 rounded-full">
                      <circle r="16" cx="16" cy="16" fill="#1c4587" />
                      <circle 
                        r="16" cx="16" cy="16" 
                        fill="transparent" 
                        stroke="#599e28" 
                        strokeWidth="32" 
                        strokeDasharray={`${(results.totalBorrowed / results.totalPayment) * 100} 100`} 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
                      <div className="absolute top-4 left-4">{Math.round((results.totalBorrowed / results.totalPayment) * 100)}%</div>
                      <div className="absolute bottom-4 right-4">{Math.round((results.totalInterest / results.totalPayment) * 100)}%</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 text-[13px]">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-[#599e28] border border-gray-400"></div>
                      <span>Principal</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-[#1c4587] border border-gray-400"></div>
                      <span>Interest</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
