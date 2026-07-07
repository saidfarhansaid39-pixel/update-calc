'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { evaluateExpression } from '@/lib/calculators/scientificEngine';
import { cn } from '@/lib/utils';

export function ScientificCalculatorForm() {
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isDeg, setIsDeg] = useState(true);
  const [memory, setMemory] = useState(0);

  const handleAppend = useCallback((val: string) => {
    setExpression(prev => prev + val);
  }, []);

  const handleClear = useCallback(() => {
    setExpression('');
  }, []);

  const handleDelete = useCallback(() => {
    setExpression(prev => prev.slice(0, -1));
  }, []);

  const handleCalculate = useCallback(() => {
    if (!expression) return;
    const result = evaluateExpression(expression, isDeg);
    if (!isNaN(result)) {
      setHistory(prev => [`${expression} = ${result}`, ...prev].slice(0, 10));
      setExpression(result.toString());
    } else {
      setExpression('Error');
    }
  }, [expression, isDeg]);

  const handleMemoryAdd = () => {
    const res = parseFloat(expression);
    if (!isNaN(res)) setMemory(prev => prev + res);
  };
  const handleMemorySubtract = () => {
    const res = parseFloat(expression);
    if (!isNaN(res)) setMemory(prev => prev - res);
  };
  const handleMemoryRecall = () => {
    setExpression(prev => prev + memory.toString());
  };
  const handleMemoryClear = () => {
    setMemory(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/[0-9+\-*/().^%]/.test(key)) {
        e.preventDefault();
        handleAppend(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAppend, handleCalculate, handleDelete, handleClear]);

  const Button = ({ children, onClick, className, variant = 'default' }: any) => {
    const base = "font-bold text-[13px] rounded-sm transition-colors flex items-center justify-center border shadow-sm select-none cursor-pointer active:scale-95";
    const variants = {
      default: "bg-[#e6e6e6] text-[#333333] hover:bg-[#d4d4d4] border-[#cccccc] h-[34px]",
      action: "bg-[#5cb85c] text-white hover:bg-[#4cae4c] border-[#4cae4c] h-[34px]",
      clear: "bg-[#d9534f] text-white hover:bg-[#c9302c] border-[#d43f3a] h-[34px]",
      sci: "bg-[#f0f0f0] text-[#005596] hover:bg-[#e0e0e0] border-[#cccccc] h-[34px] text-[12px]",
      num: "bg-[#ffffff] text-[#333333] hover:bg-[#f5f5f5] border-[#cccccc] h-[34px] font-bold text-[14px]"
    };
    return (
      <div onClick={onClick} className={cn(base, variants[variant as keyof typeof variants], className)}>
        {children}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 font-sans text-[13px] text-[#333333]">
      <div className="w-[380px] bg-[#f8f8f8] border border-[#cccccc] p-3 shadow-md">
        
        {/* Display */}
        <div className="bg-white border border-[#999999] p-2 mb-3 h-[60px] flex flex-col justify-end text-right overflow-hidden shadow-inner">
          <div className="text-[11px] text-gray-500 min-h-[16px] overflow-hidden whitespace-nowrap">
            {history.length > 0 ? history[0].split('=')[0] + '=' : ''}
          </div>
          <div className="text-[24px] font-mono font-bold leading-tight overflow-hidden whitespace-nowrap tracking-tighter">
            {expression || '0'}
          </div>
        </div>

        {/* Memory Row */}
        <div className="grid grid-cols-6 gap-1 mb-2">
          <Button variant="sci" onClick={handleMemoryClear}>MC</Button>
          <Button variant="sci" onClick={handleMemoryRecall}>MR</Button>
          <Button variant="sci" onClick={handleMemoryAdd}>M+</Button>
          <Button variant="sci" onClick={handleMemorySubtract}>M-</Button>
          <div className="col-span-2 flex items-center justify-center bg-gray-200 border border-[#cccccc] rounded-sm text-[11px]">
            {memory !== 0 ? `M: ${memory}` : 'Memory empty'}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-5 gap-1 mb-1">
          {/* Scientific Block */}
          <div className="col-span-3 grid grid-cols-3 gap-1">
            <Button variant="sci" onClick={() => setIsDeg(!isDeg)} className={cn(isDeg ? "bg-[#3366aa] text-white" : "")}>Deg</Button>
            <Button variant="sci" onClick={() => setIsDeg(!isDeg)} className={cn(!isDeg ? "bg-[#3366aa] text-white" : "")}>Rad</Button>
            <Button variant="sci" onClick={() => handleAppend('!')}>x!</Button>
            
            <Button variant="sci" onClick={() => handleAppend('sin(')}>sin</Button>
            <Button variant="sci" onClick={() => handleAppend('cos(')}>cos</Button>
            <Button variant="sci" onClick={() => handleAppend('tan(')}>tan</Button>
            
            <Button variant="sci" onClick={() => handleAppend('asin(')}>asin</Button>
            <Button variant="sci" onClick={() => handleAppend('acos(')}>acos</Button>
            <Button variant="sci" onClick={() => handleAppend('atan(')}>atan</Button>

            <Button variant="sci" onClick={() => handleAppend('e')}>e</Button>
            <Button variant="sci" onClick={() => handleAppend('ln(')}>ln</Button>
            <Button variant="sci" onClick={() => handleAppend('log(')}>log</Button>
            
            <Button variant="sci" onClick={() => handleAppend('pi')}>π</Button>
            <Button variant="sci" onClick={() => handleAppend('sqrt(')}>√</Button>
            <Button variant="sci" onClick={() => handleAppend('^')}>x<sup>y</sup></Button>
            
            <Button variant="sci" onClick={() => handleAppend('(')}>(</Button>
            <Button variant="sci" onClick={() => handleAppend(')')}>)</Button>
            <Button variant="sci" onClick={() => handleAppend('%')}>%</Button>
          </div>

          {/* Numpad Block */}
          <div className="col-span-2 grid grid-cols-4 gap-1">
            <Button variant="clear" onClick={handleClear} className="col-span-2">AC</Button>
            <Button variant="default" onClick={handleDelete} className="col-span-2">CE</Button>
            
            <Button variant="num" onClick={() => handleAppend('7')}>7</Button>
            <Button variant="num" onClick={() => handleAppend('8')}>8</Button>
            <Button variant="num" onClick={() => handleAppend('9')}>9</Button>
            <Button variant="default" onClick={() => handleAppend('/')}>÷</Button>
            
            <Button variant="num" onClick={() => handleAppend('4')}>4</Button>
            <Button variant="num" onClick={() => handleAppend('5')}>5</Button>
            <Button variant="num" onClick={() => handleAppend('6')}>6</Button>
            <Button variant="default" onClick={() => handleAppend('*')}>×</Button>
            
            <Button variant="num" onClick={() => handleAppend('1')}>1</Button>
            <Button variant="num" onClick={() => handleAppend('2')}>2</Button>
            <Button variant="num" onClick={() => handleAppend('3')}>3</Button>
            <Button variant="default" onClick={() => handleAppend('-')}>−</Button>
            
            <Button variant="num" onClick={() => handleAppend('0')} className="col-span-2">0</Button>
            <Button variant="num" onClick={() => handleAppend('.')}>.</Button>
            <Button variant="default" onClick={() => handleAppend('+')}>+</Button>
          </div>
        </div>

        <div className="flex gap-1 mt-1">
          <Button variant="action" onClick={handleCalculate} className="flex-1 h-[40px] text-[16px]">=</Button>
        </div>

      </div>

      <div className="flex-1 border border-[#cccccc] p-3 bg-white shadow-sm h-[320px] overflow-y-auto">
        <div className="bg-[#5588cc] text-white font-bold py-1 px-2 mb-3 -mt-3 -mx-3 border-b border-[#3366aa] text-[13px] sticky top-0">
          Calculation History
        </div>
        {history.length === 0 ? (
          <p className="text-gray-400 italic mt-2">No history yet. Calculations will appear here.</p>
        ) : (
          <ul className="space-y-2 font-mono text-[13px]">
            {history.map((item, idx) => (
              <li key={idx} className="border-b border-gray-100 pb-1 cursor-pointer hover:bg-gray-50" onClick={() => setExpression(item.split(' = ')[1])}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
