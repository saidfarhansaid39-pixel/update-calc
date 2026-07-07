'use client';

import React, { useState, useEffect } from 'react';
import { Input, Button, FormGroup, FormPanel } from '@/components/CalculatorFormElements';
import { calculateIdealWeight } from '@/lib/calculators/healthEngine';
import { CompactTable, CompactTableHeader, CompactTableBody, CompactTh, CompactTr, CompactTd } from '@/components/TableElements';

export function IdealWeightForm() {
  const [activeTab, setActiveTab] = useState<'us' | 'metric' | 'other'>('us');
  
  const [usInputs, setUsInputs] = useState({ age: 25, heightFt: 5, heightIn: 10 });
  const [metricInputs, setMetricInputs] = useState({ age: 25, heightCm: 178 });
  const [gender, setGender] = useState<'male' | 'female'>('male');
  
  const [results, setResults] = useState<any>(null);

  const handleCalculate = () => {
    let heightCm = 0;

    if (activeTab === 'us') {
      heightCm = ((usInputs.heightFt * 12) + usInputs.heightIn) * 2.54;
    } else {
      heightCm = metricInputs.heightCm;
    }

    const { min, max, robinson, miller, devine, hamwi } = calculateIdealWeight(heightCm, gender);

    // Convert back to lbs if in US mode
    const factor = activeTab === 'us' ? 2.20462 : 1;
    const suffix = activeTab === 'us' ? 'lbs' : 'kg';

    setResults({
      robinson: `${(robinson * factor).toFixed(1)} ${suffix}`,
      miller: `${(miller * factor).toFixed(1)} ${suffix}`,
      devine: `${(devine * factor).toFixed(1)} ${suffix}`,
      hamwi: `${(hamwi * factor).toFixed(1)} ${suffix}`,
      healthyRange: `${(min * factor).toFixed(1)} - ${(max * factor).toFixed(1)} ${suffix}`
    });
  };

  useEffect(() => {
    handleCalculate();
  }, [activeTab]);

  return (
    <div className="flex flex-col gap-6 font-sans text-[13px] text-[#333333]">
      <div className="flex bg-[#3366aa] text-white w-full max-w-[340px]">
        <div className={`flex-1 text-center py-2 font-bold cursor-pointer border border-[#3366aa] ${activeTab === 'us' ? 'bg-[#f0f0f0] text-[#333333] border-b-transparent' : 'hover:bg-[#4477bb]'}`} onClick={() => setActiveTab('us')}>US Units</div>
        <div className={`flex-1 text-center py-2 font-bold cursor-pointer border border-[#3366aa] ${activeTab === 'metric' ? 'bg-[#f0f0f0] text-[#333333] border-b-transparent' : 'hover:bg-[#4477bb]'}`} onClick={() => setActiveTab('metric')}>Metric Units</div>
        <div className={`flex-1 text-center py-2 font-bold cursor-pointer border border-[#3366aa] ${activeTab === 'other' ? 'bg-[#f0f0f0] text-[#333333] border-b-transparent' : 'hover:bg-[#4477bb]'}`} onClick={() => setActiveTab('other')}>Other Units</div>
      </div>
      
      <div className="-mt-6 flex flex-col md:flex-row gap-6">
        <div className="w-full max-w-[340px]">
          <FormPanel header="Modify the values and click the Calculate button to use">
            <FormGroup label="Age">
              <Input type="number" value={activeTab === 'us' ? usInputs.age : metricInputs.age} onChange={(e) => activeTab === 'us' ? setUsInputs({...usInputs, age: parseInt(e.target.value)}) : setMetricInputs({...metricInputs, age: parseInt(e.target.value)})} className="w-[50px]" />
              <span className="px-1 text-gray-600">ages 2 - 80</span>
            </FormGroup>

            <FormGroup label="Gender">
              <label className="mr-3"><input type="radio" name="gender" checked={gender === 'male'} onChange={() => setGender('male')} /> Male</label>
              <label><input type="radio" name="gender" checked={gender === 'female'} onChange={() => setGender('female')} /> Female</label>
            </FormGroup>
            
            {activeTab === 'us' ? (
              <FormGroup label="Height">
                <Input type="number" value={usInputs.heightFt} onChange={(e) => setUsInputs({...usInputs, heightFt: parseInt(e.target.value)})} className="w-[50px]" />
                <span className="px-1 text-gray-600">feet</span>
                <Input type="number" value={usInputs.heightIn} onChange={(e) => setUsInputs({...usInputs, heightIn: parseInt(e.target.value)})} className="w-[50px]" />
                <span className="px-1 text-gray-600">inches</span>
              </FormGroup>
            ) : (
              <FormGroup label="Height">
                <Input type="number" value={metricInputs.heightCm} onChange={(e) => setMetricInputs({...metricInputs, heightCm: parseInt(e.target.value)})} className="w-[50px]" />
                <span className="px-1 text-gray-600">cm</span>
              </FormGroup>
            )}

            <div className="pl-[140px] flex gap-2 mt-4">
              <Button onClick={handleCalculate}>Calculate</Button>
              <Button variant="secondary" onClick={() => {}}>Clear</Button>
            </div>
          </FormPanel>
        </div>

        {results && (
          <div className="flex-1 max-w-[400px]">
            <h2 className="text-[18px] font-bold text-primary-dark mb-2 border-b border-[#cccccc] pb-1">Result</h2>
            
            <div className="mb-4">
              <CompactTable>
                <CompactTableBody>
                  <CompactTr isEven>
                    <CompactTd align="left">Robinson formula (1983)</CompactTd>
                    <CompactTd className="font-bold">{results.robinson}</CompactTd>
                  </CompactTr>
                  <CompactTr>
                    <CompactTd align="left">Miller formula (1983)</CompactTd>
                    <CompactTd className="font-bold">{results.miller}</CompactTd>
                  </CompactTr>
                  <CompactTr isEven>
                    <CompactTd align="left">Devine formula (1974)</CompactTd>
                    <CompactTd className="font-bold">{results.devine}</CompactTd>
                  </CompactTr>
                  <CompactTr>
                    <CompactTd align="left">Hamwi formula (1964)</CompactTd>
                    <CompactTd className="font-bold">{results.hamwi}</CompactTd>
                  </CompactTr>
                  <CompactTr isEven>
                    <CompactTd align="left">Healthy BMI Range</CompactTd>
                    <CompactTd className="font-bold">{results.healthyRange}</CompactTd>
                  </CompactTr>
                </CompactTableBody>
              </CompactTable>
            </div>

            <div className="text-[12px] text-gray-600 mt-2">
              <p>The Ideal Weight Calculator computes ideal body weight (IBW) ranges based on height, gender, and age.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
