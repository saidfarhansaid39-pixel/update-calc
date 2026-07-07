"use client";

import React, { useState } from 'react';
import { DebtConsolidationForm } from '@/components/calculator/DebtConsolidationForm';
import { DebtConsolidationResults } from '@/components/calculator/DebtConsolidationResults';
import { DebtConsolidationArticle } from '@/components/calculator/DebtConsolidationArticle';

export function DebtConsolidationCalculator() {
  const [cards, setCards] = useState([
    { name: "Credit card 1", balance: "10,000", payment: "260", rate: "17.99" },
    { name: "Credit card 2", balance: "7,500", payment: "190", rate: "19.99" },
    { name: "High interest debt", balance: "6,500", payment: "180", rate: "18.99" },
    { name: "", balance: "", payment: "", rate: "" },
    { name: "", balance: "", payment: "", rate: "" },
    { name: "", balance: "", payment: "", rate: "" }
  ]);

  const [loanAmount, setLoanAmount] = useState("25,000");
  const [loanRate, setLoanRate] = useState("10.99");
  const [loanYears, setLoanYears] = useState("5");
  const [loanMonths, setLoanMonths] = useState("0");
  const [loanFee, setLoanFee] = useState("5");
  const [loanFeeType, setLoanFeeType] = useState("%");

  const [results, setResults] = useState<any>(null);

  const state = { cards, loanAmount, loanRate, loanYears, loanMonths, loanFee, loanFeeType };
  const setters = { setCards, setLoanAmount, setLoanRate, setLoanYears, setLoanMonths, setLoanFee, setLoanFeeType };

  const handleClear = () => {
    setCards([
      { name: "Credit card 1", balance: "", payment: "", rate: "" },
      { name: "Credit card 2", balance: "", payment: "", rate: "" },
      { name: "High interest debt", balance: "", payment: "", rate: "" },
      { name: "", balance: "", payment: "", rate: "" },
      { name: "", balance: "", payment: "", rate: "" },
      { name: "", balance: "", payment: "", rate: "" }
    ]);
    setLoanAmount("");
    setLoanRate("");
    setLoanYears("");
    setLoanMonths("");
    setLoanFee("");
    setResults(null);
  };

  const calculate = () => {
    const activeDebts = cards
      .map((c, i) => ({
        id: i,
        balance: parseFloat(c.balance.replace(/,/g, '')) || 0,
        payment: parseFloat(c.payment.replace(/,/g, '')) || 0,
        rate: (parseFloat(c.rate) || 0) / 100
      }))
      .filter(c => c.balance > 0);

    if (activeDebts.length === 0) {
      setResults({ error: "Please enter at least one debt with a balance." });
      return;
    }

    let oldTotalPrincipal = 0;
    let oldTotalPayment = 0;
    let oldTotalInterest = 0;
    let oldMaxMonths = 0;

    for (const debt of activeDebts) {
      let b = debt.balance;
      let pmt = debt.payment;
      let r = debt.rate / 12;

      oldTotalPrincipal += b;
      oldTotalPayment += pmt;

      if (pmt <= b * r) {
        setResults({ error: "One of your current debts has a payment lower than the monthly interest. It will never be paid off." });
        return;
      }

      let months = 0;
      let debtInterest = 0;
      while (b > 0.001 && months < 1200) {
        months++;
        let int = b * r;
        debtInterest += int;
        b += int;
        let p = Math.min(pmt, b);
        b -= p;
      }

      oldTotalInterest += debtInterest;
      if (months > oldMaxMonths) oldMaxMonths = months;
    }

    let lPrincipal = parseFloat(loanAmount.replace(/,/g, '')) || 0;
    let lRate = (parseFloat(loanRate) || 0) / 100 / 12;
    let lY = parseInt(loanYears) || 0;
    let lM = parseInt(loanMonths) || 0;
    let lTotalMonths = (lY * 12) + lM;
    let lFeeVal = parseFloat(loanFee) || 0;
    
    if (lPrincipal <= 0 || lTotalMonths <= 0) {
      setResults({ error: "Please provide a valid loan amount and term." });
      return;
    }

    let fee = 0;
    if (loanFeeType === '%') {
      fee = lPrincipal * (lFeeVal / 100);
    } else {
      fee = lFeeVal;
    }

    let lPmt = 0;
    if (lRate === 0) {
      lPmt = lPrincipal / lTotalMonths;
    } else {
      lPmt = lPrincipal * (lRate * Math.pow(1 + lRate, lTotalMonths)) / (Math.pow(1 + lRate, lTotalMonths) - 1);
    }

    let newTotalInterest = (lPmt * lTotalMonths) - lPrincipal;
    let newTotalCost = newTotalInterest + fee;

    setResults({
      oldDebts: {
        totalPrincipal: oldTotalPrincipal,
        monthlyPayment: oldTotalPayment,
        months: oldMaxMonths,
        totalInterest: oldTotalInterest
      },
      newLoan: {
        principal: lPrincipal,
        monthlyPayment: lPmt,
        months: lTotalMonths,
        totalCost: newTotalCost,
        fee: fee
      },
      savings: {
        monthlyPayment: oldTotalPayment - lPmt,
        totalInterest: oldTotalInterest - newTotalCost,
        months: oldMaxMonths - lTotalMonths
      }
    });
  };

  return (
    <div className="max-w-[800px] mx-auto bg-white p-2 md:p-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2 border-b pb-1">
        <div>home / financial / debt consolidation calculator</div>
      </div>
      
      <h1 className="text-[26px] font-bold text-gray-800 mb-4 font-sans">Debt Consolidation Calculator</h1>
      <p className="mb-4 text-[13px] text-gray-800 leading-relaxed">
        The Debt Consolidation Calculator can determine whether it is financially rewarding to consolidate debts by comparing the APR (Annual Percentage Rate) of the combined debts with that of the consolidation loan. APR is the fee-adjusted financial cost of a loan, providing a more accurate basis for loan comparisons. The calculated results will also display comparisons such as the monthly payment, payoff length, and total interest.
      </p>

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="flex-1">
          <DebtConsolidationForm 
            state={state} 
            setters={setters} 
            handleCalculate={calculate}
            handleClear={handleClear}
          />
        </div>
        <div className="w-full md:w-[350px]">
          <DebtConsolidationResults results={results} />
        </div>
      </div>

      <DebtConsolidationArticle />
    </div>
  );
}
