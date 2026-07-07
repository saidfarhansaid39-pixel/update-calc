'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts'

const COLORS = ['#1a759f', '#d62828', '#f77f00', '#2a9d8f', '#e9c46a', '#264653', '#e76f51', '#287271']

export function LoanDonutChart({ principal, totalInterest }: { principal: number; totalInterest: number }) {
  const data = [
    { name: 'Principal', value: principal },
    { name: 'Total Interest', value: totalInterest },
  ]
  return (
    <div className="w-full" role="img" aria-label={`Payment breakdown: $${principal.toFixed(0)} principal, $${totalInterest.toFixed(0)} total interest`}>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">Payment Breakdown</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" isAnimationActive={false}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v: number) => `$${v.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function InvestmentGrowthChart({ data }: { data: { year: number; value: number; contributions: number }[] }) {
  if (data.length === 0) return null
  const lastYear = data[data.length - 1]
  return (
    <div className="w-full" role="img" aria-label={`Investment growth projection: $${lastYear?.value?.toFixed(0)} portfolio value after ${lastYear?.year} years`}>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">Growth Projection</p>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="year" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(v: number) => `$${v.toFixed(2)}`} />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} name="Portfolio Value" dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="contributions" stroke="#f77f00" strokeWidth={2} name="Total Contributions" dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ComparisonBarChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const maxItem = data.reduce((a, b) => (a.value > b.value ? a : b), data[0])
  return (
    <div className="w-full" role="img" aria-label={`Comparison chart: ${maxItem?.name} has highest value of $${maxItem?.value?.toFixed(0)}`}>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">Comparison</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(v: number) => `$${v.toFixed(2)}`} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false}>
            {data.map((d, i) => <Cell key={i} fill={d.color || COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AmortizationChart({ data }: { data: { year: number; balance: number }[] }) {
  if (data.length === 0) return null
  const last = data[data.length - 1]
  return (
    <div className="w-full" role="img" aria-label={`Amortization schedule: $${last?.balance?.toFixed(0)} remaining balance after ${last?.year} years`}>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">Amortization Schedule</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="year" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(v: number) => `$${v.toFixed(2)}`} />
          <Line type="monotone" dataKey="balance" stroke="#06b6d4" strokeWidth={2} name="Remaining Balance" dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
