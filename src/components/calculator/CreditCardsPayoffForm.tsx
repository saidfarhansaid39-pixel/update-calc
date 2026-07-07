"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function CreditCardsPayoffForm({ state, setters, handleCalculate, handleClear }: any) {
  const t = useTranslations('calculatorUI');
  const handleCardChange = (index: number, field: string, value: string) => {
    const newCards = [...state.cards];
    newCards[index][field] = value;
    setters.setCards(newCards);
  };

  const addMoreFields = () => {
    const newCards = [...state.cards];
    for(let i=0; i<3; i++) {
      newCards.push({ name: "", balance: "", minPayment: "", rate: "" });
    }
    setters.setCards(newCards);
  };

  return (
    <div className="w-full font-sans text-[13px] text-gray-800 mb-6">
      <div className="bg-[#1c4587] text-white flex justify-between items-center p-2 rounded-t">
        <div className="flex items-center font-bold">
          <ChevronDown size={16} className="mr-1" />
          Modify the values and click the Calculate button to use
        </div>
      </div>
      
      <div className="bg-[#f0f0f0] p-4 border border-gray-300 rounded-b">
        
        <div className="flex items-center mb-4">
          <label className="font-bold mr-2">Monthly budget set aside for credit cards:</label>
          <div className="flex items-center bg-white border border-gray-400">
            <span className="px-1 bg-gray-100 border-r border-gray-400">$</span>
            <input 
              type="text" 
              className="w-[80px] px-1 h-[26px] outline-none" 
              value={state.budget}
              onChange={e => setters.setBudget(e.target.value)}
            />
          </div>
        </div>

        <div className="font-bold mb-2">Info of your credit cards:</div>

        <table className="border-collapse mb-2 text-[13px]">
          <thead>
            <tr>
              <th className="font-normal text-left pr-2"></th>
              <th className="font-normal text-left px-1">Credit card</th>
              <th className="font-normal text-left px-1">Balance</th>
              <th className="font-normal text-left px-1 leading-tight">Minimum<br/>payment</th>
              <th className="font-normal text-left px-1">Interest rate</th>
            </tr>
          </thead>
          <tbody>
            {state.cards.map((card: any, idx: number) => (
              <tr key={idx} className="">
                <td className="pr-2 py-0.5 text-right">{idx + 1}.</td>
                <td className="px-1 py-0.5">
                  <input 
                    type="text" 
                    className="border border-gray-400 w-[120px] px-1 h-[26px]"
                    value={card.name}
                    onChange={(e) => handleCardChange(idx, 'name', e.target.value)}
                  />
                </td>
                <td className="px-1 py-0.5">
                  <div className="flex items-center bg-white border border-gray-400 w-[90px]">
                    <span className="px-1 bg-gray-100 border-r border-gray-400">$</span>
                    <input 
                      type="text" 
                      className="w-full px-1 h-[24px] outline-none"
                      value={card.balance}
                      onChange={(e) => handleCardChange(idx, 'balance', e.target.value)}
                    />
                  </div>
                </td>
                <td className="px-1 py-0.5">
                  <div className="flex items-center bg-white border border-gray-400 w-[70px]">
                    <span className="px-1 bg-gray-100 border-r border-gray-400">$</span>
                    <input 
                      type="text" 
                      className="w-full px-1 h-[24px] outline-none"
                      value={card.minPayment}
                      onChange={(e) => handleCardChange(idx, 'minPayment', e.target.value)}
                    />
                  </div>
                </td>
                <td className="px-1 py-0.5">
                  <div className="flex items-center bg-white border border-gray-400 w-[70px]">
                    <input 
                      type="text" 
                      className="w-full px-1 h-[24px] outline-none"
                      value={card.rate}
                      onChange={(e) => handleCardChange(idx, 'rate', e.target.value)}
                    />
                    <span className="px-1 bg-gray-100 border-l border-gray-400">%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button 
          onClick={addMoreFields}
          className="text-[#1c4587] underline hover:text-[#153465] text-[13px] ml-6 mb-4 block"
        >
          Show more input fields
        </button>

        <div className="flex gap-2 mt-4 ml-6">
          <button 
            onClick={handleCalculate}
            className="bg-[#306e3e] hover:bg-[#255630] text-white px-6 py-1.5 font-bold rounded shadow border border-[#1f4a27] flex items-center gap-1"
          >
            Calculate <span className="bg-white text-[#306e3e] rounded-full w-4 h-4 flex items-center justify-center text-[10px]">▶</span>
          </button>
          <button 
            onClick={handleClear}
            className="bg-[#aaaaaa] hover:bg-[#999999] text-white px-6 py-1.5 font-bold rounded shadow border border-[#888888]"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
