'use client';

import React, { useState, useEffect } from 'react';
import { Input, Button, FormGroup, FormPanel } from '@/components/CalculatorFormElements';
import { calculateUSNavyBodyFat } from '@/lib/calculators/healthEngine';
import { CompactTable, CompactTableHeader, CompactTableBody, CompactTh, CompactTr, CompactTd } from '@/components/TableElements';

export function BodyFatForm() {
  const [activeTab, setActiveTab] = useState<'us' | 'metric' | 'other'>('us');
  
  const [usInputs, setUsInputs] = useState({ age: 25, weightLbs: 160, heightFt: 5, heightIn: 10, neckIn: 15, waistIn: 32, hipIn: 38 });
  const [metricInputs, setMetricInputs] = useState({ age: 25, weightKg: 72, heightCm: 178, neckCm: 38, waistCm: 81, hipCm: 96 });
  const [gender, setGender] = useState<'male' | 'female'>('male');
  
  const [results, setResults] = useState<any>(null);

  const getBodyFatCategory = (bf: number, gender: string) => {
    if (gender === 'male') {
      if (bf >= 2 && bf <= 5) return 'Essential fat';
      if (bf > 5 && bf <= 13) return 'Athletes';
      if (bf > 13 && bf <= 17) return 'Fitness';
      if (bf > 17 && bf <= 24) return 'Average';
      if (bf > 24) return 'Obese';
    } else {
      if (bf >= 10 && bf <= 13) return 'Essential fat';
      if (bf > 13 && bf <= 20) return 'Athletes';
      if (bf > 20 && bf <= 24) return 'Fitness';
      if (bf > 24 && bf <= 31) return 'Average';
      if (bf > 31) return 'Obese';
    }
    return '';
  };

  const handleCalculate = () => {
    let weight = 0;
    let heightCm = 0;
    let neckCm = 0;
    let waistCm = 0;
    let hipCm = 0;

    if (activeTab === 'us') {
      weight = usInputs.weightLbs;
      heightCm = ((usInputs.heightFt * 12) + usInputs.heightIn) * 2.54;
      neckCm = usInputs.neckIn * 2.54;
      waistCm = usInputs.waistIn * 2.54;
      hipCm = usInputs.hipIn * 2.54;
    } else {
      weight = metricInputs.weightKg;
      heightCm = metricInputs.heightCm;
      neckCm = metricInputs.neckCm;
      waistCm = metricInputs.waistCm;
      hipCm = metricInputs.hipCm;
    }

    const bf = calculateUSNavyBodyFat(waistCm, neckCm, heightCm, hipCm, gender);
    const category = getBodyFatCategory(bf, gender);
    const bfMass = weight * (bf / 100);
    const leanMass = weight - bfMass;

    const idealLow = gender === 'male' ? 8 : 15;
    const idealHigh = gender === 'male' ? 17 : 22;

    const weightSuffix = activeTab === 'us' ? 'lbs' : 'kg';

    setResults({
      bf: bf.toFixed(1),
      category,
      bfMass: `${bfMass.toFixed(1)} ${weightSuffix}`,
      leanMass: `${leanMass.toFixed(1)} ${weightSuffix}`,
      idealRange: `${idealLow}% - ${idealHigh}%`
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
            <FormGroup label="Gender">
              <label className="mr-3"><input type="radio" name="gender" checked={gender === 'male'} onChange={() => setGender('male')} /> Male</label>
              <label><input type="radio" name="gender" checked={gender === 'female'} onChange={() => setGender('female')} /> Female</label>
            </FormGroup>

            <FormGroup label="Age">
              <Input type="number" value={activeTab === 'us' ? usInputs.age : metricInputs.age} onChange={(e) => activeTab === 'us' ? setUsInputs({...usInputs, age: parseInt(e.target.value)}) : setMetricInputs({...metricInputs, age: parseInt(e.target.value)})} className="w-[50px]" />
            </FormGroup>
            
            {activeTab === 'us' ? (
              <>
                <FormGroup label="Weight">
                  <Input type="number" value={usInputs.weightLbs} onChange={(e) => setUsInputs({...usInputs, weightLbs: parseFloat(e.target.value)})} className="w-[50px]" />
                  <span className="px-1 text-gray-600">pounds</span>
                </FormGroup>
                <FormGroup label="Height">
                  <Input type="number" value={usInputs.heightFt} onChange={(e) => setUsInputs({...usInputs, heightFt: parseInt(e.target.value)})} className="w-[50px]" />
                  <span className="px-1 text-gray-600">feet</span>
                  <Input type="number" value={usInputs.heightIn} onChange={(e) => setUsInputs({...usInputs, heightIn: parseInt(e.target.value)})} className="w-[50px]" />
                  <span className="px-1 text-gray-600">inches</span>
                </FormGroup>
                <FormGroup label="Neck">
                  <Input type="number" value={usInputs.neckIn} onChange={(e) => setUsInputs({...usInputs, neckIn: parseFloat(e.target.value)})} className="w-[50px]" step="0.1" />
                  <span className="px-1 text-gray-600">inches</span>
                </FormGroup>
                <FormGroup label="Waist">
                  <Input type="number" value={usInputs.waistIn} onChange={(e) => setUsInputs({...usInputs, waistIn: parseFloat(e.target.value)})} className="w-[50px]" step="0.1" />
                  <span className="px-1 text-gray-600">inches</span>
                </FormGroup>
                {gender === 'female' && (
                  <FormGroup label="Hip">
                    <Input type="number" value={usInputs.hipIn} onChange={(e) => setUsInputs({...usInputs, hipIn: parseFloat(e.target.value)})} className="w-[50px]" step="0.1" />
                    <span className="px-1 text-gray-600">inches</span>
                  </FormGroup>
                )}
              </>
            ) : (
              <>
                <FormGroup label="Weight">
                  <Input type="number" value={metricInputs.weightKg} onChange={(e) => setMetricInputs({...metricInputs, weightKg: parseFloat(e.target.value)})} className="w-[50px]" />
                  <span className="px-1 text-gray-600">kg</span>
                </FormGroup>
                <FormGroup label="Height">
                  <Input type="number" value={metricInputs.heightCm} onChange={(e) => setMetricInputs({...metricInputs, heightCm: parseInt(e.target.value)})} className="w-[50px]" />
                  <span className="px-1 text-gray-600">cm</span>
                </FormGroup>
                <FormGroup label="Neck">
                  <Input type="number" value={metricInputs.neckCm} onChange={(e) => setMetricInputs({...metricInputs, neckCm: parseFloat(e.target.value)})} className="w-[50px]" step="0.1" />
                  <span className="px-1 text-gray-600">cm</span>
                </FormGroup>
                <FormGroup label="Waist">
                  <Input type="number" value={metricInputs.waistCm} onChange={(e) => setMetricInputs({...metricInputs, waistCm: parseFloat(e.target.value)})} className="w-[50px]" step="0.1" />
                  <span className="px-1 text-gray-600">cm</span>
                </FormGroup>
                {gender === 'female' && (
                  <FormGroup label="Hip">
                    <Input type="number" value={metricInputs.hipCm} onChange={(e) => setMetricInputs({...metricInputs, hipCm: parseFloat(e.target.value)})} className="w-[50px]" step="0.1" />
                    <span className="px-1 text-gray-600">cm</span>
                  </FormGroup>
                )}
              </>
            )}

            <div className="pl-[140px] flex gap-2 mt-4">
              <Button onClick={handleCalculate}>Calculate</Button>
              <Button variant="secondary" onClick={() => {}}>Clear</Button>
            </div>
          </FormPanel>
        </div>

        {results && (
          <div className="flex-1 max-w-[400px]">
            <div className="bg-[#4cae4c] text-white font-bold py-1 px-3 mb-2 flex justify-between items-center text-[15px]">
              <span>Body Fat: {results.bf} %</span>
            </div>

            <table className="w-full text-right border-collapse text-[13px] bg-white">
              <tbody>
                <tr>
                  <td className="text-left p-1 border-b border-[#e0e0e0]">Body Fat Category</td>
                  <td className="p-1 border-b border-[#e0e0e0] font-bold">{results.category}</td>
                </tr>
                <tr>
                  <td className="text-left p-1 border-b border-[#e0e0e0]">Body Fat Mass</td>
                  <td className="p-1 border-b border-[#e0e0e0] font-bold">{results.bfMass}</td>
                </tr>
                <tr>
                  <td className="text-left p-1 border-b border-[#e0e0e0]">Lean Body Mass</td>
                  <td className="p-1 border-b border-[#e0e0e0] font-bold">{results.leanMass}</td>
                </tr>
                <tr>
                  <td className="text-left p-1 border-b border-[#e0e0e0]">Ideal Body Fat for Given Age</td>
                  <td className="p-1 border-b border-[#e0e0e0] font-bold">{results.idealRange}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-6 text-[11px] text-gray-500">
              * Note: The body fat percentage calculation utilizes the U.S. Navy Method. This method estimates body fat percentage based on bodily circumferences, height, and gender.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
