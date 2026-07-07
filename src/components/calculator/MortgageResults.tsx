"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

export function MortgageResults({ 
  homePrice, 
  loanAmount, 
  downPayment, 
  monthlyPayment,
  totalPayments,
  totalInterest,
  propertyTax,
  homeInsurance,
  otherCosts
}: any) {
  const t = useTranslations('calculatorUI');
  const totalOutOfPocket = monthlyPayment + propertyTax + homeInsurance + otherCosts;
  
  const data = [
    { name: 'Principal & Interest', value: monthlyPayment, color: '#1a5ec4' },
    { name: 'Property Taxes', value: propertyTax, color: '#90be5c' },
    { name: 'Home Insurance', value: homeInsurance, color: '#ee8922' },
    { name: 'Other Cost', value: otherCosts, color: '#1ca5b4' },
  ];

  return (
    <div className="w-full flex flex-col font-sans">
      <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center rounded-t border border-[#3b7b13]">
        <span>{t('results.monthlyPayLabel')}</span>
        <span className="text-xl">${totalOutOfPocket.toFixed(2)}</span>
      </div>
      
      <table className="w-full text-sm border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="p-1 text-left"></th>
            <th className="p-1 text-right">{t('results.monthlyPayment')}</th>
            <th className="p-1 text-right">{t('results.totalPayment')}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="p-1 text-left font-bold">Mortgage Payment</td>
            <td className="p-1 text-right font-bold">${monthlyPayment.toFixed(2)}</td>
            <td className="p-1 text-right">${totalPayments.toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="p-1 text-left">Property Tax</td>
            <td className="p-1 text-right">${propertyTax.toFixed(2)}</td>
            <td className="p-1 text-right">${(propertyTax * 360).toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="p-1 text-left">Home Insurance</td>
            <td className="p-1 text-right">${homeInsurance.toFixed(2)}</td>
            <td className="p-1 text-right">${(homeInsurance * 360).toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-1 text-left">Other Costs</td>
            <td className="p-1 text-right">${otherCosts.toFixed(2)}</td>
            <td className="p-1 text-right">${(otherCosts * 360).toFixed(2)}</td>
          </tr>
          <tr className="bg-gray-200 font-bold border-b border-gray-400">
            <td className="p-1 text-left">Total Out-of-Pocket</td>
            <td className="p-1 text-right">${totalOutOfPocket.toFixed(2)}</td>
            <td className="p-1 text-right">${(totalPayments + (propertyTax+homeInsurance+otherCosts)*360).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex items-center my-4">
        <div className="w-32 h-32 relative">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {/* Principal & Interest */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1a5ec4" strokeWidth="20" strokeDasharray={`${(monthlyPayment / totalOutOfPocket) * 251.2} 251.2`} strokeDashoffset="0" />
            {/* Property Taxes */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#90be5c" strokeWidth="20" strokeDasharray={`${(propertyTax / totalOutOfPocket) * 251.2} 251.2`} strokeDashoffset={`-${(monthlyPayment / totalOutOfPocket) * 251.2}`} />
            {/* Home Insurance */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ee8922" strokeWidth="20" strokeDasharray={`${(homeInsurance / totalOutOfPocket) * 251.2} 251.2`} strokeDashoffset={`-${((monthlyPayment + propertyTax) / totalOutOfPocket) * 251.2}`} />
            {/* Other Costs */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1ca5b4" strokeWidth="20" strokeDasharray={`${(otherCosts / totalOutOfPocket) * 251.2} 251.2`} strokeDashoffset={`-${((monthlyPayment + propertyTax + homeInsurance) / totalOutOfPocket) * 251.2}`} />
            {/* Inner white circle for donut effect */}
            <circle cx="50" cy="50" r="30" fill="white" />
          </svg>
        </div>
        <div className="flex flex-col text-xs space-y-1 ml-4">
          {data.map(item => (
            <div key={item.name} className="flex items-center">
              <div className="w-3 h-3 mr-2" style={{backgroundColor: item.color}}></div>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <table className="w-full text-sm border-collapse">
        <tbody>
          <tr className="border-b border-gray-200 bg-gray-100">
            <td className="p-1 text-left">House Price</td>
            <td className="p-1 text-right">${homePrice.toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="p-1 text-left">Loan Amount</td>
            <td className="p-1 text-right">${loanAmount.toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-200 bg-gray-100">
            <td className="p-1 text-left">Down Payment</td>
            <td className="p-1 text-right">${downPayment.toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="p-1 text-left">Total of 360 Mortgage Payments</td>
            <td className="p-1 text-right">${totalPayments.toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-200 bg-gray-100">
            <td className="p-1 text-left">Total Interest</td>
            <td className="p-1 text-right">${totalInterest.toFixed(2)}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="p-1 text-left">Mortgage Payoff Date</td>
            <td className="p-1 text-right">May. 2056</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
