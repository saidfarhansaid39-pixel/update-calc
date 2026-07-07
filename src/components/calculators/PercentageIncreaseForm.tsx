'use client';

import React, { useState } from 'react';
import { Input, Button, FormGroup, FormPanel } from '@/components/CalculatorFormElements';
import { percentageIncrease } from '@/lib/calculators/mathEngine';

export function PercentageIncreaseForm() {
  const [val1, setVal1] = useState<number | ''>(10);
  const [val2, setVal2] = useState<number | ''>(15);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    if (val1 === '' || val2 === '') return;
    
    const diff = val2 - val1;
    const pct = percentageIncrease(val1, val2);
    
    setResult({
      pct: Math.abs(pct).toFixed(2),
      diff: Math.abs(diff),
      type: pct >= 0 ? 'Increase' : 'Decrease'
    });
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-[13px] text-[#333333]">
      <div className="w-full max-w-[340px]">
        <FormPanel header="Percentage Change">
          <FormGroup label="From">
            <Input type="number" value={val1} onChange={(e) => setVal1(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-[100px]" />
          </FormGroup>
          <FormGroup label="To">
            <Input type="number" value={val2} onChange={(e) => setVal2(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-[100px]" />
          </FormGroup>

          <div className="pl-[140px] flex gap-2 mt-4">
            <Button onClick={handleCalculate}>Calculate</Button>
            <Button variant="secondary" onClick={() => { setVal1(''); setVal2(''); setResult(null); }}>Clear</Button>
          </div>
        </FormPanel>
      </div>

      {result && (
        <div className="bg-[#e6f2e6] border border-[#4cae4c] p-4 text-center max-w-[400px]">
          <span className="font-bold text-[18px]">
            {result.type}: {result.pct}%
          </span>
          <br/>
          <span className="text-gray-600">Difference: {result.diff}</span>
        </div>
      )}
    </div>
  );
}
