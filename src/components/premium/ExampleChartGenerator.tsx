'use client'

import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { cn } from '@/lib/utils'

const COLORS = ['#1a3a8a', '#f77f00', '#2a9d8f', '#d62828', '#e9c46a']

interface ExampleItem {
  label: string
  inputs: Record<string, string>
  output: string
  outputLabel?: string
  chartData?: { name: string; value: number }[]
  steps?: { label: string; value: string }[]
}

interface ExampleChartGeneratorProps {
  beginner: ExampleItem
  typical: ExampleItem
  advanced: ExampleItem
  realworld?: ExampleItem
  chartType?: 'bar' | 'line' | 'pie'
}

export function ExampleChartGenerator({ beginner, typical, advanced, realworld, chartType = 'bar' }: ExampleChartGeneratorProps) {
  const [active, setActive] = useState<'beginner' | 'typical' | 'advanced' | 'realworld'>('beginner')
  const examples = { beginner, typical, advanced, ...(realworld ? { realworld } : {}) }
  const current = examples[active]
  if (!current) return null

  const renderChart = (data?: { name: string; value: number }[]) => {
    if (!data || !data.length) return null
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
    }
  }

  const tabs = [
    { id: 'beginner' as const, label: 'Beginner' },
    { id: 'typical' as const, label: 'Typical' },
    { id: 'advanced' as const, label: 'Advanced' },
    ...(realworld ? [{ id: 'realworld' as const, label: 'Real-World' }] : []),
  ]

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              'px-3 py-2 text-xs font-medium border-b-2 transition-colors',
              active === tab.id ? 'border-[#06b6d4] text-[#06b6d4]' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Inputs</p>
          <div className="space-y-1.5">
            {Object.entries(current.inputs).map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-lg">
                <span className="text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-medium text-gray-900 dark:text-white">{v}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 mb-1">{current.outputLabel || 'Result'}</p>
            <p className="text-lg font-bold text-[#06b6d4]">{current.output}</p>
          </div>
          {current.steps && current.steps.length > 0 && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-1">
              <p className="text-xs font-medium text-gray-500 mb-1">Steps</p>
              {current.steps.map((s, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs">
                  <span className="text-gray-400 font-mono">{i + 1}.</span>
                  <span className="text-gray-600 dark:text-gray-400">{s.label}</span>
                  <span className="font-medium text-gray-900 dark:text-white ml-auto">{s.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          {renderChart(current.chartData)}
        </div>
      </div>
    </div>
  )
}
