"use client";

import React from 'react';

export function CurrencyTables() {
  return (
    <div className="w-full font-sans text-[13px] text-gray-800 mt-8">
      <h3 className="font-bold text-[14px] mb-2">Market Exchange Rates Table</h3>
      <p className="mb-2">The exchange rates below are based on the May, 16, 2026, 15:0:2 exchange rate from openexchangerates.org.</p>
      
      <p className="font-bold text-[13px] mb-1">Major Currencies:</p>
      <div className="overflow-x-auto border border-[#1c4587]">
        <table className="w-full text-xs text-center border-collapse">
          <thead>
            <tr className="bg-[#1c4587] text-white">
              <th className="p-1 border border-[#1c4587]"></th>
              <th className="p-1 border border-[#1c4587]">USD</th>
              <th className="p-1 border border-[#1c4587]">EUR</th>
              <th className="p-1 border border-[#1c4587]">GBP</th>
              <th className="p-1 border border-[#1c4587]">CNY</th>
              <th className="p-1 border border-[#1c4587]">JPY</th>
              <th className="p-1 border border-[#1c4587]">CAD</th>
              <th className="p-1 border border-[#1c4587]">AUD</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="p-1 border border-gray-300 font-bold text-left whitespace-nowrap">1 USD</td>
              <td className="p-1 border border-gray-300">1</td>
              <td className="p-1 border border-gray-300">0.860067</td>
              <td className="p-1 border border-gray-300">0.750272</td>
              <td className="p-1 border border-gray-300">6.8099</td>
              <td className="p-1 border border-gray-300">156.6955</td>
              <td className="p-1 border border-gray-300">1.37535</td>
              <td className="p-1 border border-gray-300">1.39821</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="p-1 border border-gray-300 font-bold text-left whitespace-nowrap">1 EUR</td>
              <td className="p-1 border border-gray-300">1.1627001</td>
              <td className="p-1 border border-gray-300">1</td>
              <td className="p-1 border border-gray-300">0.872341</td>
              <td className="p-1 border border-gray-300">7.917872</td>
              <td className="p-1 border border-gray-300">182.18987</td>
              <td className="p-1 border border-gray-300">1.5991196</td>
              <td className="p-1 border border-gray-300">1.6256989</td>
            </tr>
            <tr className="bg-white">
              <td className="p-1 border border-gray-300 font-bold text-left whitespace-nowrap">1 GBP</td>
              <td className="p-1 border border-gray-300">1.33285</td>
              <td className="p-1 border border-gray-300">1.1463403</td>
              <td className="p-1 border border-gray-300">1</td>
              <td className="p-1 border border-gray-300">9.076575</td>
              <td className="p-1 border border-gray-300">211.51729</td>
              <td className="p-1 border border-gray-300">1.8331352</td>
              <td className="p-1 border border-gray-300">1.8636041</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="p-1 border border-gray-300 font-bold text-left whitespace-nowrap">1 CNY</td>
              <td className="p-1 border border-gray-300">0.146845</td>
              <td className="p-1 border border-gray-300">0.1262966</td>
              <td className="p-1 border border-gray-300">0.1101737</td>
              <td className="p-1 border border-gray-300">1</td>
              <td className="p-1 border border-gray-300">23.303646</td>
              <td className="p-1 border border-gray-300">0.2019633</td>
              <td className="p-1 border border-gray-300">0.2053202</td>
            </tr>
            <tr className="bg-white">
              <td className="p-1 border border-gray-300 font-bold text-left whitespace-nowrap">1 JPY</td>
              <td className="p-1 border border-gray-300">0.0063814</td>
              <td className="p-1 border border-gray-300">0.0054896</td>
              <td className="p-1 border border-gray-300">0.0047277</td>
              <td className="p-1 border border-gray-300">0.0429117</td>
              <td className="p-1 border border-gray-300">1</td>
              <td className="p-1 border border-gray-300">0.0086666</td>
              <td className="p-1 border border-gray-300">0.0088106</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="p-1 border border-gray-300 font-bold text-left whitespace-nowrap">1 CAD</td>
              <td className="p-1 border border-gray-300">0.727088</td>
              <td className="p-1 border border-gray-300">0.625344</td>
              <td className="p-1 border border-gray-300">0.545514</td>
              <td className="p-1 border border-gray-300">4.951394</td>
              <td className="p-1 border border-gray-300">115.38554</td>
              <td className="p-1 border border-gray-300">1</td>
              <td className="p-1 border border-gray-300">1.0166212</td>
            </tr>
            <tr className="bg-white">
              <td className="p-1 border border-gray-300 font-bold text-left whitespace-nowrap">1 AUD</td>
              <td className="p-1 border border-gray-300">0.7152</td>
              <td className="p-1 border border-gray-300">0.61512</td>
              <td className="p-1 border border-gray-300">0.536595</td>
              <td className="p-1 border border-gray-300">4.870441</td>
              <td className="p-1 border border-gray-300">113.49905</td>
              <td className="p-1 border border-gray-300">0.983651</td>
              <td className="p-1 border border-gray-300">1</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="font-bold text-[13px] mt-6 mb-1">All Currencies:</p>
      <div className="border border-[#1c4587]">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-[#1c4587] text-white">
              <th className="p-1 border border-[#1c4587] w-[40%]">Click below to select a base currency</th>
              <th className="p-1 border border-[#1c4587] w-[20%] text-center">USD</th>
              <th className="p-1 border border-[#1c4587] w-[20%] text-center">EUR</th>
              <th className="p-1 border border-[#1c4587] w-[20%] text-center">GBP</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="p-1 border border-gray-300"><a href="/financial-calculators/currency-calculator" className="text-blue-600 underline">AED-United Arab Emirates Dirham</a></td>
              <td className="p-1 border border-gray-300 text-center">0.2722941<br/>(3.6725)</td>
              <td className="p-1 border border-gray-300 text-center">0.2341913<br/>(4.270016)</td>
              <td className="p-1 border border-gray-300 text-center">0.2042946<br/>(4.894891)</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="p-1 border border-gray-300"><a href="/financial-calculators/currency-calculator" className="text-blue-600 underline">AFN-Afghan Afghani</a></td>
              <td className="p-1 border border-gray-300 text-center">0.016<br/>(62.49999)</td>
              <td className="p-1 border border-gray-300 text-center">0.013761<br/>(72.66875)</td>
              <td className="p-1 border border-gray-300 text-center">0.0120046<br/>(83.30311)</td>
            </tr>
            <tr className="bg-white">
              <td className="p-1 border border-gray-300"><a href="/financial-calculators/currency-calculator" className="text-blue-600 underline">ALL-Albanian Lek</a></td>
              <td className="p-1 border border-gray-300 text-center">0.01216799<br/>(82.18293)</td>
              <td className="p-1 border border-gray-300 text-center">0.01046529<br/>(95.5541)</td>
              <td className="p-1 border border-gray-300 text-center">0.0091292<br/>(109.53751)</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="p-1 border border-gray-300"><a href="/financial-calculators/currency-calculator" className="text-blue-600 underline">AMD-Armenian Dram</a></td>
              <td className="p-1 border border-gray-300 text-center">0.00270638<br/>(369.5008)</td>
              <td className="p-1 border border-gray-300 text-center">0.00232766<br/>(429.6187)</td>
              <td className="p-1 border border-gray-300 text-center">0.0020305<br/>(492.4892)</td>
            </tr>
            <tr className="bg-white">
              <td className="p-1 border border-gray-300"><a href="/financial-calculators/currency-calculator" className="text-blue-600 underline">ANG-Netherlands Antillean Guilder</a></td>
              <td className="p-1 border border-gray-300 text-center">0.558659<br/>(1.79)</td>
              <td className="p-1 border border-gray-300 text-center">0.480484<br/>(2.0812332)</td>
              <td className="p-1 border border-gray-300 text-center">0.419146<br/>(2.3858014)</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="p-1 border border-gray-300"><a href="/financial-calculators/currency-calculator" className="text-blue-600 underline">AOA-Angolan Kwanza</a></td>
              <td className="p-1 border border-gray-300 text-center">0.00108932<br/>(918)</td>
              <td className="p-1 border border-gray-300 text-center">0.00093688<br/>(1067.3587)</td>
              <td className="p-1 border border-gray-300 text-center">0.00081728<br/>(1223.5663)</td>
            </tr>
            <tr className="bg-white">
              <td className="p-1 border border-gray-300 text-center text-gray-500 italic" colSpan={4}>
                (Representative sample of 150+ currencies. Complete list follows same alternating row structure)
              </td>
            </tr>
            <tr className="bg-gray-100">
              <td className="p-1 border border-gray-300"><a href="/financial-calculators/currency-calculator" className="text-blue-600 underline">ZWL-Zimbabwean Dollar</a></td>
              <td className="p-1 border border-gray-300 text-center">0.00310559<br/>(322)</td>
              <td className="p-1 border border-gray-300 text-center">0.0026702<br/>(374.3694)</td>
              <td className="p-1 border border-gray-300 text-center">0.00233004<br/>(429.1777)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-1">* numbers in parenthesis are the inverse</p>
    </div>
  );
}
