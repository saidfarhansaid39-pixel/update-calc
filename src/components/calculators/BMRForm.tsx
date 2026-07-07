'use client';

import React, { useState, useEffect } from 'react';
import { Input, Button, FormGroup, FormPanel } from '@/components/CalculatorFormElements';
import { calculateBMRMifflin } from '@/lib/calculators/healthEngine';
import { CompactTable, CompactTableHeader, CompactTableBody, CompactTh, CompactTr, CompactTd } from '@/components/TableElements';

export function BMRForm() {
  const [activeTab, setActiveTab] = useState<'us' | 'metric' | 'other'>('us');
  
  const [usInputs, setUsInputs] = useState({ age: 25, heightFt: 5, heightIn: 10, weightLbs: 160 });
  const [metricInputs, setMetricInputs] = useState({ age: 25, heightCm: 178, weightKg: 72 });
  const [gender, setGender] = useState<'male' | 'female'>('male');
  
  const [results, setResults] = useState<any>(null);

  const handleCalculate = () => {
    let weightKg = 0;
    let heightCm = 0;
    let age = 0;

    if (activeTab === 'us') {
      weightKg = usInputs.weightLbs * 0.453592;
      heightCm = ((usInputs.heightFt * 12) + usInputs.heightIn) * 2.54;
      age = usInputs.age;
    } else {
      weightKg = metricInputs.weightKg;
      heightCm = metricInputs.heightCm;
      age = metricInputs.age;
    }

    const bmr = calculateBMRMifflin(weightKg, heightCm, age, gender);

    setResults({
      bmr: Math.round(bmr),
      sedentary: Math.round(bmr * 1.2),
      light: Math.round(bmr * 1.375),
      moderate: Math.round(bmr * 1.55),
      active: Math.round(bmr * 1.725),
      veryActive: Math.round(bmr * 1.9)
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
      
      <div className="-mt-6 w-full max-w-[340px]">
        <FormPanel header="Modify the values and click the Calculate button to use">
          <FormGroup label="Age">
            <Input type="number" value={activeTab === 'us' ? usInputs.age : metricInputs.age} onChange={(e) => activeTab === 'us' ? setUsInputs({...usInputs, age: parseInt(e.target.value)}) : setMetricInputs({...metricInputs, age: parseInt(e.target.value)})} className="w-[50px]" />
            <span className="px-1 text-gray-600">ages 15 - 80</span>
          </FormGroup>

          <FormGroup label="Gender">
            <label className="mr-3"><input type="radio" name="gender" checked={gender === 'male'} onChange={() => setGender('male')} /> Male</label>
            <label><input type="radio" name="gender" checked={gender === 'female'} onChange={() => setGender('female')} /> Female</label>
          </FormGroup>
          
          {activeTab === 'us' ? (
            <>
              <FormGroup label="Height">
                <Input type="number" value={usInputs.heightFt} onChange={(e) => setUsInputs({...usInputs, heightFt: parseInt(e.target.value)})} className="w-[50px]" />
                <span className="px-1 text-gray-600">feet</span>
                <Input type="number" value={usInputs.heightIn} onChange={(e) => setUsInputs({...usInputs, heightIn: parseInt(e.target.value)})} className="w-[50px]" />
                <span className="px-1 text-gray-600">inches</span>
              </FormGroup>
              <FormGroup label="Weight">
                <Input type="number" value={usInputs.weightLbs} onChange={(e) => setUsInputs({...usInputs, weightLbs: parseFloat(e.target.value)})} className="w-[50px]" />
                <span className="px-1 text-gray-600">pounds</span>
              </FormGroup>
            </>
          ) : (
            <>
              <FormGroup label="Height">
                <Input type="number" value={metricInputs.heightCm} onChange={(e) => setMetricInputs({...metricInputs, heightCm: parseInt(e.target.value)})} className="w-[50px]" />
                <span className="px-1 text-gray-600">cm</span>
              </FormGroup>
              <FormGroup label="Weight">
                <Input type="number" value={metricInputs.weightKg} onChange={(e) => setMetricInputs({...metricInputs, weightKg: parseFloat(e.target.value)})} className="w-[50px]" />
                <span className="px-1 text-gray-600">kg</span>
              </FormGroup>
            </>
          )}

          <div className="pl-[140px] flex gap-2 mt-4">
            <Button onClick={handleCalculate}>Calculate</Button>
            <Button variant="secondary" onClick={() => {}}>Clear</Button>
          </div>
        </FormPanel>
      </div>

      {results && (
        <div className="w-full">
          <div className="bg-[#e6f2e6] border border-[#4cae4c] p-4 text-center mb-6 max-w-[400px]">
            <span className="font-bold text-[18px]">BMR = {results.bmr.toLocaleString()} Calories/day</span>
          </div>

          <h2 className="text-[18px] font-bold text-primary-dark mb-2 border-b border-[#cccccc] pb-1 max-w-[400px]">Daily calorie needs based on activity level</h2>
          
          <div className="max-w-[400px]">
            <CompactTable>
              <CompactTableHeader>
                <CompactTh align="left">Activity Level</CompactTh>
                <CompactTh>Calorie</CompactTh>
              </CompactTableHeader>
              <CompactTableBody>
                <CompactTr isEven>
                  <CompactTd align="left">Sedentary: little or no exercise</CompactTd>
                  <CompactTd className="font-bold text-[#3366aa]">{results.sedentary.toLocaleString()}</CompactTd>
                </CompactTr>
                <CompactTr>
                  <CompactTd align="left">Exercise 1-3 times/week</CompactTd>
                  <CompactTd className="font-bold text-[#3366aa]">{results.light.toLocaleString()}</CompactTd>
                </CompactTr>
                <CompactTr isEven>
                  <CompactTd align="left">Exercise 4-5 times/week</CompactTd>
                  <CompactTd className="font-bold text-[#3366aa]">{results.moderate.toLocaleString()}</CompactTd>
                </CompactTr>
                <CompactTr>
                  <CompactTd align="left">Daily exercise or intense exercise 3-4 times/week</CompactTd>
                  <CompactTd className="font-bold text-[#3366aa]">{results.active.toLocaleString()}</CompactTd>
                </CompactTr>
                <CompactTr isEven>
                  <CompactTd align="left">Intense exercise 6-7 times/week</CompactTd>
                  <CompactTd className="font-bold text-[#3366aa]">{results.veryActive.toLocaleString()}</CompactTd>
                </CompactTr>
                <CompactTr>
                  <CompactTd align="left">Very intense exercise daily, or physical job</CompactTd>
                  <CompactTd className="font-bold text-[#3366aa]">{Math.round(results.bmr * 1.9).toLocaleString()}</CompactTd>
                </CompactTr>
              </CompactTableBody>
            </CompactTable>
          </div>
        </div>
      )}
    </div>
  );
}
