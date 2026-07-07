'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { mean, median, mode, geometricMean } from '../../engines/statistics/averages';
import { sampleVariance, populationVariance, sampleStdDev, populationStdDev, bounds } from '../../engines/statistics/variance';

export default function StatisticsCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [dataInput, setDataInput] = useState<string>('10, 20, 30, 40, 50');
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const calculate = () => {
    setErrorMsg('');
    
    // Parse the input data
    const rawItems = dataInput.split(/[\s,]+/);
    const numbers: number[] = [];
    
    for (const item of rawItems) {
      const trimmed = item.trim();
      if (!trimmed) continue;
      const num = Number(trimmed);
      if (isNaN(num)) {
        setErrorMsg(`Invalid number found: "${trimmed}"`);
        return;
      }
      numbers.push(num);
    }

    if (numbers.length === 0) {
      setErrorMsg('Please enter at least one valid number.');
      return;
    }

    // Calculate all statistics
    const sorted = [...numbers].sort((a, b) => a - b);
    const b = bounds(sorted);
    const m = mean(sorted);
    const med = median(sorted);
    const md = mode(sorted);
    const gMean = geometricMean(sorted);
    
    const sVar = sampleVariance(sorted);
    const pVar = populationVariance(sorted);
    const sStd = sampleStdDev(sorted);
    const pStd = populationStdDev(sorted);

    setResult({
      count: sorted.length,
      sum: b.sum,
      mean: m,
      median: med,
      mode: md,
      geometricMean: gMean,
      min: b.min,
      max: b.max,
      range: b.range,
      sampleVariance: sVar,
      populationVariance: pVar,
      sampleStdDev: sStd,
      populationStdDev: pStd,
      sorted
    });
  };

  const handleClear = () => {
    setResult(null);
    setDataInput('');
    setErrorMsg('');
  };

  const formatNum = (num: number) => {
    if (isNaN(num)) return 'N/A';
    return Number(num.toPrecision(10)).toString(); // Remove trailing zeros but keep precision
  };

  return (
    <div className="bg-white border border-gray-300 shadow-sm mb-8">
      <div className="bg-blue-800 text-white p-2 font-bold text-lg">
        Statistics Calculator
      </div>
      
      <div className="p-4 md:p-6 text-sm">
        {errorMsg && <div className="text-red-600 font-bold mb-4">{errorMsg}</div>}

        <div className="space-y-4">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Enter data set (comma or space separated):</label>
            <textarea 
              rows={4}
              value={dataInput} 
              onChange={(e) => setDataInput(e.target.value)}
              className="w-full border border-gray-400 p-2 focus:border-blue-600 font-mono text-sm"
              placeholder="e.g. 1 2 3 4.5 6, 7"
            />
          </div>
          
          <div className="pt-2 flex space-x-4">
            <button onClick={calculate} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow">{t('buttons.calculate')}</button>
            <button onClick={handleClear} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded shadow">{t('buttons.clear')}</button>
          </div>

          {result && (
            <div className="mt-8">
              <h3 className="font-bold text-lg mb-2 text-gray-800 border-b pb-2">{t('sections.results')}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr className="border-b bg-gray-50"><th className="p-2 w-1/2">Count</th><td className="p-2 font-mono">{result.count}</td></tr>
                    <tr className="border-b"><th className="p-2">Sum</th><td className="p-2 font-mono">{formatNum(result.sum)}</td></tr>
                    <tr className="border-b bg-gray-50"><th className="p-2">Mean (Average)</th><td className="p-2 font-mono">{formatNum(result.mean)}</td></tr>
                    <tr className="border-b"><th className="p-2">Median</th><td className="p-2 font-mono">{formatNum(result.median)}</td></tr>
                    <tr className="border-b bg-gray-50"><th className="p-2">Mode</th><td className="p-2 font-mono">{result.mode.length > 0 ? result.mode.join(', ') : 'None'}</td></tr>
                    
                    <tr className="border-b"><th className="p-2">Largest</th><td className="p-2 font-mono">{formatNum(result.max)}</td></tr>
                    <tr className="border-b bg-gray-50"><th className="p-2">Smallest</th><td className="p-2 font-mono">{formatNum(result.min)}</td></tr>
                    <tr className="border-b"><th className="p-2">Range</th><td className="p-2 font-mono">{formatNum(result.range)}</td></tr>
                    
                    <tr className="border-b bg-gray-50"><th className="p-2">Geometric Mean</th><td className="p-2 font-mono">{formatNum(result.geometricMean)}</td></tr>
                    
                    <tr className="border-b"><th className="p-2">Sample Standard Deviation (s)</th><td className="p-2 font-mono">{formatNum(result.sampleStdDev)}</td></tr>
                    <tr className="border-b bg-gray-50"><th className="p-2">Sample Variance (s²)</th><td className="p-2 font-mono">{formatNum(result.sampleVariance)}</td></tr>
                    
                    <tr className="border-b"><th className="p-2">Population Standard Deviation (σ)</th><td className="p-2 font-mono">{formatNum(result.populationStdDev)}</td></tr>
                    <tr className="border-b bg-gray-50"><th className="p-2">Population Variance (σ²)</th><td className="p-2 font-mono">{formatNum(result.populationVariance)}</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4">
                <h4 className="font-bold text-gray-700">Sorted Data Set:</h4>
                <div className="bg-gray-100 p-2 mt-1 rounded font-mono text-xs break-all">
                  {result.sorted.join(', ')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
