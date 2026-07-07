'use client';

import React, { useState } from 'react';
import { Input, Select, Button, FormGroup, FormPanel } from '@/components/CalculatorFormElements';

export function RandomNumberForm() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [allowDups, setAllowDups] = useState(false);
  const [sort, setSort] = useState<'none' | 'asc' | 'desc'>('none');
  
  const [results, setResults] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    setError(null);
    
    if (min >= max) {
      setError('Lower limit must be less than upper limit.');
      return;
    }
    if (count < 1 || count > 10000) {
      setError('Number of generated values must be between 1 and 10,000.');
      return;
    }

    const range = max - min + 1;
    if (!allowDups && count > range) {
      setError('Cannot generate unique numbers if requested count is greater than the range.');
      return;
    }

    const nums: number[] = [];
    
    if (!allowDups) {
      const pool = new Set<number>();
      while (pool.size < count) {
        pool.add(Math.floor(Math.random() * range) + min);
      }
      nums.push(...Array.from(pool));
    } else {
      for (let i = 0; i < count; i++) {
        nums.push(Math.floor(Math.random() * range) + min);
      }
    }

    if (sort === 'asc') {
      nums.sort((a, b) => a - b);
    } else if (sort === 'desc') {
      nums.sort((a, b) => b - a);
    }

    setResults(nums);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-[13px] text-[#333333]">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full max-w-[380px]">
          <FormPanel header="Random Number Generator">
            <FormGroup label="Lower Limit">
              <Input type="number" value={min} onChange={(e) => setMin(parseInt(e.target.value) || 0)} className="w-[100px]" />
            </FormGroup>
            
            <FormGroup label="Upper Limit">
              <Input type="number" value={max} onChange={(e) => setMax(parseInt(e.target.value) || 0)} className="w-[100px]" />
            </FormGroup>

            <FormGroup label="Generate">
              <Input type="number" value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} className="w-[100px]" />
              <span className="ml-2 text-gray-600">numbers</span>
            </FormGroup>

            <FormGroup label="Allow Duplicates in Result">
              <label className="mr-3"><input type="radio" name="dups" checked={allowDups} onChange={() => setAllowDups(true)} /> Yes</label>
              <label><input type="radio" name="dups" checked={!allowDups} onChange={() => setAllowDups(false)} /> No</label>
            </FormGroup>

            <FormGroup label="Sort Results">
              <Select value={sort} onChange={(e) => setSort(e.target.value as any)} className="w-[120px]">
                <option value="none">None</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </Select>
            </FormGroup>

            <div className="pl-[160px] flex gap-2 mt-4">
              <Button onClick={handleGenerate}>Generate</Button>
              <Button variant="secondary" onClick={() => { setResults(null); setError(null); }}>Clear</Button>
            </div>
          </FormPanel>

          {error && <div className="mt-4 text-red-500 font-bold">{error}</div>}
        </div>

        {results && (
          <div className="flex-1 w-full max-w-[500px]">
            <h2 className="text-[18px] font-bold text-primary-dark mb-2 border-b border-[#cccccc] pb-1">Result</h2>
            
            {count === 1 ? (
              <div className="text-[48px] font-bold text-[#3366aa] text-center my-8">
                {results[0]}
              </div>
            ) : (
              <div className="border border-[#cccccc] bg-[#f8f8f8] p-3 max-h-[300px] overflow-y-auto break-words font-mono text-[14px]">
                {results.join(', ')}
              </div>
            )}
            <div className="text-[11px] text-gray-500 mt-2 text-right">
              Count: {results.length} | Min: {Math.min(...results)} | Max: {Math.max(...results)} | Sum: {results.reduce((a,b)=>a+b, 0)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
