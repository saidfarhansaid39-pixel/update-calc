'use client';

import React, { useState, useEffect } from 'react';
import { Input, Select, Button, FormGroup, FormPanel } from '@/components/CalculatorFormElements';
import { calculateBMRMifflin, getActivityMultiplier } from '@/lib/calculators/healthEngine';
import { CompactTable, CompactTableHeader, CompactTableBody, CompactTh, CompactTr, CompactTd } from '@/components/TableElements';

export function CalorieForm() {
  const [activeTab, setActiveTab] = useState<'us' | 'metric' | 'other'>('us');
  
  const [usInputs, setUsInputs] = useState({ age: 25, heightFt: 5, heightIn: 10, weightLbs: 160 });
  const [metricInputs, setMetricInputs] = useState({ age: 25, heightCm: 178, weightKg: 72 });
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState('moderate');
  
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
    const multiplier = getActivityMultiplier(activity);
    const maintenance = bmr * multiplier;

    setResults({
      maintenance: Math.round(maintenance),
      mildLoss: Math.round(maintenance - 250),
      loss: Math.round(maintenance - 500),
      extremeLoss: Math.round(maintenance - 1000),
      mildGain: Math.round(maintenance + 250),
      gain: Math.round(maintenance + 500),
      extremeGain: Math.round(maintenance + 1000)
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

          <FormGroup label="Activity">
            <Select value={activity} onChange={(e) => setActivity(e.target.value)} className="w-[180px]">
              <option value="sedentary">Sedentary: little or no exercise</option>
              <option value="light">Light: exercise 1-3 times/week</option>
              <option value="moderate">Moderate: exercise 4-5 times/week</option>
              <option value="active">Active: daily exercise or intense exercise 3-4 times/week</option>
              <option value="very_active">Very Active: intense exercise 6-7 times/week</option>
            </Select>
          </FormGroup>

          <div className="pl-[140px] flex gap-2 mt-4">
            <Button onClick={handleCalculate}>Calculate</Button>
            <Button variant="secondary" onClick={() => {}}>Clear</Button>
          </div>
        </FormPanel>
      </div>

      {results && (
        <div className="w-full">
          <h2 className="text-[18px] font-bold text-primary-dark mb-4 border-b border-[#cccccc] pb-1">Result</h2>
          <div className="bg-[#e6f2e6] border border-[#4cae4c] p-4 text-center mb-6 max-w-[500px]">
            <div className="text-[14px]">The results show a number of daily calorie estimates that can be used as a guideline for how many calories to consume each day to maintain, lose, or gain weight at a chosen rate.</div>
          </div>

          <div className="max-w-[500px]">
            <CompactTable>
              <CompactTableHeader>
                <CompactTh align="left" className="w-[200px]">Goal</CompactTh>
                <CompactTh>Calories/day</CompactTh>
                <CompactTh>Percentage</CompactTh>
              </CompactTableHeader>
              <CompactTableBody>
                <CompactTr>
                  <CompactTd align="left" className="font-bold">Maintain weight</CompactTd>
                  <CompactTd className="font-bold">{results.maintenance.toLocaleString()}</CompactTd>
                  <CompactTd>100%</CompactTd>
                </CompactTr>
                <CompactTr isEven>
                  <CompactTd align="left">
                    <div className="font-bold">Mild weight loss</div>
                    <div className="text-[11px] text-gray-500">0.5 lb/week</div>
                  </CompactTd>
                  <CompactTd className="text-[#3366aa] font-bold">{results.mildLoss.toLocaleString()}</CompactTd>
                  <CompactTd>~90%</CompactTd>
                </CompactTr>
                <CompactTr>
                  <CompactTd align="left">
                    <div className="font-bold">Weight loss</div>
                    <div className="text-[11px] text-gray-500">1 lb/week</div>
                  </CompactTd>
                  <CompactTd className="text-[#4cae4c] font-bold">{results.loss.toLocaleString()}</CompactTd>
                  <CompactTd>~79%</CompactTd>
                </CompactTr>
                <CompactTr isEven>
                  <CompactTd align="left">
                    <div className="font-bold">Extreme weight loss</div>
                    <div className="text-[11px] text-gray-500">2 lb/week</div>
                  </CompactTd>
                  <CompactTd className="text-[#d9534f] font-bold">{results.extremeLoss.toLocaleString()}</CompactTd>
                  <CompactTd>~59%</CompactTd>
                </CompactTr>
                <CompactTr>
                  <CompactTd align="left">
                    <div className="font-bold">Mild weight gain</div>
                    <div className="text-[11px] text-gray-500">0.5 lb/week</div>
                  </CompactTd>
                  <CompactTd className="text-[#3366aa] font-bold">{results.mildGain.toLocaleString()}</CompactTd>
                  <CompactTd>~110%</CompactTd>
                </CompactTr>
                <CompactTr isEven>
                  <CompactTd align="left">
                    <div className="font-bold">Weight gain</div>
                    <div className="text-[11px] text-gray-500">1 lb/week</div>
                  </CompactTd>
                  <CompactTd className="text-[#f0ad4e] font-bold">{results.gain.toLocaleString()}</CompactTd>
                  <CompactTd>~121%</CompactTd>
                </CompactTr>
                <CompactTr>
                  <CompactTd align="left">
                    <div className="font-bold">Fast weight gain</div>
                    <div className="text-[11px] text-gray-500">2 lb/week</div>
                  </CompactTd>
                  <CompactTd className="text-[#d9534f] font-bold">{results.extremeGain.toLocaleString()}</CompactTd>
                  <CompactTd>~141%</CompactTd>
                </CompactTr>
              </CompactTableBody>
            </CompactTable>
          </div>
        </div>
      )}
    </div>
  );
}
