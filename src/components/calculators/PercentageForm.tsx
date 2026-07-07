'use client';

import React, { useState } from 'react';
import { Input, Button } from '@/components/CalculatorFormElements';

export function PercentageForm() {
  const [val1, setVal1] = useState<number | ''>(20);
  const [val2, setVal2] = useState<number | ''>(150);
  const [res1, setRes1] = useState<string | null>(null);

  const [val3, setVal3] = useState<number | ''>(20);
  const [val4, setVal4] = useState<number | ''>(150);
  const [res2, setRes2] = useState<string | null>(null);

  const [val5, setVal5] = useState<number | ''>(20);
  const [val6, setVal6] = useState<number | ''>(150);
  const [res3, setRes3] = useState<string | null>(null);

  const calc1 = () => {
    if (val1 === '' || val2 === '') return;
    const res = (val1 / 100) * val2;
    setRes1(`${res}`);
  };

  const calc2 = () => {
    if (val3 === '' || val4 === '') return;
    const res = (val3 / val4) * 100;
    setRes2(`${res}%`);
  };

  const calc3 = () => {
    if (val5 === '' || val6 === '') return;
    const res = val5 / (val6 / 100);
    setRes3(`${res}`);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-[13px] text-[#333333] max-w-[500px]">
      
      <div className="bg-[#f0f0f0] p-4 border border-[#cccccc]">
        <div className="flex items-center gap-2 mb-2">
          <span>What is</span>
          <Input type="number" value={val1} onChange={(e) => setVal1(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-[80px]" />
          <span>% of</span>
          <Input type="number" value={val2} onChange={(e) => setVal2(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-[80px]" />
          <span>?</span>
        </div>
        <div className="flex gap-4 items-center">
          <Button onClick={calc1}>Calculate</Button>
          <Button variant="secondary" onClick={() => { setVal1(''); setVal2(''); setRes1(null); }}>Clear</Button>
          {res1 && <span className="font-bold text-[18px] text-[#006600] ml-4">{val1}% of {val2} is {res1}</span>}
        </div>
      </div>

      <div className="bg-[#f0f0f0] p-4 border border-[#cccccc]">
        <div className="flex items-center gap-2 mb-2">
          <Input type="number" value={val3} onChange={(e) => setVal3(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-[80px]" />
          <span>is what percent of</span>
          <Input type="number" value={val4} onChange={(e) => setVal4(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-[80px]" />
          <span>?</span>
        </div>
        <div className="flex gap-4 items-center">
          <Button onClick={calc2}>Calculate</Button>
          <Button variant="secondary" onClick={() => { setVal3(''); setVal4(''); setRes2(null); }}>Clear</Button>
          {res2 && <span className="font-bold text-[18px] text-[#006600] ml-4">{val3} is {res2} of {val4}</span>}
        </div>
      </div>

      <div className="bg-[#f0f0f0] p-4 border border-[#cccccc]">
        <div className="flex items-center gap-2 mb-2">
          <Input type="number" value={val5} onChange={(e) => setVal5(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-[80px]" />
          <span>is</span>
          <Input type="number" value={val6} onChange={(e) => setVal6(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-[80px]" />
          <span>percent of what?</span>
        </div>
        <div className="flex gap-4 items-center">
          <Button onClick={calc3}>Calculate</Button>
          <Button variant="secondary" onClick={() => { setVal5(''); setVal6(''); setRes3(null); }}>Clear</Button>
          {res3 && <span className="font-bold text-[18px] text-[#006600] ml-4">{val5} is {val6}% of {res3}</span>}
        </div>
      </div>

    </div>
  );
}
