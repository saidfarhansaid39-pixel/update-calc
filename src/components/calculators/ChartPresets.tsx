'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ChartProps {
  data: { name: string; value: number }[];
  colors?: string[];
}

export function CalculatorPieChart({ data, colors = ['#1f77b4', '#8ebf42'] }: ChartProps) {
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  
  return (
    <div className="h-[120px] my-2 flex justify-center">
      <div className="w-[120px] h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.filter(d => d.value > 0)}
              innerRadius={25}
              outerRadius={60}
              paddingAngle={0}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-[120px] flex flex-col justify-center gap-1 text-[11px] ml-2">
        {data.filter(d => d.value > 0).map((entry, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors[idx % colors.length] }}></div>
            <span className="leading-tight">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
