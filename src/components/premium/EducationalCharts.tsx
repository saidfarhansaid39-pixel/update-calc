'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ReferenceLine, ReferenceArea } from 'recharts'

const COLORS = ['#1a759f', '#d62828', '#f77f00', '#2a9d8f', '#e9c46a', '#264653']

export function FormulaChart({ formula, variables }: { formula: string; variables: { name: string; value: number; min: number; max: number }[] }) {
  if (!variables.length) return null
  const data = Array.from({ length: 20 }, (_, i) => {
    const t = i / 19
    const pt: Record<string, number> = { x: t }
    variables.forEach((v, vi) => {
      pt[v.name] = v.min + t * (v.max - v.min)
    })
    pt['y'] = variables.reduce((acc, v) => acc + pt[v.name], 0)
    return pt
  })
  return (
    <div className="w-full">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">Formula Visualization</p>
      <p className="text-xs text-center font-mono text-gray-600 dark:text-gray-400 mb-2">{formula}</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="x" tick={{ fontSize: 10 }} tickFormatter={(v: number) => (v * 100).toFixed(0) + '%'} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Area type="monotone" dataKey="y" stroke="#06b6d4" fill="#1a3a8a" fillOpacity={0.2} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ConceptDiagram({ nodes, edges }: { nodes: { id: string; label: string; x: number; y: number; color?: string }[]; edges: { from: string; to: string; label?: string }[] }) {
  if (!nodes.length) return null
  return (
    <div className="w-full">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">Concept Diagram</p>
      <svg viewBox="0 0 400 200" className="w-full h-auto max-h-52">
        {edges.map((e, i) => {
          const from = nodes.find(n => n.id === e.from)
          const to = nodes.find(n => n.id === e.to)
          if (!from || !to) return null
          return (
            <g key={i}>
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#d1d5db" strokeWidth={2} markerEnd="url(#arrow)" />
              {e.label && (
                <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 8} textAnchor="middle" className="text-[9px] fill-gray-400">
                  {e.label}
                </text>
              )}
            </g>
          )
        })}
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#d1d5db" />
          </marker>
        </defs>
        {nodes.map((n, i) => (
          <g key={i}>
            <rect x={n.x - 40} y={n.y - 14} width={80} height={28} rx={8} fill={n.color || '#1a3a8a'} opacity={0.15} />
            <text x={n.x} y={n.y + 4} textAnchor="middle" className="text-[10px] fill-gray-700 dark:fill-gray-300 font-medium">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export function ProcessFlowChart({ steps: flowSteps }: { steps: { label: string; description: string; icon?: string }[] }) {
  if (!flowSteps.length) return null
  return (
    <div className="w-full">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 text-center">Process Flow</p>
      <div className="flex items-start gap-2 overflow-x-auto pb-2">
        {flowSteps.map((s, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center min-w-[100px]">
              <div className="w-8 h-8 rounded-full bg-[#1a3a8a]/10 text-[#06b6d4] flex items-center justify-center text-xs font-bold border-2 border-[#06b6d4]/30">
                {s.icon || i + 1}
              </div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1 text-center">{s.label}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center mt-0.5">{s.description}</p>
            </div>
            {i < flowSteps.length - 1 && (
              <div className="flex items-center pt-3">
                <div className="w-6 h-0.5 bg-gray-300 dark:bg-gray-600" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export function VariableRelationshipChart({ data }: { data: { independent: string; dependent: string; points: { x: number; y: number }[] } }) {
  if (!data.points.length) return null
  return (
    <div className="w-full">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">{data.dependent} vs {data.independent}</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data.points.map(p => ({ ...p }))}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="x" tick={{ fontSize: 10 }} label={{ value: data.independent, position: 'bottom', fontSize: 10, fill: '#9ca3af' }} />
          <YAxis tick={{ fontSize: 10 }} label={{ value: data.dependent, angle: -90, position: 'left', fontSize: 10, fill: '#9ca3af' }} />
          <Tooltip />
          <Line type="monotone" dataKey="y" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3, fill: '#1a3a8a' }} name={data.dependent} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function RangeIndicator({ value, min, max, goodMin, goodMax, label, unit }: { value: number; min: number; max: number; goodMin: number; goodMax: number; label: string; unit?: string }) {
  const pct = ((value - min) / (max - min)) * 100
  const goodPctMin = ((goodMin - min) / (max - min)) * 100
  const goodPctMax = ((goodMax - min) / (max - min)) * 100
  const isGood = value >= goodMin && value <= goodMax
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{label}</span>
        <span className="font-medium text-gray-900 dark:text-white">{value.toFixed(1)}{unit}</span>
      </div>
      <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="h-full bg-red-300 dark:bg-red-800/40" style={{ width: `${goodPctMin}%` }} />
          <div className="h-full bg-green-300 dark:bg-green-800/40" style={{ width: `${goodPctMax - goodPctMin}%` }} />
          <div className="h-full bg-red-300 dark:bg-red-800/40" style={{ width: `${100 - goodPctMax}%` }} />
        </div>
        <div className="absolute top-0 bottom-0 w-2 bg-[#1a3a8a] rounded-full shadow-md transition-all duration-500" style={{ left: `calc(${pct}% - 4px)` }} />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400">
        <span>{min}{unit}</span>
        <span className={isGood ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-500 dark:text-red-400 font-medium'}>
          {isGood ? 'Good range' : 'Outside range'}
        </span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}
