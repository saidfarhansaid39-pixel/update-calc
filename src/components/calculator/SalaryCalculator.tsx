"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Clock, Calendar, Wallet, DollarSign } from 'lucide-react';
import { SalaryForm } from '@/components/calculator/SalaryForm';
import { SalaryResults } from '@/components/calculator/SalaryResults';
import { PremiumCalculatorShell } from '@/components/premium/PremiumCalculatorShell.dynamic';
import { SubCalcPanel, SubCalcGrid } from '@/components/premium/SubCalcPanel';
import { formatCurrency } from '@/lib/i18n/calculator-i18n';

const calcMeta = {
  slug: 'salary-calculator',
  title: 'Salary Calculator',
  description: 'The Salary Converter converts salary amounts to their corresponding values based on payment frequency. Results include unadjusted figures and adjusted figures that account for vacation days and holidays per year.',
  tier: 'tier2',
  category: 'financial',
  hubSlug: 'financial-calculators',
  hubName: 'Financial Calculators',
  keywords: ['salary', 'wage', 'hourly', 'annual', 'take-home pay'],
};

export function SalaryCalculator() {
  const locale = useLocale();
  const [salaryAmount, setSalaryAmount] = useState("50");
  const [salaryType, setSalaryType] = useState("Hour");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [daysPerWeek, setDaysPerWeek] = useState("5");
  const [holidaysPerYear, setHolidaysPerYear] = useState("10");
  const [vacationDaysPerYear, setVacationDaysPerYear] = useState("15");
  const [stateTaxRate, setStateTaxRate] = useState("5");
  const [results, setResults] = useState<any>(null);

  const state = { salaryAmount, salaryType, hoursPerWeek, daysPerWeek, holidaysPerYear, vacationDaysPerYear, stateTaxRate };
  const setters = { setSalaryAmount, setSalaryType, setHoursPerWeek, setDaysPerWeek, setHolidaysPerYear, setVacationDaysPerYear, setStateTaxRate };

  const handleClear = () => {
    setSalaryAmount("");
    setHoursPerWeek("");
    setDaysPerWeek("");
    setHolidaysPerYear("");
    setVacationDaysPerYear("");
    setResults(null);
  };

  const calculate = () => {
    const amount = parseFloat(salaryAmount) || 0;
    const hpw = parseFloat(hoursPerWeek) || 0;
    const dpw = parseFloat(daysPerWeek) || 0;
    const hpy = parseFloat(holidaysPerYear) || 0;
    const vpy = parseFloat(vacationDaysPerYear) || 0;

    let hourlyRate = 0;
    
    const hoursPerYearUnadjusted = hpw * 52;
    const daysPerYearUnadjusted = dpw * 52;
    const hoursPerDay = dpw > 0 ? hpw / dpw : 0;

    if (salaryType === "Hour") hourlyRate = amount;
    else if (salaryType === "Day") hourlyRate = amount / hoursPerDay;
    else if (salaryType === "Week") hourlyRate = amount / hpw;
    else if (salaryType === "Bi-week") hourlyRate = amount / (hpw * 2);
    else if (salaryType === "Semi-month") hourlyRate = amount / (hoursPerYearUnadjusted / 24);
    else if (salaryType === "Month") hourlyRate = amount / (hoursPerYearUnadjusted / 12);
    else if (salaryType === "Quarter") hourlyRate = amount / (hoursPerYearUnadjusted / 4);
    else if (salaryType === "Year") hourlyRate = amount / hoursPerYearUnadjusted;

    const daily = hourlyRate * hoursPerDay;
    const weekly = hourlyRate * hpw;
    const annualUnadjusted = weekly * 52;
    const biWeeklyUnadjusted = annualUnadjusted / 26;
    const semiMonthlyUnadjusted = annualUnadjusted / 24;
    const monthlyUnadjusted = annualUnadjusted / 12;
    const quarterlyUnadjusted = annualUnadjusted / 4;

    const workingDaysAdjusted = (dpw * 52) - hpy - vpy;
    const annualAdjusted = daily * workingDaysAdjusted;
    const weeklyAdjusted = annualAdjusted / 52;
    const biWeeklyAdjusted = annualAdjusted / 26;
    const semiMonthlyAdjusted = annualAdjusted / 24;
    const monthlyAdjusted = annualAdjusted / 12;
    const quarterlyAdjusted = annualAdjusted / 4;

    const stdDeduction = 14600;
    const ficaRate = 0.0765;
    const taxableIncome = Math.max(0, annualAdjusted - stdDeduction);
    const fedBrackets: [number, number][] = [[11600, 0.1], [47150, 0.12], [100525, 0.22], [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37]];
    let fedTax = 0;
    let prevThreshold = 0;
    let marginalRate = 0;
    for (const [threshold, rate] of fedBrackets) {
      if (taxableIncome > prevThreshold) {
        const taxableInBracket = Math.min(taxableIncome, threshold) - prevThreshold;
        fedTax += taxableInBracket * rate;
      }
      if (taxableIncome <= threshold) { marginalRate = rate; break; }
      prevThreshold = threshold;
    }
    const stTax = annualAdjusted * (parseFloat(stateTaxRate || '0') / 100);
    const ficaTax = annualAdjusted * ficaRate;
    const totalTax = fedTax + stTax + ficaTax;
    const netAnnual = annualAdjusted - totalTax;
    const effectiveRate = annualAdjusted > 0 ? (totalTax / annualAdjusted) * 100 : 0;
    const netMonthly = netAnnual / 12;
    const netBiWeekly = netAnnual / 26;
    const netWeekly = netAnnual / 52;

    setResults({
      unadjusted: {
        hourly: hourlyRate,
        daily: daily,
        weekly: weekly,
        biWeekly: biWeeklyUnadjusted,
        semiMonthly: semiMonthlyUnadjusted,
        monthly: monthlyUnadjusted,
        quarterly: quarterlyUnadjusted,
        annual: annualUnadjusted
      },
      adjusted: {
        hourly: hourlyRate,
        daily: daily,
        weekly: weeklyAdjusted,
        biWeekly: biWeeklyAdjusted,
        semiMonthly: semiMonthlyAdjusted,
        monthly: monthlyAdjusted,
        quarterly: quarterlyAdjusted,
        annual: annualAdjusted
      },
      taxDetails: {
        taxableIncome,
        fedTax,
        stTax,
        ficaTax,
        totalTax,
        netAnnual,
        effectiveRate: effectiveRate.toFixed(1),
        marginalRate: (marginalRate * 100).toFixed(0),
        netMonthly,
        netBiWeekly,
        netWeekly,
      }
    });
  };

  useEffect(() => {
    calculate();
  }, []);

  const inputs = useMemo(() => ({
    salaryAmount,
    salaryType,
    hoursPerWeek,
    daysPerWeek,
    holidaysPerYear,
    vacationDaysPerYear,
  }), [salaryAmount, salaryType, hoursPerWeek, daysPerWeek, holidaysPerYear, vacationDaysPerYear]);

  const subCalcs = useMemo(() => {
    const adj = results?.adjusted;
    const unadj = results?.unadjusted;
    const tax = results?.taxDetails;
    if (!adj || !unadj || !tax) return null;

    const benefitCosts = adj.annual * 0.30;

    return (
      <SubCalcGrid>
        <SubCalcPanel title="Hourly Rate" icon={Clock} results={[
          { label: 'Hourly Rate', value: formatCurrency(unadj.hourly, 'USD', locale), badge: 'info' },
        ]} />
        <SubCalcPanel title="Pay Periods (Adjusted)" icon={Calendar} results={[
          { label: 'Weekly', value: formatCurrency(adj.weekly, 'USD', locale) },
          { label: 'Bi-Weekly', value: formatCurrency(adj.biWeekly, 'USD', locale) },
          { label: 'Monthly', value: formatCurrency(adj.monthly, 'USD', locale) },
          { label: 'Annual', value: formatCurrency(adj.annual, 'USD', locale) },
        ]} />
        <SubCalcPanel title="Tax Breakdown" icon={DollarSign} results={[
          { label: 'Federal Income Tax', value: formatCurrency(tax.fedTax, 'USD', locale) },
          { label: 'FICA (7.65%)', value: formatCurrency(tax.ficaTax, 'USD', locale) },
          { label: 'State Tax', value: formatCurrency(tax.stTax, 'USD', locale) },
          { label: 'Total Tax', value: formatCurrency(tax.totalTax, 'USD', locale), badge: 'negative' },
          { label: 'Effective Tax Rate', value: `${tax.effectiveRate}%` },
          { label: 'Marginal Tax Rate', value: `${tax.marginalRate}%` },
        ]} />
        <SubCalcPanel title="Take-Home Pay" icon={Wallet} results={[
          { label: 'Net Annual', value: formatCurrency(tax.netAnnual, 'USD', locale), badge: 'positive' },
          { label: 'Net Monthly', value: formatCurrency(tax.netMonthly, 'USD', locale) },
          { label: 'Net Bi-Weekly', value: formatCurrency(tax.netBiWeekly, 'USD', locale) },
          { label: 'Net Weekly', value: formatCurrency(tax.netWeekly, 'USD', locale) },
          { label: 'Benefit Cost Est. (30%)', value: formatCurrency(benefitCosts, 'USD', locale) },
        ]} />
      </SubCalcGrid>
    );
  }, [results, locale]);

  const result = results ? <SalaryResults results={results} /> : null;

  return (
    <PremiumCalculatorShell
      calculator={calcMeta}
      form={<SalaryForm state={state} setters={setters} handleCalculate={calculate} handleClear={handleClear} />}
      result={result}
      subCalcs={subCalcs}
      mainValue={results?.adjusted?.annual || 0}
      inputs={inputs}
    />
  );
}
