"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

export function PaymentResults({ 
  loanAmount, 
  totalPayments,
  totalInterest,
  monthlyPayment,
  numMonths
}: any) {
  const t = useTranslations('calculatorUI');
  const principalPercent = (loanAmount / totalPayments) * 100 || 0;
  const interestPercent = (totalInterest / totalPayments) * 100 || 0;
  const dashPrincipal = (principalPercent / 100) * 251.2;
  const dashInterest = (interestPercent / 100) * 251.2;

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
        <span>{t('results.monthlyPayLabel')}</span>
        <span className="text-xl">${monthlyPayment.toFixed(2)}</span>
      </div>
      
      <div className="p-2 border border-gray-300 border-t-0 bg-white">
        <p className="mb-2">You will need to pay ${monthlyPayment.toFixed(2)} every month for {(numMonths / 12).toFixed(1).replace('.0', '')} years to payoff the debt.</p>
        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr className="border-b border-t border-gray-200 bg-gray-50">
              <td className="p-1 text-left">{t('results.totalOfPayments', { count: numMonths })}</td>
              <td className="p-1 text-right">${totalPayments.toFixed(2)}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-1 text-left">{t('results.totalInterest')}</td>
              <td className="p-1 text-right">${totalInterest.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-center items-center my-6">
          <div className="w-24 h-24 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1a5ec4" strokeWidth="20" strokeDasharray={`${dashPrincipal} 251.2`} strokeDashoffset="0" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#90be5c" strokeWidth="20" strokeDasharray={`${dashInterest} 251.2`} strokeDashoffset={`-${dashPrincipal}`} />
              <circle cx="50" cy="50" r="30" fill="white" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-gray-600">
              {Math.round(principalPercent)}%
            </div>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-white" style={{transform: 'translate(-25px, -15px)'}}>
              {Math.round(interestPercent)}%
            </div>
          </div>
          <div className="flex flex-col text-xs space-y-1 ml-4 font-bold">
            <div className="flex items-center">
              <div className="w-3 h-3 mr-2 bg-[#1a5ec4]"></div>
              <span>{t('results.principal')}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-2 bg-[#90be5c]"></div>
              <span>{t('results.interest')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
