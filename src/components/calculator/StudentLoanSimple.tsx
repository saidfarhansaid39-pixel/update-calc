"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, Save } from 'lucide-react';

export function StudentLoanSimple() {
  const [balance, setBalance] = useState("30,000");
  const [term, setTerm] = useState("10");
  const [rate, setRate] = useState("6.8");
  const [payment, setPayment] = useState("");
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    let p = parseFloat(balance.replace(/,/g, ''));
    let n = parseFloat(term) * 12;
    let r = parseFloat(rate) / 100 / 12;
    let pmt = parseFloat(payment.replace(/,/g, ''));

    let isP = !isNaN(p) && p > 0;
    let isN = !isNaN(n) && n > 0;
    let isR = !isNaN(r) && r > 0;
    let isPMT = !isNaN(pmt) && pmt > 0;

    if (isP && isN && isR && !isPMT) {
      pmt = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setPayment(pmt.toFixed(2));
    } else if (isPMT && isN && isR && !isP) {
      p = pmt * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
      setBalance(p.toFixed(2));
    } else if (isP && isPMT && isR && !isN) {
      if (pmt <= p * r) {
        setResults({ error: "Payment is too low to cover interest." });
        return;
      }
      n = -Math.log(1 - (p * r) / pmt) / Math.log(1 + r);
      setTerm((n / 12).toFixed(2));
    } else if (isP && isPMT && isN && !isR) {
      // Newton-Raphson for rate (complex, let's just do a simple binary search)
      let low = 0.000001;
      let high = 1.0;
      let guess = 0.05;
      for (let i = 0; i < 100; i++) {
        guess = (low + high) / 2;
        let testPmt = p * (guess * Math.pow(1 + guess, n)) / (Math.pow(1 + guess, n) - 1);
        if (testPmt > pmt) high = guess;
        else low = guess;
      }
      r = guess;
      setRate((r * 12 * 100).toFixed(2));
    } else if (isP && isN && isR && isPMT) {
      // If all are provided, just recalculate PMT to be safe and match
      pmt = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setPayment(pmt.toFixed(2));
    } else {
      setResults({ error: "Please provide any three values to calculate the fourth." });
      return;
    }

    let totalPayment = pmt * n;
    let totalInterest = totalPayment - p;

    setResults({
      pmt, totalPayment, totalInterest, principal: p
    });
  };

  const clear = () => {
    setBalance(""); setTerm(""); setRate(""); setPayment(""); setResults(null);
  };

  // Run initial calculation to match screenshot
  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-[20px] font-bold text-[#1c4587] mb-2 font-sans">Simple Student Loan Calculator</h2>
      <p className="mb-2 text-[13px] text-gray-800">Please provide any three values below to calculate.</p>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Form */}
        <div className="w-full md:w-[320px]">
          <div className="bg-[#1c4587] text-white flex justify-between items-center p-2 rounded-t text-[13px]">
            <div className="flex items-center font-bold">
              <ChevronDown size={16} className="mr-1" /> Modify the values and click the Calculate button to use
            </div>
          </div>
          <div className="bg-[#f0f0f0] p-4 border border-gray-300 rounded-b text-[13px]">
            <div className="grid grid-cols-[110px_1fr] gap-y-2 items-center">
              
              <label>Loan Balance</label>
              <div className="flex items-center bg-white border border-gray-400">
                <span className="px-2 bg-gray-100 border-r border-gray-400">$</span>
                <input type="text" className="w-full px-1 py-0.5 outline-none" value={balance} onChange={e => setBalance(e.target.value)} />
              </div>

              <label>Remaining Term</label>
              <div className="flex items-center bg-white border border-gray-400">
                <input type="text" className="w-full px-1 py-0.5 outline-none" value={term} onChange={e => setTerm(e.target.value)} />
                <span className="px-2 bg-gray-100 border-l border-gray-400">years</span>
              </div>

              <label>Interest Rate</label>
              <div className="flex items-center bg-white border border-gray-400">
                <input type="text" className="w-full px-1 py-0.5 outline-none" value={rate} onChange={e => setRate(e.target.value)} />
                <span className="px-2 bg-gray-100 border-l border-gray-400">%</span>
              </div>

              <label>Monthly Payment</label>
              <div className="flex items-center bg-white border border-gray-400">
                <span className="px-2 bg-gray-100 border-r border-gray-400">$</span>
                <input type="text" className="w-full px-1 py-0.5 outline-none" value={payment} onChange={e => setPayment(e.target.value)} />
                <span className="px-2 bg-gray-100 border-l border-gray-400">/month</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 md:ml-[110px]">
              <button onClick={calculate} className="bg-[#306e3e] hover:bg-[#255630] text-white px-4 py-1 font-bold rounded shadow border border-[#1f4a27] flex items-center gap-1">
                Calculate <span className="bg-white text-[#306e3e] rounded-full w-3 h-3 flex items-center justify-center text-[8px]">▶</span>
              </button>
              <button onClick={clear} className="bg-[#aaaaaa] hover:bg-[#999999] text-white px-4 py-1 font-bold rounded shadow border border-[#888888]">
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="w-full md:flex-1">
            {results.error ? (
              <div className="p-4 border border-red-400 bg-red-50 text-red-800 rounded text-[13px]">{results.error}</div>
            ) : (
              <div className="font-sans text-[13px] text-gray-800">
                <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
                  <span className="text-[16px]">Result</span>
                  <Save size={16} />
                </div>
                <div className="bg-white border border-gray-300 border-t-0 p-4 leading-relaxed">
                  <div className="grid grid-cols-[120px_1fr] gap-y-1 text-[16px]">
                    <div>Repayment:</div>
                    <div className="font-bold text-[#599e28]">${results.pmt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}/month</div>
                    
                    <div>Total Interest:</div>
                    <div>${results.totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    
                    <div>Total Payments:</div>
                    <div>${results.totalPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
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
                          strokeDasharray={`${(results.principal / results.totalPayment) * 100} 100`} 
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
                        <div className="absolute top-4 left-4">{Math.round((results.principal / results.totalPayment) * 100)}%</div>
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
