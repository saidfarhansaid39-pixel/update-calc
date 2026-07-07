'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getCategory, getUnitsForCategory } from '../../engines/conversion/registry';
import { convert } from '../../engines/conversion/converters';
import { formatConversionResult } from '../../engines/conversion/formatters';
import { DimensionType } from '../../engines/conversion/dimensions';
import '../../data/units/init'; // Ensure registry is initialized
import { useTranslations } from 'next-intl';

interface UnitConverterFormProps {
  initialCategory?: DimensionType;
}

export default function UnitConverterForm({ initialCategory = 'length' }: UnitConverterFormProps = {}) {
  const t = useTranslations('calculatorUI');
  const [category, setCategory] = useState<DimensionType>(initialCategory);
  
  // Need to load these dynamically based on category, so we useMemo
  const currentCategoryDef = useMemo(() => {
    try {
      return getCategory(category);
    } catch {
      return null;
    }
  }, [category]);

  const units = useMemo(() => {
    if (!currentCategoryDef) return [];
    return getUnitsForCategory(category).sort((a, b) => a.name.localeCompare(b.name));
  }, [category, currentCategoryDef]);

  const [fromUnitId, setFromUnitId] = useState<string>(units[0]?.id || '');
  const [toUnitId, setToUnitId] = useState<string>(units[1]?.id || '');
  const [inputValue, setInputValue] = useState<string>('1');

  // Reset units when category changes
  useEffect(() => {
    if (units.length > 0) {
      setFromUnitId(units[0].id);
      setToUnitId(units.length > 1 ? units[1].id : units[0].id);
    }
  }, [units]);

  // Compute result
  const result = useMemo(() => {
    if (!currentCategoryDef || !fromUnitId || !toUnitId || isNaN(Number(inputValue))) return null;
    
    const fromU = currentCategoryDef.units[fromUnitId];
    const toU = currentCategoryDef.units[toUnitId];
    if (!fromU || !toU) return null;

    const val = Number(inputValue);
    const rawValue = convert(val, fromU, toU);
    
    const formatted = formatConversionResult(rawValue, toU, {
      profile: { maxDecimals: 10, stripTrailingZeros: true },
      useGrouping: true
    });

    return { rawValue, formatted, fromU, toU };
  }, [currentCategoryDef, fromUnitId, toUnitId, inputValue]);

  const handleSwap = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  if (!currentCategoryDef) {
    return <div className="p-4 bg-red-50 text-red-700">Error loading converter.</div>;
  }

  return (
    <div className="bg-white border border-gray-300 shadow-sm rounded">
      <div className="bg-blue-800 text-white p-2 font-bold text-lg">
        {currentCategoryDef.name} Converter
      </div>
      
      <div className="p-4 space-y-4 text-sm">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          
          {/* FROM */}
          <div className="flex-1 space-y-2">
            <label className="font-bold text-gray-700 block">From</label>
            <input 
              type="number" 
              className="w-full border border-gray-400 p-2 focus:outline-none focus:border-blue-600"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <select 
              size={10}
              className="w-full border border-gray-400 p-2 focus:outline-none focus:border-blue-600 bg-gray-50"
              value={fromUnitId}
              onChange={(e) => setFromUnitId(e.target.value)}
            >
              {units.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          {/* SWAP BUTTON */}
          <div className="flex justify-center md:pt-14">
            <button 
              onClick={handleSwap}
              className="bg-gray-200 hover:bg-gray-300 border border-gray-400 px-3 py-1 rounded shadow-sm text-sm"
            >
              ⇄ Swap
            </button>
          </div>

          {/* TO */}
          <div className="flex-1 space-y-2">
            <label className="font-bold text-gray-700 block">To</label>
            <div className="w-full bg-blue-50 border border-blue-200 p-2 font-bold text-gray-900 min-h-[38px] flex items-center overflow-x-auto">
              {result ? result.formatted : '...'}
            </div>
            <select 
              size={10}
              className="w-full border border-gray-400 p-2 focus:outline-none focus:border-blue-600 bg-gray-50"
              value={toUnitId}
              onChange={(e) => setToUnitId(e.target.value)}
            >
              {units.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          
        </div>
        
        {/* Result Formula / Summary text like Calculator.net does */}
        {result && (
          <div className="bg-green-50 text-green-900 p-3 mt-4 border border-green-200 text-center font-medium">
            {inputValue} {result.fromU.name} = {result.formatted} {result.toU.name}
          </div>
        )}
      </div>
    </div>
  );
}
