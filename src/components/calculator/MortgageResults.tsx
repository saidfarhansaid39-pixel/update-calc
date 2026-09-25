"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';
import { AmortizationSchedule } from '@/components/calc-panel/AmortizationSchedule';
import { ResultInterpretation } from '@/components/calc-panel/ResultInterpretation';
import { ExampleSection } from '@/components/calc-panel/ExampleSection';
import { FormulaSection } from '@/components/calc-panel/FormulaSection';
import { RelatedCalculatorCarousel } from '@/components/premium/RelatedCalculatorCarousel';
import { InternalLinkingGrid } from '@/components/premium/InternalLinkingGrid';

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
  const locale = useLocale();
  const totalOutOfPocket = monthlyPayment + propertyTax + homeInsurance + otherCosts;
  const downPct = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;
  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + 360);
  const payoffDateStr = payoffDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

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
        <span className="text-xl">{formatCurrency(totalOutOfPocket, 'USD', locale)}</span>
      </div>

      <div className="p-2 border border-gray-300 border-t-0 bg-white space-y-4">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="p-1.5 text-left font-medium text-gray-500"></th>
              <th className="p-1.5 text-right font-medium text-gray-500">{t('results.monthlyPayment')}</th>
              <th className="p-1.5 text-right font-medium text-gray-500">{t('results.totalPayment')}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="p-1.5 text-left font-bold text-gray-700">Mortgage Payment</td>
              <td className="p-1.5 text-right font-bold text-gray-700">{formatCurrency(monthlyPayment, 'USD', locale)}</td>
              <td className="p-1.5 text-right text-gray-700">{formatCurrency(totalPayments, 'USD', locale)}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-1.5 text-left text-gray-600">Property Tax</td>
              <td className="p-1.5 text-right text-gray-600">{formatCurrency(propertyTax, 'USD', locale)}</td>
              <td className="p-1.5 text-right text-gray-600">{formatCurrency((propertyTax * 360), 'USD', locale)}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-1.5 text-left text-gray-600">Home Insurance</td>
              <td className="p-1.5 text-right text-gray-600">{formatCurrency(homeInsurance, 'USD', locale)}</td>
              <td className="p-1.5 text-right text-gray-600">{formatCurrency((homeInsurance * 360), 'USD', locale)}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="p-1.5 text-left text-gray-600">Other Costs</td>
              <td className="p-1.5 text-right text-gray-600">{formatCurrency(otherCosts, 'USD', locale)}</td>
              <td className="p-1.5 text-right text-gray-600">{formatCurrency((otherCosts * 360), 'USD', locale)}</td>
            </tr>
            <tr className="bg-gray-200 font-bold border-b border-gray-400">
              <td className="p-1.5 text-left text-gray-800">Total Out-of-Pocket</td>
              <td className="p-1.5 text-right text-gray-800">{formatCurrency(totalOutOfPocket, 'USD', locale)}</td>
              <td className="p-1.5 text-right text-red-600">{formatCurrency((totalPayments + (propertyTax+homeInsurance+otherCosts)*360), 'USD', locale)}</td>
            </tr>
          </tbody>
        </table>

        {/* Payoff summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">House Price</p>
            <p className="text-sm font-bold text-gray-900">{formatCurrency(homePrice, 'USD', locale)}</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">Down Payment</p>
            <p className="text-sm font-bold text-blue-600">{formatCurrency(downPayment, 'USD', locale)} ({downPct.toFixed(1)}%)</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">Total Interest</p>
            <p className="text-sm font-bold text-red-600">{formatCurrency(totalInterest, 'USD', locale)}</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-400">Payoff Date</p>
            <p className="text-sm font-bold text-gray-900">{payoffDateStr}</p>
          </div>
        </div>

        {/* Interpretation */}
        <ResultInterpretation
          type="mortgage"
          values={{
            monthlyPayment: totalOutOfPocket,
            totalPayments,
            totalInterest,
            principal: loanAmount,
            loanAmount,
            downPaymentPct: downPct,
            term: 30,
          }}
          currencySymbol="$"
        />

        {/* Chart */}
        <div className="flex items-center my-4">
          <div className="w-32 h-32 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1a5ec4" strokeWidth="20" strokeDasharray={`${(monthlyPayment / totalOutOfPocket) * 251.2} 251.2`} strokeDashoffset="0" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#90be5c" strokeWidth="20" strokeDasharray={`${(propertyTax / totalOutOfPocket) * 251.2} 251.2`} strokeDashoffset={`-${(monthlyPayment / totalOutOfPocket) * 251.2}`} />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ee8922" strokeWidth="20" strokeDasharray={`${(homeInsurance / totalOutOfPocket) * 251.2} 251.2`} strokeDashoffset={`-${((monthlyPayment + propertyTax) / totalOutOfPocket) * 251.2}`} />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1ca5b4" strokeWidth="20" strokeDasharray={`${(otherCosts / totalOutOfPocket) * 251.2} 251.2`} strokeDashoffset={`-${((monthlyPayment + propertyTax + homeInsurance) / totalOutOfPocket) * 251.2}`} />
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

        {/* Amortization */}
        <AmortizationSchedule
          principal={loanAmount}
          rate={6.5}
          term={30}
          periodsPerYear={12}
          currencySymbol="$"
        />
      </div>

      {/* Trust disclaimer for financial calculators */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Mortgage calculations use the standard amortization formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ] where M = monthly payment, P = loan principal, i = monthly interest rate, and n = number of payments. Results are estimates based on input values.
        </p>
        <p className="mt-2 text-[10px] font-medium px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          This calculator is for informational purposes only and not a substitute for professional financial advice. Consult a qualified financial advisor for personalized guidance.
        </p>
      </div>

      {/* Educational panels - seo.txt #22, #30-31 */}
      <ExampleSection
        calculationTitle="Mortgage Payment Calculation"
        formula="M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]"
        exampleInput={{ principal: 300000, annualInterestRate: 4.5, years: 30 }}
        exampleResult={{ monthlyPayment: 1520.06, totalPayment: 547221.76, totalInterest: 247221.76 }}
      />
      <FormulaSection
        formula="M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]"
        variables={{
          M: "Monthly mortgage payment",
          P: "Loan principal amount",
          i: "Monthly interest rate (annual rate ÷ 12)",
          n: "Total number of payments (years × 12)"
        }}
        description="Standard fixed-rate mortgage amortization formula. Calculates monthly payment based on principal, interest rate, and loan term."
      />
      <RelatedCalculatorCarousel
        currentCalcSlug="mortgage-calculator"
        hubSlug="financial-calculators"
      />
      <InternalLinkingGrid
        calculatorData={{ title: "Mortgage Calculator", hub: "financial-calculators", tier: "tier3" }}
      />
    </div>
  );
}
