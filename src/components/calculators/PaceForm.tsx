'use client';

import React, { useState, useEffect } from 'react';
import { Input, Select, Button, FormGroup, FormPanel } from '@/components/CalculatorFormElements';
import { CompactTable, CompactTableHeader, CompactTableBody, CompactTh, CompactTr, CompactTd } from '@/components/TableElements';

export function PaceForm() {
  const [activeTab, setActiveTab] = useState<'pace' | 'time' | 'distance'>('pace');
  
  const [inputs, setInputs] = useState({
    timeHr: 1,
    timeMin: 0,
    timeSec: 0,
    distanceVal: 10,
    distanceUnit: 'miles',
    paceMin: 8,
    paceSec: 0,
    paceUnit: 'miles'
  });

  const [results, setResults] = useState<any>(null);

  const getMeters = (val: number, unit: string) => {
    switch (unit) {
      case 'miles': return val * 1609.34;
      case 'kilometers': return val * 1000;
      case 'meters': return val;
      case 'yards': return val * 0.9144;
      default: return val * 1000;
    }
  };

  const handleCalculate = () => {
    let totalSecs = (inputs.timeHr * 3600) + (inputs.timeMin * 60) + inputs.timeSec;
    let distanceMeters = getMeters(inputs.distanceVal, inputs.distanceUnit);
    let paceSecsPerMeter = 0;

    if (activeTab === 'pace') {
      if (distanceMeters === 0) return;
      paceSecsPerMeter = totalSecs / distanceMeters;
      
      const paceUnitMeters = getMeters(1, inputs.distanceUnit);
      const paceSecs = paceSecsPerMeter * paceUnitMeters;
      
      const pMin = Math.floor(paceSecs / 60);
      const pSec = Math.round(paceSecs % 60);

      const resultText = `Pace: ${pMin}:${pSec.toString().padStart(2, '0')} Minutes/${inputs.distanceUnit === 'miles' ? 'Mile' : inputs.distanceUnit === 'kilometers' ? 'Km' : inputs.distanceUnit}`;
      setResults({ resultText, totalSecs, distanceMeters, paceSecsPerMeter });
    } 
    else if (activeTab === 'time') {
      const paceUnitMeters = getMeters(1, inputs.paceUnit);
      const paceTotalSecs = (inputs.paceMin * 60) + inputs.paceSec;
      paceSecsPerMeter = paceTotalSecs / paceUnitMeters;

      totalSecs = paceSecsPerMeter * distanceMeters;
      
      const hr = Math.floor(totalSecs / 3600);
      const min = Math.floor((totalSecs % 3600) / 60);
      const sec = Math.round(totalSecs % 60);

      const resultText = `Time: ${hr > 0 ? hr + ' Hours ' : ''}${min} Minutes ${sec} Seconds`;
      setResults({ resultText, totalSecs, distanceMeters, paceSecsPerMeter });
    }
    else if (activeTab === 'distance') {
      const paceUnitMeters = getMeters(1, inputs.paceUnit);
      const paceTotalSecs = (inputs.paceMin * 60) + inputs.paceSec;
      paceSecsPerMeter = paceTotalSecs / paceUnitMeters;

      distanceMeters = totalSecs / paceSecsPerMeter;
      let distRes = 0;
      switch (inputs.distanceUnit) {
        case 'miles': distRes = distanceMeters / 1609.34; break;
        case 'kilometers': distRes = distanceMeters / 1000; break;
        case 'meters': distRes = distanceMeters; break;
        case 'yards': distRes = distanceMeters / 0.9144; break;
      }

      const resultText = `Distance: ${distRes.toFixed(2)} ${inputs.distanceUnit}`;
      setResults({ resultText, totalSecs, distanceMeters, paceSecsPerMeter });
    }
  };

  useEffect(() => {
    handleCalculate();
  }, []);

  const generateSplits = (distanceMeters: number, paceSecsPerMeter: number, unit: string) => {
    const splits = [];
    const unitMeters = getMeters(1, unit);
    const totalUnits = distanceMeters / unitMeters;

    for (let i = 1; i <= Math.ceil(totalUnits); i++) {
      const isLast = i > totalUnits;
      const d = isLast ? totalUnits : i;
      const tSecs = d * unitMeters * paceSecsPerMeter;
      
      const hr = Math.floor(tSecs / 3600);
      const min = Math.floor((tSecs % 3600) / 60);
      const sec = Math.round(tSecs % 60);

      splits.push({
        distance: d.toFixed(2),
        time: `${hr > 0 ? hr + ':' : ''}${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
      });
    }
    return splits;
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-[13px] text-[#333333]">
      <div className="flex bg-[#3366aa] text-white w-full max-w-[340px]">
        <div className={`flex-1 text-center py-2 font-bold cursor-pointer border border-[#3366aa] ${activeTab === 'pace' ? 'bg-[#f0f0f0] text-[#333333] border-b-transparent' : 'hover:bg-[#4477bb]'}`} onClick={() => setActiveTab('pace')}>Pace</div>
        <div className={`flex-1 text-center py-2 font-bold cursor-pointer border border-[#3366aa] ${activeTab === 'time' ? 'bg-[#f0f0f0] text-[#333333] border-b-transparent' : 'hover:bg-[#4477bb]'}`} onClick={() => setActiveTab('time')}>Time</div>
        <div className={`flex-1 text-center py-2 font-bold cursor-pointer border border-[#3366aa] ${activeTab === 'distance' ? 'bg-[#f0f0f0] text-[#333333] border-b-transparent' : 'hover:bg-[#4477bb]'}`} onClick={() => setActiveTab('distance')}>Distance</div>
      </div>
      
      <div className="-mt-6 flex flex-col md:flex-row gap-6">
        <div className="w-full max-w-[340px]">
          <FormPanel header="Modify the values and click the Calculate button to use">
            
            {activeTab !== 'time' && (
              <FormGroup label="Time">
                <Input type="number" value={inputs.timeHr} onChange={(e) => setInputs({...inputs, timeHr: parseInt(e.target.value) || 0})} className="w-[30px]" /> hr
                <Input type="number" value={inputs.timeMin} onChange={(e) => setInputs({...inputs, timeMin: parseInt(e.target.value) || 0})} className="w-[30px] ml-2" /> min
                <Input type="number" value={inputs.timeSec} onChange={(e) => setInputs({...inputs, timeSec: parseInt(e.target.value) || 0})} className="w-[30px] ml-2" /> sec
              </FormGroup>
            )}

            {activeTab !== 'distance' && (
              <FormGroup label="Distance">
                <Input type="number" value={inputs.distanceVal} onChange={(e) => setInputs({...inputs, distanceVal: parseFloat(e.target.value) || 0})} className="w-[50px]" />
                <Select value={inputs.distanceUnit} onChange={(e) => setInputs({...inputs, distanceUnit: e.target.value})} className="w-[100px] ml-2">
                  <option value="miles">Miles</option>
                  <option value="kilometers">Kilometers</option>
                  <option value="meters">Meters</option>
                  <option value="yards">Yards</option>
                </Select>
              </FormGroup>
            )}

            {activeTab !== 'pace' && (
              <FormGroup label="Pace">
                <Input type="number" value={inputs.paceMin} onChange={(e) => setInputs({...inputs, paceMin: parseInt(e.target.value) || 0})} className="w-[30px]" /> min
                <Input type="number" value={inputs.paceSec} onChange={(e) => setInputs({...inputs, paceSec: parseInt(e.target.value) || 0})} className="w-[30px] ml-2" /> sec
                <span className="mx-2">per</span>
                <Select value={inputs.paceUnit} onChange={(e) => setInputs({...inputs, paceUnit: e.target.value})} className="w-[80px]">
                  <option value="miles">Mile</option>
                  <option value="kilometers">Km</option>
                </Select>
              </FormGroup>
            )}

            {activeTab === 'distance' && (
              <FormGroup label="Output Unit">
                <Select value={inputs.distanceUnit} onChange={(e) => setInputs({...inputs, distanceUnit: e.target.value})} className="w-[100px]">
                  <option value="miles">Miles</option>
                  <option value="kilometers">Kilometers</option>
                  <option value="meters">Meters</option>
                  <option value="yards">Yards</option>
                </Select>
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
            <div className="bg-[#4cae4c] text-white font-bold py-1 px-3 mb-4 text-[15px]">
              {results.resultText}
            </div>

            <h2 className="text-[18px] font-bold text-primary-dark mb-2 border-b border-[#cccccc] pb-1">Splits</h2>
            
            <CompactTable>
              <CompactTableHeader>
                <CompactTh>Distance ({inputs.distanceUnit})</CompactTh>
                <CompactTh>Time</CompactTh>
              </CompactTableHeader>
              <CompactTableBody>
                {generateSplits(results.distanceMeters, results.paceSecsPerMeter, inputs.distanceUnit).map((split, idx) => (
                  <CompactTr key={idx} isEven={idx % 2 === 1}>
                    <CompactTd align="center">{split.distance}</CompactTd>
                    <CompactTd align="center">{split.time}</CompactTd>
                  </CompactTr>
                ))}
              </CompactTableBody>
            </CompactTable>
          </div>
        )}
      </div>
    </div>
  );
}
