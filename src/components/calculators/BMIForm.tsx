'use client';

import React, { useState, useEffect } from 'react';
import { Input, Button, FormGroup, FormPanel } from '@/components/CalculatorFormElements';
import { CompactTable, CompactTableHeader, CompactTableBody, CompactTh, CompactTr, CompactTd } from '@/components/TableElements';
import { calculateBMI, getBMICategory } from '@/lib/calculators/healthEngine';

export function BMIForm() {
  const [activeTab, setActiveTab] = useState<'us' | 'metric' | 'other'>('us');
  
  const [usInputs, setUsInputs] = useState({ age: 25, heightFt: 5, heightIn: 10, weightLbs: 160 });
  const [metricInputs, setMetricInputs] = useState({ age: 25, heightCm: 178, weightKg: 72 });
  const [results, setResults] = useState<any>(null);

  const handleCalculate = () => {
    let weightKg = 0;
    let heightM = 0;

    if (activeTab === 'us') {
      weightKg = usInputs.weightLbs * 0.453592;
      heightM = ((usInputs.heightFt * 12) + usInputs.heightIn) * 0.0254;
    } else {
      weightKg = metricInputs.weightKg;
      heightM = metricInputs.heightCm / 100;
    }

    const bmi = calculateBMI(weightKg, heightM);
    const category = getBMICategory(bmi);
    
    // Healthy weight range (BMI 18.5 - 25)
    const minWeightKg = 18.5 * (heightM * heightM);
    const maxWeightKg = 25 * (heightM * heightM);
    
    const minWeightStr = activeTab === 'us' ? `${(minWeightKg / 0.453592).toFixed(1)} lbs` : `${minWeightKg.toFixed(1)} kgs`;
    const maxWeightStr = activeTab === 'us' ? `${(maxWeightKg / 0.453592).toFixed(1)} lbs` : `${maxWeightKg.toFixed(1)} kgs`;

    setResults({
      bmi: bmi.toFixed(1),
      category,
      healthyRange: `${minWeightStr} - ${maxWeightStr}`,
      weightKg,
      heightM
    });
  };

  useEffect(() => {
    handleCalculate();
  }, [activeTab]);

  const BMIGaugeBar = ({ bmi }: { bmi: number }) => {
    // Range roughly 15 to 40
    let pos = ((bmi - 15) / (40 - 15)) * 100;
    if (pos < 0) pos = 0;
    if (pos > 100) pos = 100;

    return (
      <div className="w-full max-w-[400px] my-6 text-[11px] text-center">
        <div className="flex h-[20px] w-full border border-gray-400 mb-1">
          <div className="bg-[#bc2020] w-[14%]" title="Severe Thinness"></div>
          <div className="bg-[#d38888] w-[14%]" title="Moderate Thinness"></div>
          <div className="bg-[#ffe400] w-[14%]" title="Mild Thinness"></div>
          <div className="bg-[#008137] w-[26%]" title="Normal"></div>
          <div className="bg-[#ffe400] w-[16%]" title="Overweight"></div>
          <div className="bg-[#d38888] w-[8%]" title="Obese Class I"></div>
          <div className="bg-[#bc2020] w-[8%]" title="Obese Class II"></div>
        </div>
        <div className="relative w-full h-[15px] border-t border-[#cccccc] mt-2">
          <div className="absolute top-[-18px] text-black font-bold flex flex-col items-center" style={{ left: `calc(${pos}% - 10px)` }}>
            ▼<br/>{bmi}
          </div>
          <div className="absolute left-0 top-1 text-gray-500">15</div>
          <div className="absolute left-[14%] top-1 text-gray-500">16</div>
          <div className="absolute left-[28%] top-1 text-gray-500">18.5</div>
          <div className="absolute left-[54%] top-1 text-gray-500">25</div>
          <div className="absolute left-[70%] top-1 text-gray-500">30</div>
          <div className="absolute left-[86%] top-1 text-gray-500">35</div>
          <div className="absolute right-0 top-1 text-gray-500">40</div>
        </div>
      </div>
    );
  };

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
            <span className="px-1 text-gray-600">ages 2 - 120</span>
          </FormGroup>

          <FormGroup label="Gender">
            <label className="mr-3"><input type="radio" name="gender" defaultChecked /> Male</label>
            <label><input type="radio" name="gender" /> Female</label>
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
          <div className="mb-4">
            <span className="font-bold text-[18px]">BMI = {results.bmi} kg/m<sup>2</sup></span>&nbsp;&nbsp;
            <span className="text-gray-500">({results.category})</span>
          </div>

          <div className="bg-[#f0f0f0] border border-[#cccccc] p-3 max-w-[600px] mb-6">
            <p>Healthy BMI range: 18.5 kg/m<sup>2</sup> - 25 kg/m<sup>2</sup></p>
            <p>Healthy weight for the height: <strong>{results.healthyRange}</strong></p>
          </div>

          <BMIGaugeBar bmi={parseFloat(results.bmi)} />

          <h2 className="text-[18px] font-bold text-primary-dark mt-8 mb-2">BMI table for adults</h2>
          <p className="mb-2">This is the World Health Organization's (WHO) recommended body weight based on BMI values for adults. It is used for both men and women, age 20 or older.</p>
          
          <div className="max-w-[400px]">
            <CompactTable>
              <CompactTableHeader>
                <CompactTh>Classification</CompactTh>
                <CompactTh>BMI range - kg/m<sup>2</sup></CompactTh>
              </CompactTableHeader>
              <CompactTableBody>
                <CompactTr isEven><CompactTd align="left">Severe Thinness</CompactTd><CompactTd>&lt; 16</CompactTd></CompactTr>
                <CompactTr><CompactTd align="left">Moderate Thinness</CompactTd><CompactTd>16 - 17</CompactTd></CompactTr>
                <CompactTr isEven><CompactTd align="left">Mild Thinness</CompactTd><CompactTd>17 - 18.5</CompactTd></CompactTr>
                <CompactTr><CompactTd align="left">Normal</CompactTd><CompactTd>18.5 - 25</CompactTd></CompactTr>
                <CompactTr isEven><CompactTd align="left">Overweight</CompactTd><CompactTd>25 - 30</CompactTd></CompactTr>
                <CompactTr><CompactTd align="left">Obese Class I</CompactTd><CompactTd>30 - 35</CompactTd></CompactTr>
                <CompactTr isEven><CompactTd align="left">Obese Class II</CompactTd><CompactTd>35 - 40</CompactTd></CompactTr>
                <CompactTr><CompactTd align="left">Obese Class III</CompactTd><CompactTd>&gt; 40</CompactTd></CompactTr>
              </CompactTableBody>
            </CompactTable>
          </div>
        </div>
      )}
    </div>
  );
}
