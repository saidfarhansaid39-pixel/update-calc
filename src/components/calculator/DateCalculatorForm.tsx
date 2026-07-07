'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function DateCalculatorForm() {
  const t = useTranslations('calculatorUI');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [includeEnd, setIncludeEnd] = useState<boolean>(true);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const days = includeEnd ? diffDays + 1 : diffDays;
    
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    
    const startDay = start.getDay();
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    setResult({ days, weeks, months, years, startDayName: weekdays[startDay], endDay: weekdays[end.getDay()] });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" /></div>
      </div>
      
      <div className="flex items-center gap-2">
        <input type="checkbox" id="includeEnd" checked={includeEnd} onChange={(e) => setIncludeEnd(e.target.checked)} className="w-4 h-4" />
        <label htmlFor="includeEnd" className="text-sm text-gray-700">Include end date in calculation</label>
      </div>

      <button onClick={calculate} className="bg-green-button text-white px-6 py-2 rounded">{t('buttons.calculate')}</button>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-bold text-lg text-gray-800 mb-3">Results</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded text-center"><p className="text-sm text-gray-500">Days</p><p className="text-2xl font-bold text-green-600">{result.days}</p></div>
            <div className="bg-white p-3 rounded text-center"><p className="text-sm text-gray-500">Weeks</p><p className="text-2xl font-bold">{result.weeks}</p></div>
            <div className="bg-white p-3 rounded text-center"><p className="text-sm text-gray-500">Months</p><p className="text-2xl font-bold">{result.months}</p></div>
            <div className="bg-white p-3 rounded text-center"><p className="text-sm text-gray-500">Years</p><p className="text-2xl font-bold">{(result.days/365).toFixed(1)}</p></div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>{result.startDayName} → {result.endDay}</p>
          </div>
        </div>
      )}
    </div>
  );
}
