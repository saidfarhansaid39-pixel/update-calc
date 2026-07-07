"use client";

import React from 'react';

export function AnnuityResults({ results }: any) {
  if (!results) return null;

  const totalPrincipal = results.principal;
  const totalInterest = results.totalInterest;
  const totalPayout = totalPrincipal + totalInterest;

  const pPct = (totalPrincipal / totalPayout) * 100 || 0;
  const iPct = (totalInterest / totalPayout) * 100 || 0;

  // For pie chart
  const pAngle = (pPct / 100) * 360;
  
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const drawArc = (percent: number, offsetPercent: number, color: string) => {
    const [startX, startY] = getCoordinatesForPercent(offsetPercent);
    const [endX, endY] = getCoordinatesForPercent(offsetPercent + percent);
    const largeArcFlag = percent > 0.5 ? 1 : 0;
    const pathData = [
      `M ${startX} ${startY}`,
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      `L 0 0`,
    ].join(' ');
    return <path d={pathData} fill={color} />;
  };

  // Line chart path generation
  const maxBalance = Math.max(...results.schedule.map((y: any) => y.beginning));
  const maxInterest = Math.max(...results.schedule.map((y: any) => y.interest));
  const maxVal = Math.max(maxBalance, maxInterest);
  
  const w = 300;
  const h = 150;
  const numYears = results.schedule.length;

  let balancePath = "";
  let interestPath = "";
  
  results.schedule.forEach((y: any, i: number) => {
    const x = (i / Math.max(1, numYears - 1)) * w;
    const bY = h - (y.beginning / maxVal) * h;
    const iY = h - (y.interest / maxVal) * h;
    
    if (i === 0) {
      balancePath += `M ${x} ${bY} `;
      interestPath += `M ${x} ${iY} `;
    } else {
      balancePath += `L ${x} ${bY} `;
      interestPath += `L ${x} ${iY} `;
    }
  });

  return (
    <div className="w-full flex flex-col font-sans text-[13px] text-gray-800 mt-4 md:mt-0">
      
      {/* Top Results Box */}
      <div className="bg-[#e4eedb] border border-[#599e28] rounded mb-6 w-full max-w-[400px]">
        <div className="bg-[#599e28] text-white p-2 font-bold flex justify-between items-center">
          <span className="text-[16px]">Result</span>
        </div>
        <div className="p-4">
          {results.mode === 'length' ? (
            <div className="text-[16px] mb-4">
              You can withdraw <strong className="text-[#1c4587] text-[18px]">${results.payment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</strong> {results.freqLabel}.
            </div>
          ) : (
            <div className="text-[16px] mb-4">
              You can withdraw <strong className="text-[#1c4587] text-[18px]">${results.payment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</strong> {results.freqLabel} for <strong className="text-black">{results.totalPeriods}</strong> periods ({results.yearsStr}).
            </div>
          )}

          <div className="mb-1">Total of {results.totalPeriods} payments: <strong>${totalPayout.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></div>
          <div className="mb-4">Total interest/return: <strong>${totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></div>

          <div className="flex items-center gap-6 justify-center mt-6">
            <div className="relative w-24 h-24">
              <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full">
                {drawArc(pPct/100, 0, '#1c4587')}
                {drawArc(iPct/100, pPct/100, '#8ec449')}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-[10px] font-bold pointer-events-none">
                <span className="absolute top-[20%] left-[20%] text-white">{pPct.toFixed(0)}%</span>
                <span className="absolute bottom-[20%] right-[20%] text-black">{iPct.toFixed(0)}%</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-[12px]">
              <div className="flex items-center gap-1"><span className="w-4 h-4 bg-[#1c4587] inline-block"></span> Starting principal</div>
              <div className="flex items-center gap-1"><span className="w-4 h-4 bg-[#8ec449] inline-block"></span> Interest/return</div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-[18px] text-[#1c4587] mb-2 font-sans mt-4">Annuity Balances</h3>
      
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <table className="w-full lg:w-[350px] border-collapse text-center text-[12px] border border-gray-300">
          <thead>
            <tr className="bg-[#466a9b] text-white">
              <th className="p-1 border border-gray-300 font-bold">Year</th>
              <th className="p-1 border border-gray-300 font-bold leading-tight">Beginning<br/>balance</th>
              <th className="p-1 border border-gray-300 font-bold leading-tight">Interest/return</th>
              <th className="p-1 border border-gray-300 font-bold leading-tight">Ending<br/>balance</th>
            </tr>
          </thead>
          <tbody className="bg-[#f2f2f2]">
            {results.schedule.map((y: any) => (
              <tr key={y.year} className="border-b border-white hover:bg-[#e6e6e6]">
                <td className="p-1">{y.year}</td>
                <td className="p-1 text-right">${y.beginning.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td className="p-1 text-right">${y.interest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td className="p-1 text-right">${y.ending.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Line Chart */}
        <div className="border border-gray-300 p-4 bg-white relative w-[350px] h-[200px] flex-shrink-0">
          <div className="absolute top-2 right-2 text-[11px] flex flex-col gap-1">
            <div className="flex items-center gap-1"><span className="w-4 h-1 bg-[#1c4587] inline-block"></span> Balance</div>
            <div className="flex items-center gap-1"><span className="w-4 h-1 bg-[#8ec449] inline-block"></span> Interest/return</div>
          </div>
          <svg width={w} height={h} className="mt-6 ml-8 overflow-visible">
            {/* Grid lines */}
            <line x1="0" y1="0" x2={w} y2="0" stroke="#e0e0e0" strokeWidth="1" />
            <line x1="0" y1={h/2} x2={w} y2={h/2} stroke="#e0e0e0" strokeWidth="1" />
            <line x1="0" y1={h} x2={w} y2={h} stroke="#999" strokeWidth="1" />
            
            <line x1="0" y1="0" x2="0" y2={h} stroke="#999" strokeWidth="1" />
            <line x1={w/2} y1="0" x2={w/2} y2={h} stroke="#e0e0e0" strokeWidth="1" />
            <line x1={w} y1="0" x2={w} y2={h} stroke="#e0e0e0" strokeWidth="1" />
            
            {/* Y-axis labels */}
            <text x="-5" y="5" textAnchor="end" fontSize="10" fill="#666">${(maxVal/1000).toFixed(0)}K</text>
            <text x="-5" y={h/2 + 5} textAnchor="end" fontSize="10" fill="#666">${((maxVal/2)/1000).toFixed(0)}K</text>
            <text x="-5" y={h + 5} textAnchor="end" fontSize="10" fill="#666">$0</text>
            
            {/* X-axis labels */}
            <text x={0} y={h + 15} textAnchor="middle" fontSize="10" fill="#666">0</text>
            <text x={w/2} y={h + 15} textAnchor="middle" fontSize="10" fill="#666">{(numYears/2).toFixed(1)}</text>
            <text x={w} y={h + 15} textAnchor="middle" fontSize="10" fill="#666">{numYears}</text>
            <text x={w/2} y={h + 30} textAnchor="middle" fontSize="11" fill="#000">Year</text>

            <path d={balancePath} fill="none" stroke="#1c4587" strokeWidth="2" />
            <path d={interestPath} fill="none" stroke="#8ec449" strokeWidth="2" />
            
            {results.schedule.map((y: any, i: number) => {
              const x = (i / Math.max(1, numYears - 1)) * w;
              const bY = h - (y.beginning / maxVal) * h;
              const iY = h - (y.interest / maxVal) * h;
              return (
                <g key={i}>
                  <circle cx={x} cy={bY} r="2" fill="#1c4587" />
                  <circle cx={x} cy={iY} r="2" fill="#8ec449" />
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
