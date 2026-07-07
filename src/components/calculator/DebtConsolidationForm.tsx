"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function DebtConsolidationForm({ state, setters, handleCalculate, handleClear }: any) {
  const t = useTranslations('calculatorUI');
  const handleCardChange = (index: number, field: string, value: string) => {
    const newCards = [...state.cards];
    newCards[index][field] = value;
    setters.setCards(newCards);
  };

  const addMoreFields = () => {
    const newCards = [...state.cards];
    for(let i=0; i<3; i++) {
      newCards.push({ name: "", balance: "", payment: "", rate: "" });
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
        
        <table className="border-collapse mb-2 text-[13px] w-full max-w-[500px]">
          <thead>
            <tr>
              <th className="font-normal text-left pr-2 w-4"></th>
              <th className="font-normal text-left px-1">Debt name</th>
              <th className="font-normal text-center px-1 leading-tight">Remaining<br/>balance</th>
              <th className="font-normal text-center px-1 leading-tight">Monthly or min.<br/>payment</th>
              <th className="font-normal text-center px-1">Interest rate</th>
            </tr>
          </thead>
          <tbody>
            {state.cards.map((card: any, idx: number) => (
              <tr key={idx}>
                <td className="pr-2 py-0.5 text-right">{idx + 1}.</td>
                <td className="px-1 py-0.5">
                  <input 
                    type="text" 
                    className="border border-gray-400 w-full min-w-[100px] px-1 h-[26px]"
                    value={card.name}
                    onChange={(e) => handleCardChange(idx, 'name', e.target.value)}
                  />
                </td>
                <td className="px-1 py-0.5">
                  <div className="flex items-center bg-white border border-gray-400 w-full min-w-[70px]">
                    <span className="px-1 bg-gray-100 border-r border-gray-400 leading-[24px]">$</span>
                    <input 
                      type="text" 
                      className="w-full px-1 h-[24px] outline-none"
                      value={card.balance}
                      onChange={(e) => handleCardChange(idx, 'balance', e.target.value)}
                    />
                  </div>
                </td>
                <td className="px-1 py-0.5">
                  <div className="flex items-center bg-white border border-gray-400 w-full min-w-[70px]">
                    <span className="px-1 bg-gray-100 border-r border-gray-400 leading-[24px]">$</span>
                    <input 
                      type="text" 
                      className="w-full px-1 h-[24px] outline-none"
                      value={card.payment}
                      onChange={(e) => handleCardChange(idx, 'payment', e.target.value)}
                    />
                  </div>
                </td>
                <td className="px-1 py-0.5">
                  <div className="flex items-center bg-white border border-gray-400 w-full min-w-[60px]">
                    <input 
                      type="text" 
                      className="w-full px-1 h-[24px] outline-none"
                      value={card.rate}
                      onChange={(e) => handleCardChange(idx, 'rate', e.target.value)}
                    />
                    <span className="px-1 bg-gray-100 border-l border-gray-400 leading-[24px]">%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button 
          onClick={addMoreFields}
          className="text-[#1c4587] underline hover:text-[#153465] text-[13px] ml-6 mb-6 block"
        >
          Show more input fields
        </button>

        <div className="font-bold mb-2 text-black">Consolidation loan</div>
        
        <div className="grid grid-cols-[120px_1fr] gap-y-2 items-center max-w-[300px] pl-2">
          <label>Loan amount</label>
          <div className="flex items-center">
            <span className="border border-gray-400 border-r-0 px-2 bg-gray-100 leading-[26px]">$</span>
            <input 
              type="text" 
              className="border border-gray-400 w-[100px] px-1 h-[28px]" 
              value={state.loanAmount}
              onChange={e => setters.setLoanAmount(e.target.value)}
            />
          </div>

          <label>Interest rate</label>
          <div className="flex items-center">
            <input 
              type="text" 
              className="border border-gray-400 w-[60px] px-1 h-[28px]" 
              value={state.loanRate}
              onChange={e => setters.setLoanRate(e.target.value)}
            />
            <span className="border border-gray-400 border-l-0 px-2 bg-gray-100 leading-[26px]">%</span>
          </div>

          <label>Loan term</label>
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              <input 
                type="text" 
                className="border border-gray-400 w-[40px] px-1 h-[28px]" 
                value={state.loanYears}
                onChange={e => setters.setLoanYears(e.target.value)}
              />
              <span className="border border-gray-400 border-l-0 px-1 bg-gray-100 leading-[26px] text-gray-500">years</span>
            </div>
            <div className="flex items-center">
              <input 
                type="text" 
                className="border border-gray-400 w-[40px] px-1 h-[28px]" 
                value={state.loanMonths}
                onChange={e => setters.setLoanMonths(e.target.value)}
              />
              <span className="border border-gray-400 border-l-0 px-1 bg-gray-100 leading-[26px] text-gray-500">months</span>
            </div>
          </div>

          <label>Loan fee/points</label>
          <div className="flex items-center gap-1">
            <input 
              type="text" 
              className="border border-gray-400 w-[60px] px-1 h-[28px]" 
              value={state.loanFee}
              onChange={e => setters.setLoanFee(e.target.value)}
            />
            <select 
              className="border border-gray-400 h-[28px] px-1"
              value={state.loanFeeType}
              onChange={e => setters.setLoanFeeType(e.target.value)}
            >
              <option value="%">%</option>
              <option value="$">$</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-6 md:ml-[120px]">
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
