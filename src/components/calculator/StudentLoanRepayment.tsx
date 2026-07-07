"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, Save } from 'lucide-react';

export function StudentLoanRepayment() {
  const [balance, setBalance] = useState("30,000");
  const [payment, setPayment] = useState("350");
  const [rate, setRate] = useState("6.8");
  
  const [option, setOption] = useState("extra");
  const [extraMonth, setExtraMonth] = useState("150");
  const [extraYear, setExtraYear] = useState("0");
  const [extraOnce, setExtraOnce] = useState("0");

  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    let p = parseFloat(balance.replace(/,/g, ''));
    let pmt = parseFloat(payment.replace(/,/g, ''));
    let r = parseFloat(rate) / 100 / 12;
    let extM = parseFloat(extraMonth.replace(/,/g, '')) || 0;
    let extY = parseFloat(extraYear.replace(/,/g, '')) || 0;
    let extO = parseFloat(extraOnce.replace(/,/g, '')) || 0;

    if (isNaN(p) || isNaN(pmt) || isNaN(r)) return;

    if (pmt <= p * r) {
      setResults({ error: "Your monthly payment must be higher than the monthly interest accumulation." });
      return;
    }

    // Function to simulate payoff
    const simulate = (principal: number, monthlyPayment: number, extMonth: number, extYear: number) => {
      let b = principal;
      let months = 0;
      let totalInt = 0;
      while (b > 0.001 && months < 1200) {
        months++;
        let int = b * r;
        totalInt += int;
        b += int;
        let currentPmt = monthlyPayment + extMonth;
        if (months % 12 === 0) currentPmt += extYear;
        let p = Math.min(currentPmt, b);
        b -= p;
      }
      return { months, totalInt, totalPayment: principal + totalInt };
    };

    const formatTime = (m: number) => {
      let y = Math.floor(m / 12);
      let mo = m % 12;
      if (y > 0 && mo > 0) return `${y} years and ${mo} months`;
      if (y > 0) return `${y} years`;
      return `${mo} months`;
    };

    let base = simulate(p, pmt, 0, 0);

    let current = null;
    let savings = 0;
    let timeSaved = 0;

    if (option === 'altogether') {
      current = { months: 0, totalInt: 0, totalPayment: p };
      savings = base.totalInt;
      timeSaved = base.months;
    } else if (option === 'normal') {
      current = base;
      savings = 0;
      timeSaved = 0;
    } else {
      let effectiveP = p - extO;
      if (effectiveP < 0) effectiveP = 0;
      current = simulate(effectiveP, pmt, extM, extY);
      savings = base.totalInt - current.totalInt;
      timeSaved = base.months - current.months;
    }

    setResults({
      base, current, savings, timeSaved, option, extM, extY, extO, formatTime
    });
  };

  const clear = () => {
    setBalance(""); setPayment(""); setRate(""); setExtraMonth(""); setExtraYear(""); setExtraOnce(""); setOption("normal"); setResults(null);
  };

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mb-8 mt-12 border-t pt-8">
      <h2 className="text-[20px] font-bold text-[#1c4587] mb-2 font-sans">Student Loan Repayment Calculator</h2>
      <p className="mb-2 text-[13px] text-gray-800">Use the calculator below to evaluate the student loan payoff options, as well as the interest to be saved. The remaining balance, monthly payment, and interest rate can be found on the monthly student loan bill.</p>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Form */}
        <div className="w-full md:w-[320px]">
          <div className="bg-[#f0f0f0] border border-gray-300 rounded text-[13px]">
            <div className="p-4 grid grid-cols-[110px_1fr] gap-y-2 items-center">
              
              <label>Loan Balance</label>
              <div className="flex items-center bg-white border border-gray-400">
                <span className="px-2 bg-gray-100 border-r border-gray-400">$</span>
                <input type="text" className="w-full px-1 py-0.5 outline-none" value={balance} onChange={e => setBalance(e.target.value)} />
              </div>

              <label>Monthly Payment</label>
              <div className="flex items-center bg-white border border-gray-400">
                <span className="px-2 bg-gray-100 border-r border-gray-400">$</span>
                <input type="text" className="w-full px-1 py-0.5 outline-none" value={payment} onChange={e => setPayment(e.target.value)} />
                <span className="px-2 bg-gray-100 border-l border-gray-400">/month</span>
              </div>

              <label>Interest Rate</label>
              <div className="flex items-center bg-white border border-gray-400">
                <input type="text" className="w-full px-1 py-0.5 outline-none" value={rate} onChange={e => setRate(e.target.value)} />
                <span className="px-2 bg-gray-100 border-l border-gray-400">%</span>
              </div>
            </div>

            <div className="border-t border-gray-300 p-4">
              <label className="font-bold mb-2 block">Repayment Options:</label>
              
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input type="radio" name="opt" checked={option === 'altogether'} onChange={() => setOption('altogether')} />
                Payoff altogether
              </label>
              
              <label className="flex items-start gap-2 mb-2 cursor-pointer">
                <input type="radio" name="opt" checked={option === 'extra'} onChange={() => setOption('extra')} className="mt-1" />
                <div>
                  <div>Repayment with extra payments</div>
                  <div className="grid grid-cols-[80px_1fr] gap-1 mt-1 items-center">
                    <div className="flex items-center bg-white border border-gray-400">
                      <span className="px-1 bg-gray-100 border-r border-gray-400">$</span>
                      <input type="text" className="w-full px-1 py-0.5 outline-none" value={extraMonth} onChange={e => setExtraMonth(e.target.value)} disabled={option !== 'extra'} />
                    </div>
                    <span>per month</span>

                    <div className="flex items-center bg-white border border-gray-400">
                      <span className="px-1 bg-gray-100 border-r border-gray-400">$</span>
                      <input type="text" className="w-full px-1 py-0.5 outline-none" value={extraYear} onChange={e => setExtraYear(e.target.value)} disabled={option !== 'extra'} />
                    </div>
                    <span>per year</span>

                    <div className="flex items-center bg-white border border-gray-400">
                      <span className="px-1 bg-gray-100 border-r border-gray-400">$</span>
                      <input type="text" className="w-full px-1 py-0.5 outline-none" value={extraOnce} onChange={e => setExtraOnce(e.target.value)} disabled={option !== 'extra'} />
                    </div>
                    <span>one time</span>
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input type="radio" name="opt" checked={option === 'normal'} onChange={() => setOption('normal')} />
                Normal repayment
              </label>

              <div className="flex gap-2">
                <button onClick={calculate} className="bg-[#306e3e] hover:bg-[#255630] text-white px-4 py-1 font-bold rounded shadow border border-[#1f4a27] flex items-center gap-1">
                  Calculate <span className="bg-white text-[#306e3e] rounded-full w-3 h-3 flex items-center justify-center text-[8px]">▶</span>
                </button>
                <button onClick={clear} className="bg-[#aaaaaa] hover:bg-[#999999] text-white px-4 py-1 font-bold rounded shadow border border-[#888888]">
                  Clear
                </button>
              </div>
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
                  <span className="text-[16px]">Pay off in {results.formatTime(results.current.months)}</span>
                  <Save size={16} />
                </div>
                <div className="bg-white border border-gray-300 border-t-0 p-4 leading-relaxed">
                  
                  {results.option === 'extra' && (
                    <p className="mb-4">
                      The remaining term of the loan is {results.formatTime(results.base.months)}. By paying an extra ${results.extM.toFixed(2)} per month, the loan will be paid off in {results.formatTime(results.current.months)}. It is <strong>{results.formatTime(results.timeSaved)} earlier</strong>. This results in savings of <strong>${results.savings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong> in interest payments.
                    </p>
                  )}
                  {results.option === 'normal' && (
                    <p className="mb-4">
                      The remaining term of the loan is {results.formatTime(results.base.months)}.
                    </p>
                  )}
                  {results.option === 'altogether' && (
                    <p className="mb-4">
                      By paying off the loan altogether, you save <strong>${results.savings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong> in interest.
                    </p>
                  )}

                  {results.option === 'extra' && (
                    <>
                      <h4 className="font-bold mb-1">If Pay Extra ${results.extM.toFixed(2)} per month</h4>
                      <table className="w-full text-left border-collapse mb-4">
                        <tbody>
                          <tr className="bg-gray-100 border-b border-white"><td className="p-1">Remaining Term</td><td className="p-1 text-right">{results.formatTime(results.current.months)}</td></tr>
                          <tr className="bg-gray-200 border-b border-white"><td className="p-1">Total Payments</td><td className="p-1 text-right">${results.current.totalPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td></tr>
                          <tr className="bg-gray-100"><td className="p-1">Total Interest</td><td className="p-1 text-right">${results.current.totalInt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td></tr>
                        </tbody>
                      </table>
                    </>
                  )}

                  <h4 className="font-bold mb-1">The Original Payoff Schedule</h4>
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      <tr className="bg-gray-100 border-b border-white"><td className="p-1">Remaining Term</td><td className="p-1 text-right">{results.formatTime(results.base.months)}</td></tr>
                      <tr className="bg-gray-200 border-b border-white"><td className="p-1">Total Payments</td><td className="p-1 text-right">${results.base.totalPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td></tr>
                      <tr className="bg-gray-100"><td className="p-1">Total Interest</td><td className="p-1 text-right">${results.base.totalInt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td></tr>
                    </tbody>
                  </table>

                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
