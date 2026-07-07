'use client';

import React, { useState, useEffect } from 'react';
import { Input, Select, Button, FormGroup, FormPanel } from '@/components/CalculatorFormElements';
import { CompactTable, CompactTableHeader, CompactTableBody, CompactTh, CompactTr, CompactTd } from '@/components/TableElements';

export function PregnancyForm() {
  const [calcMethod, setCalcMethod] = useState<'lmp' | 'conception' | 'due'>('lmp');
  
  const today = new Date();
  const [inputDate, setInputDate] = useState(today.toISOString().split('T')[0]);
  const [cycleLength, setCycleLength] = useState(28);

  const [results, setResults] = useState<any>(null);

  const handleCalculate = () => {
    const dateObj = new Date(inputDate);
    // Fix timezone offset issues with simple dates
    dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
    
    let dueDate = new Date();
    let conceptionDate = new Date();
    let lmpDate = new Date();

    if (calcMethod === 'lmp') {
      lmpDate = new Date(dateObj);
      // Naegele's rule adjusted for cycle length
      const adjustedDays = 280 + (cycleLength - 28);
      dueDate = new Date(lmpDate);
      dueDate.setDate(dueDate.getDate() + adjustedDays);
      
      conceptionDate = new Date(lmpDate);
      conceptionDate.setDate(conceptionDate.getDate() + 14 + (cycleLength - 28));
    } else if (calcMethod === 'conception') {
      conceptionDate = new Date(dateObj);
      dueDate = new Date(conceptionDate);
      dueDate.setDate(dueDate.getDate() + 266);
      
      lmpDate = new Date(conceptionDate);
      lmpDate.setDate(lmpDate.getDate() - 14);
    } else if (calcMethod === 'due') {
      dueDate = new Date(dateObj);
      conceptionDate = new Date(dueDate);
      conceptionDate.setDate(conceptionDate.getDate() - 266);
      
      lmpDate = new Date(conceptionDate);
      lmpDate.setDate(lmpDate.getDate() - 14);
    }

    const endTrimester1 = new Date(lmpDate);
    endTrimester1.setDate(endTrimester1.getDate() + (12 * 7));

    const endTrimester2 = new Date(lmpDate);
    endTrimester2.setDate(endTrimester2.getDate() + (27 * 7));

    // Calculate gestational age
    const now = new Date();
    now.setHours(0,0,0,0);
    const diffTime = Math.abs(now.getTime() - lmpDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let gestAge = '';
    if (now < lmpDate) {
      gestAge = 'Not pregnant yet';
    } else if (now > dueDate) {
      gestAge = 'Past due date';
    } else {
      const weeks = Math.floor(diffDays / 7);
      const days = diffDays % 7;
      gestAge = `${weeks} weeks, ${days} days`;
    }

    const formatDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

    setResults({
      dueDate: formatDate(dueDate),
      conceptionDate: formatDate(conceptionDate),
      endTrimester1: formatDate(endTrimester1),
      endTrimester2: formatDate(endTrimester2),
      gestAge
    });
  };

  useEffect(() => {
    handleCalculate();
  }, []);

  return (
    <div className="flex flex-col gap-6 font-sans text-[13px] text-[#333333]">
      <div className="flex bg-[#3366aa] text-white w-full max-w-[480px]">
        <div className={`flex-1 text-center py-2 font-bold cursor-pointer border border-[#3366aa] ${calcMethod === 'lmp' ? 'bg-[#f0f0f0] text-[#333333] border-b-transparent' : 'hover:bg-[#4477bb]'}`} onClick={() => setCalcMethod('lmp')}>Last Period</div>
        <div className={`flex-1 text-center py-2 font-bold cursor-pointer border border-[#3366aa] ${calcMethod === 'conception' ? 'bg-[#f0f0f0] text-[#333333] border-b-transparent' : 'hover:bg-[#4477bb]'}`} onClick={() => setCalcMethod('conception')}>Conception Date</div>
        <div className={`flex-1 text-center py-2 font-bold cursor-pointer border border-[#3366aa] ${calcMethod === 'due' ? 'bg-[#f0f0f0] text-[#333333] border-b-transparent' : 'hover:bg-[#4477bb]'}`} onClick={() => setCalcMethod('due')}>Due Date</div>
      </div>
      
      <div className="-mt-6 flex flex-col md:flex-row gap-6">
        <div className="w-full max-w-[480px]">
          <FormPanel header="Modify the values and click the Calculate button to use">
            
            {calcMethod === 'lmp' && (
              <>
                <FormGroup label="First day of last period">
                  <Input type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} className="w-[150px]" />
                </FormGroup>
                <FormGroup label="Average cycle length">
                  <Input type="number" value={cycleLength} onChange={(e) => setCycleLength(parseInt(e.target.value) || 28)} className="w-[50px]" />
                  <span className="px-1 text-gray-600">days (usually 28)</span>
                </FormGroup>
              </>
            )}

            {calcMethod === 'conception' && (
              <FormGroup label="Conception date">
                <Input type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} className="w-[150px]" />
              </FormGroup>
            )}

            {calcMethod === 'due' && (
              <FormGroup label="Estimated Due date">
                <Input type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} className="w-[150px]" />
              </FormGroup>
            )}

            <div className="pl-[160px] flex gap-2 mt-4">
              <Button onClick={handleCalculate}>Calculate</Button>
              <Button variant="secondary" onClick={() => {}}>Clear</Button>
            </div>
          </FormPanel>
        </div>

        {results && (
          <div className="flex-1 max-w-[400px]">
            <div className="bg-[#4cae4c] text-white font-bold py-2 px-3 mb-4 text-[16px] text-center">
              Estimated Due Date<br/>{results.dueDate}
            </div>

            <table className="w-full text-right border-collapse text-[13px] bg-white border border-[#cccccc]">
              <tbody>
                <tr className="bg-[#f8f8f8]">
                  <td className="text-left p-2 border-b border-[#e0e0e0]">Estimated Conception Date</td>
                  <td className="p-2 border-b border-[#e0e0e0] font-bold">{results.conceptionDate}</td>
                </tr>
                <tr>
                  <td className="text-left p-2 border-b border-[#e0e0e0]">End of First Trimester (12 weeks)</td>
                  <td className="p-2 border-b border-[#e0e0e0] font-bold">{results.endTrimester1}</td>
                </tr>
                <tr className="bg-[#f8f8f8]">
                  <td className="text-left p-2 border-b border-[#e0e0e0]">End of Second Trimester (27 weeks)</td>
                  <td className="p-2 border-b border-[#e0e0e0] font-bold">{results.endTrimester2}</td>
                </tr>
                <tr>
                  <td className="text-left p-2 border-b border-[#e0e0e0]">Estimated Gestational Age</td>
                  <td className="p-2 border-b border-[#e0e0e0] font-bold text-[#3366aa]">{results.gestAge}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4 p-3 bg-[#fff8e1] border border-[#f5c6cb] text-[#8a6d3b] text-[12px] rounded-sm">
              <strong>Note:</strong> Due dates are only estimates. Only about 4% of babies are actually born on their estimated due date.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
