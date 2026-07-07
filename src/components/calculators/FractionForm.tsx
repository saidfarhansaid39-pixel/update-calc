'use client';

import React, { useState } from 'react';
import { Input, Select, Button, FormGroup, FormPanel } from '@/components/CalculatorFormElements';
import { Fraction, simplifyFraction, addFractions, subFractions, mulFractions, divFractions } from '@/lib/calculators/mathEngine';

export function FractionForm() {
  const [f1W, setF1W] = useState<number | ''>('');
  const [f1N, setF1N] = useState<number | ''>(1);
  const [f1D, setF1D] = useState<number | ''>(2);

  const [op, setOp] = useState('+');

  const [f2W, setF2W] = useState<number | ''>('');
  const [f2N, setF2N] = useState<number | ''>(1);
  const [f2D, setF2D] = useState<number | ''>(3);

  const [result, setResult] = useState<any>(null);

  const parseFraction = (w: number | '', n: number | '', d: number | ''): Fraction => {
    const whole = w === '' ? 0 : w;
    const num = n === '' ? 0 : n;
    const den = d === '' || d === 0 ? 1 : d;

    // Convert mixed to improper
    const sign = whole < 0 ? -1 : 1;
    const improperNum = (Math.abs(whole) * den) + num;
    
    return { numerator: improperNum * sign, denominator: den };
  };

  const handleCalculate = () => {
    if (f1D === 0 || f2D === 0) {
      setResult('Error: Denominator cannot be zero');
      return;
    }

    const frac1 = parseFraction(f1W, f1N, f1D);
    const frac2 = parseFraction(f2W, f2N, f2D);

    let res: Fraction;
    switch (op) {
      case '+': res = addFractions(frac1, frac2); break;
      case '-': res = subFractions(frac1, frac2); break;
      case '*': res = mulFractions(frac1, frac2); break;
      case '/': res = divFractions(frac1, frac2); break;
      default: res = addFractions(frac1, frac2);
    }

    const decimal = res.numerator / res.denominator;
    
    // Mixed fraction conversion
    let mixedStr = '';
    const wholePart = Math.floor(Math.abs(res.numerator) / Math.abs(res.denominator)) * (res.numerator < 0 ? -1 : 1);
    const remNum = Math.abs(res.numerator) % Math.abs(res.denominator);
    
    if (remNum === 0) {
      mixedStr = `${wholePart}`;
    } else if (wholePart !== 0) {
      mixedStr = `${wholePart} ${remNum}/${Math.abs(res.denominator)}`;
    } else {
      mixedStr = `${res.numerator}/${res.denominator}`;
    }

    setResult({
      improper: `${res.numerator}/${res.denominator}`,
      mixed: mixedStr,
      decimal: decimal.toString()
    });
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-[13px] text-[#333333]">
      <div className="bg-[#f0f0f0] border border-[#cccccc] p-4 inline-flex flex-col md:flex-row items-center gap-4 max-w-fit">
        
        {/* Fraction 1 */}
        <div className="flex items-center gap-2">
          <Input type="number" value={f1W} onChange={(e) => setF1W(e.target.value === '' ? '' : parseInt(e.target.value))} className="w-[50px] text-center" placeholder="w" />
          <div className="flex flex-col gap-1">
            <Input type="number" value={f1N} onChange={(e) => setF1N(e.target.value === '' ? '' : parseInt(e.target.value))} className="w-[50px] text-center" />
            <hr className="border-t border-black w-full" />
            <Input type="number" value={f1D} onChange={(e) => setF1D(e.target.value === '' ? '' : parseInt(e.target.value))} className="w-[50px] text-center" />
          </div>
        </div>

        {/* Operator */}
        <div>
          <Select value={op} onChange={(e) => setOp(e.target.value)} className="w-[60px] text-center font-bold text-[18px]">
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">×</option>
            <option value="/">÷</option>
          </Select>
        </div>

        {/* Fraction 2 */}
        <div className="flex items-center gap-2">
          <Input type="number" value={f2W} onChange={(e) => setF2W(e.target.value === '' ? '' : parseInt(e.target.value))} className="w-[50px] text-center" placeholder="w" />
          <div className="flex flex-col gap-1">
            <Input type="number" value={f2N} onChange={(e) => setF2N(e.target.value === '' ? '' : parseInt(e.target.value))} className="w-[50px] text-center" />
            <hr className="border-t border-black w-full" />
            <Input type="number" value={f2D} onChange={(e) => setF2D(e.target.value === '' ? '' : parseInt(e.target.value))} className="w-[50px] text-center" />
          </div>
        </div>

        <div className="ml-4 flex gap-2">
          <Button onClick={handleCalculate} className="px-6">=</Button>
          <Button variant="secondary" onClick={() => {}}>Clear</Button>
        </div>
      </div>

      {result && typeof result === 'object' && (
        <div className="bg-[#e6f2e6] border border-[#4cae4c] p-6 max-w-[600px]">
          <h2 className="text-[18px] font-bold text-primary-dark mb-4 border-b border-[#cccccc] pb-1">Result</h2>
          <div className="text-[24px] font-bold text-[#006600] mb-2">
            {result.mixed}
          </div>
          {result.mixed !== result.improper && (
            <div className="text-[16px] mb-2 text-gray-700">
              Improper fraction: <span className="font-bold text-black">{result.improper}</span>
            </div>
          )}
          <div className="text-[16px] text-gray-700">
            Decimal: <span className="font-bold text-black">{result.decimal}</span>
          </div>
        </div>
      )}
      {typeof result === 'string' && (
        <div className="text-red-500 font-bold">{result}</div>
      )}
    </div>
  );
}
