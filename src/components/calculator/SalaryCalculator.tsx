"use client";

import React, { useState, useEffect } from 'react';
import { SalaryForm } from '@/components/calculator/SalaryForm';
import { SalaryResults } from '@/components/calculator/SalaryResults';
import { SalaryArticle } from '@/components/calculator/SalaryArticle';

export function SalaryCalculator() {
  const [salaryAmount, setSalaryAmount] = useState("50");
  const [salaryType, setSalaryType] = useState("Hour");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [daysPerWeek, setDaysPerWeek] = useState("5");
  const [holidaysPerYear, setHolidaysPerYear] = useState("10");
  const [vacationDaysPerYear, setVacationDaysPerYear] = useState("15");
  const [results, setResults] = useState<any>(null);

  const state = { salaryAmount, salaryType, hoursPerWeek, daysPerWeek, holidaysPerYear, vacationDaysPerYear };
  const setters = { setSalaryAmount, setSalaryType, setHoursPerWeek, setDaysPerWeek, setHolidaysPerYear, setVacationDaysPerYear };

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
    
    // Convert everything to an hourly rate first based on the unadjusted assumption
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
        hourly: hourlyRate, // Hourly rate doesn't change
        daily: daily,       // Daily rate doesn't change
        weekly: weeklyAdjusted,
        biWeekly: biWeeklyAdjusted,
        semiMonthly: semiMonthlyAdjusted,
        monthly: monthlyAdjusted,
        quarterly: quarterlyAdjusted,
        annual: annualAdjusted
      }
    });
  };

  // Run calculation on mount to show initial state matching the screenshot perfectly
  useEffect(() => {
    calculate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-[800px] mx-auto bg-white p-2 md:p-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2 border-b pb-1">
        <div>home / financial / salary calculator</div>
      </div>
      
      <h1 className="text-[26px] font-bold text-gray-800 mb-4 font-sans">Salary Calculator</h1>
      <p className="mb-4 text-[13px] text-gray-800 leading-relaxed">
        The Salary Calculator converts salary amounts to their corresponding values based on payment frequency. Examples of payment frequencies include biweekly, semi-monthly, or monthly payments. Results include unadjusted figures and adjusted figures that account for vacation days and holidays per year.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <SalaryForm 
            state={state} 
            setters={setters} 
            handleCalculate={calculate}
            handleClear={handleClear}
          />
        </div>
        <div>
          <SalaryResults results={results} />
        </div>
      </div>

      <SalaryArticle />
    </div>
  );
}
