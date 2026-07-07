'use client';

import React, { useState } from 'react';
import { parseDate } from '../../engines/datetime/parsing';
import { diffToComponents, diffInDays } from '../../engines/datetime/durations';
import { formatShortDate } from '../../engines/datetime/formatting';
import { useTranslations } from 'next-intl';

export default function AgeCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [dobStr, setDobStr] = useState<string>('01/01/1990');
  const [targetDateStr, setTargetDateStr] = useState<string>(formatShortDate(new Date()));
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const calculateAge = () => {
    setErrorMsg('');
    const d1 = parseDate(dobStr);
    const d2 = parseDate(targetDateStr);
    
    if (!d1 || !d2) {
      setErrorMsg('Please enter valid dates (e.g. MM/DD/YYYY)');
      return;
    }

    if (d1 > d2) {
      setErrorMsg('Date of birth must be before the target date.');
      return;
    }

    const comps = diffToComponents(d1, d2);
    const totalDays = diffInDays(d1, d2);
    
    // Calculate weeks roughly (as standard age calcs do)
    const weeks = Math.floor(totalDays / 7);
    const daysRemainder = totalDays % 7;
    
    // Half years etc can be approximated
    const monthsTotal = (comps.years * 12) + comps.months;

    setResult({
      components: comps,
      totalDays,
      weeks,
      daysRemainder,
      monthsTotal
    });
  };

  const handleClear = () => {
    setResult(null);
    setErrorMsg('');
    setDobStr('');
  };

  return (
    <div className="bg-white border border-gray-300 shadow-sm mb-8">
      <div className="bg-blue-800 text-white p-2 font-bold text-lg">
        Age Calculator
      </div>
      
      <div className="p-4 md:p-6 text-sm">
        {errorMsg && <div className="text-red-600 font-bold mb-4">{errorMsg}</div>}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Date of Birth:</label>
              <input 
                type="text" 
                value={dobStr} 
                onChange={(e) => setDobStr(e.target.value)}
                className="w-full border border-gray-400 p-2 focus:border-blue-600"
                placeholder="MM/DD/YYYY"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Age at the Date of:</label>
              <input 
                type="text" 
                value={targetDateStr} 
                onChange={(e) => setTargetDateStr(e.target.value)}
                className="w-full border border-gray-400 p-2 focus:border-blue-600"
                placeholder="MM/DD/YYYY"
              />
            </div>
          </div>
          
          <div className="pt-2 flex space-x-4">
            <button onClick={calculateAge} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow">{t('buttons.calculate')}</button>
            <button onClick={handleClear} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded shadow">Clear</button>
          </div>

          {result && (
            <div className="mt-6 bg-green-50 border border-green-200 p-4">
              <h3 className="font-bold text-lg mb-2 text-green-900">Result:</h3>
              <div className="space-y-2 text-green-800">
                <p className="font-bold text-xl text-green-900 mb-3">
                  Age: {result.components.years} years {result.components.months} months {result.components.days} days
                </p>
                <p>or {result.monthsTotal} months {result.components.days} days</p>
                <p>or {result.weeks} weeks {result.daysRemainder} days</p>
                <p>or {result.totalDays} days</p>
                <p>or {result.totalDays * 24} hours</p>
                <p>or {result.totalDays * 24 * 60} minutes</p>
                <p>or {result.totalDays * 24 * 60 * 60} seconds</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
