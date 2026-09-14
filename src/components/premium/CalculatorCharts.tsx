'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts'
import { useCurrency } from '@/lib/context/CurrencyContext'

const COLORS = ['#1a3a8a', '#06b6d4', '#f77f00', '#2a9d8f', '#e9c46a', '#264653', '#e76f51', '#287271']

function curr(v: number, sym: string) {
  return `${sym}${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

const chartGridStroke = '#e5e7eb'
const chartGridStrokeDark = '#334155'

function ChartTooltip({ active, payload, label, currencySymbol }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-3 py-2 text-sm">
      {label !== undefined && <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs font-medium text-gray-900 dark:text-gray-100">
          {p.name}: {currencySymbol}{p.value.toFixed(2)}
        </p>
      ))}
    </div>
  )
}

interface DataPoint {
  year?: number
  value: number
}

export function LoanDonutChart({ principal, totalInterest }: { principal: number; totalInterest: number }) {
  const { currencySymbol } = useCurrency()
  const data = [
    { name: 'Principal', value: Math.max(0, principal) },
    { name: 'Total Interest', value: Math.max(0, totalInterest) },
  ]
  if (principal <= 0 && totalInterest <= 0) {
    return <div className="w-full min-h-[120px] flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">Enter loan details to see breakdown</div>
  }
  return (
    <div className="w-full" role="img" aria-label={`Payment breakdown: ${curr(principal, currencySymbol)} principal, ${curr(totalInterest, currencySymbol)} total interest`}>
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 text-center">Payment Breakdown</p>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" isAnimationActive={false}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip content={<ChartTooltip currencySymbol={currencySymbol} />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function InvestmentGrowthChart({
  data,
  onDotClick,
}: {
  data: { year: number; value: number; contributions: number }[]
  onDotClick?: (point: DataPoint) => void
}) {
  const { currencySymbol } = useCurrency()
  const { currency } = useCurrency()
  if (data.length === 0) {
    return <div className="w-full min-h-[120px] flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">Enter investment details to see growth projection</div>
  }
  const lastYear = data[data.length - 1]
  return (
    <div className="w-full" role="img" aria-label={`Investment growth projection: ${curr(lastYear?.value ?? 0, currencySymbol)} portfolio value after ${lastYear?.year} years`}>
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 text-center">Growth Projection</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} onClick={(e) => {
          if (e?.activePayload?.[0]?.payload && onDotClick) {
            onDotClick({ year: e.activePayload[0].payload.year, value: e.activePayload[0].payload.value })
          }
        }}>
          <defs>
            <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f77f00" stopOpacity={1} />
              <stop offset="100%" stopColor="#f77f00" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} className="dark:stroke-gray-700" />
          <XAxis dataKey="year" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${currencySymbol}${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<ChartTooltip currencySymbol={currencySymbol} />} />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="url(#valueGrad)" strokeWidth={2} name="Portfolio Value" dot={onDotClick ? (props: any) => {
            const { cx, cy, payload } = props
            return (
              <circle
                cx={cx} cy={cy} r={5}
                fill="#06b6d4"
                style={{ cursor: 'pointer' }}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  onDotClick({ year: payload.year, value: payload.value })
                }}
              />
            )
          } : false} isAnimationActive={false} />
          <Line type="monotone" dataKey="contributions" stroke="url(#contribGrad)" strokeWidth={2} name="Total Contributions" dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
      {onDotClick && (
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-1">
          Click any data point to jump to that year
        </p>
      )}
    </div>
  )
}

export function ComparisonBarChart({ data, onBarClick }: { data: { name: string; value: number; color: string }[]; onBarClick?: (name: string) => void }) {
  const { currencySymbol } = useCurrency()
  if (!data || !data.length) {
    return <div className="w-full min-h-[120px] flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">Add items to compare</div>
  }
  const maxItem = data.reduce((a, b) => (a.value > b.value ? a : b), data[0])
  return (
    <div className="w-full" role="img" aria-label={`Comparison chart: ${maxItem?.name} has highest value of ${curr(maxItem?.value ?? 0, currencySymbol)}`}>
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 text-center">Comparison</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} className="dark:stroke-gray-700" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${currencySymbol}${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<ChartTooltip currencySymbol={currencySymbol} />} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={false} onClick={(_, index) => {
            if (onBarClick) onBarClick(data[index]?.name || '')
          }}>
            {data.map((d, i) => <Cell key={i} fill={d.color || COLORS[i % COLORS.length]} style={{ cursor: onBarClick ? 'pointer' : 'default' }} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AmortizationChart({ data, onDotClick }: { data: { year: number; balance: number }[]; onDotClick?: (point: DataPoint) => void }) {
  const { currencySymbol } = useCurrency()
  if (data.length === 0) {
    return <div className="w-full min-h-[120px] flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">Enter loan details to see amortization schedule</div>
  }
  const last = data[data.length - 1]
  return (
    <div className="w-full" role="img" aria-label={`Amortization schedule: ${curr(last?.balance ?? 0, currencySymbol)} remaining balance after ${last?.year} years`}>
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 text-center">Amortization Schedule</p>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} onClick={(e) => {
          if (e?.activePayload?.[0]?.payload && onDotClick) {
            onDotClick({ year: e.activePayload[0].payload.year, value: e.activePayload[0].payload.balance })
          }
        }}>
          <defs>
            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} className="dark:stroke-gray-700" />
          <XAxis dataKey="year" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${currencySymbol}${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<ChartTooltip currencySymbol={currencySymbol} />} />
          <Line type="monotone" dataKey="balance" stroke="url(#balanceGrad)" strokeWidth={2} name="Remaining Balance" dot={onDotClick ? (props: any) => {
            const { cx, cy, payload } = props
            return (
              <circle
                cx={cx} cy={cy} r={5}
                fill="#06b6d4"
                style={{ cursor: 'pointer' }}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  onDotClick({ year: payload.year, value: payload.balance })
                }}
              />
            )
          } : false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
      {onDotClick && (
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-1">
          Click any point to jump to that year
        </p>
      )}
    </div>
  )
}
