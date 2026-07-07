"use client";

import React from 'react';

export function DebtConsolidationResults({ results }: any) {
  if (!results) return null;

  if (results.error) {
    return (
      <div className="w-full font-sans text-[13px] text-gray-800 mt-4 md:mt-0 p-4 border border-red-400 bg-red-50 text-red-800 rounded">
        <strong>Error:</strong> {results.error}
      </div>
    );
  }

  const { oldDebts, newLoan, savings } = results;

  const isRecommended = savings.totalInterest > 0;

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800 mt-4 md:mt-0">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
        <span className="text-[16px]">Results</span>
      </div>
      
      <div className="bg-white border border-gray-300 border-t-0 p-4 leading-relaxed">
        
        {isRecommended ? (
          <p className="mb-4 text-[16px]">
            Based on the details provided, consolidating your debts into a single loan will save you <strong className="text-[#599e28]">${savings.totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong> in total interest!
          </p>
        ) : (
          <p className="mb-4 text-[16px]">
            Based on the details provided, consolidating your debts will <strong className="text-red-600">cost you more</strong> over the long run. You will pay <strong className="text-red-600">${Math.abs(savings.totalInterest).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong> more in interest and fees.
          </p>
        )}

        <h3 className="font-bold text-[16px] text-black border-b pb-1 mb-2">Before Consolidation</h3>
        <div className="grid grid-cols-[1fr_auto] gap-y-1 mb-6">
          <div>Total combined debt:</div>
          <div className="font-bold text-right">${oldDebts.totalPrincipal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          
          <div>Combined monthly payments:</div>
          <div className="font-bold text-right">${oldDebts.monthlyPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          
          <div>Time to pay off:</div>
          <div className="font-bold text-right">{oldDebts.months} months</div>
          
          <div>Total interest paid:</div>
          <div className="font-bold text-right">${oldDebts.totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
        </div>

        <h3 className="font-bold text-[16px] text-black border-b pb-1 mb-2">After Consolidation</h3>
        <div className="grid grid-cols-[1fr_auto] gap-y-1 mb-6">
          <div>New loan amount:</div>
          <div className="font-bold text-right">${newLoan.principal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          
          <div>New monthly payment:</div>
          <div className="font-bold text-right text-[#1c4587]">${newLoan.monthlyPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          
          <div>Time to pay off:</div>
          <div className="font-bold text-right">{newLoan.months} months</div>
          
          <div>Total interest & fees paid:</div>
          <div className="font-bold text-right">${newLoan.totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          
          {newLoan.fee > 0 && (
            <>
              <div className="text-gray-500 pl-4 text-xs">- Includes upfront fee:</div>
              <div className="text-gray-500 text-right text-xs">${newLoan.fee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </>
          )}
        </div>

        <h3 className="font-bold text-[16px] text-black border-b pb-1 mb-2">The Difference</h3>
        <div className="grid grid-cols-[1fr_auto] gap-y-1">
          <div>Monthly payment difference:</div>
          <div className={`font-bold text-right ${savings.monthlyPayment > 0 ? 'text-[#599e28]' : savings.monthlyPayment < 0 ? 'text-red-600' : ''}`}>
            {savings.monthlyPayment > 0 ? 'Save ' : (savings.monthlyPayment < 0 ? 'Pay Extra ' : '')}
            ${Math.abs(savings.monthlyPayment).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </div>
          
          <div>Total cost difference:</div>
          <div className={`font-bold text-right ${savings.totalInterest > 0 ? 'text-[#599e28]' : savings.totalInterest < 0 ? 'text-red-600' : ''}`}>
            {savings.totalInterest > 0 ? 'Save ' : (savings.totalInterest < 0 ? 'Cost Extra ' : '')}
            ${Math.abs(savings.totalInterest).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </div>
          
          <div>Time difference:</div>
          <div className="font-bold text-right">
            {savings.months > 0 ? `Pay off ${savings.months} months sooner` : (savings.months < 0 ? `Take ${Math.abs(savings.months)} months longer` : 'Same payoff time')}
          </div>
        </div>

      </div>
    </div>
  );
}
