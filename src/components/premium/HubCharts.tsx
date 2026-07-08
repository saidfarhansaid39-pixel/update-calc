'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'

const COLORS = ['#1a3a8a', '#d62828', '#f77f00', '#2a9d8f', '#e9c46a', '#264653', '#e76f51', '#287271', '#6b7280', '#8b5cf6']

export function HealthBarChart({ data }: { data: { name: string; value: number; target?: number }[] }) {
  if (!data.length) return null
  return (
    <div className="w-full">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">Health Metrics</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#1a3a8a" />
          {data[0]?.target !== undefined && <Bar dataKey="target" radius={[4, 4, 0, 0]} fill="#f77f00" />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function MathPieChart({ data }: { data: { name: string; value: number }[] }) {
  if (!data.length) return null
  return (
    <div className="w-full">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">Distribution</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function EngineeringRadarChart({ data }: { data: { metric: string; value: number; max: number }[] }) {
  if (!data.length) return null
  return (
    <div className="w-full">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">Performance Profile</p>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fontSize: 9 }} />
          <Radar name="Value" dataKey="value" stroke="#06b6d4" fill="#1a3a8a" fillOpacity={0.3} />
          {data[0]?.max !== undefined && <Radar name="Max" dataKey="max" stroke="#d62828" fill="#d62828" fillOpacity={0.1} />}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ProgressBarChart({ data }: { data: { label: string; current: number; goal: number }[] }) {
  if (!data.length) return null
  return (
    <div className="w-full space-y-2">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 text-center">Progress Toward Goals</p>
      {data.map((d, i) => (
        <div key={i} className="space-y-0.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">{d.label}</span>
            <span className="font-medium">{d.current.toFixed(0)} / {d.goal.toFixed(0)}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-[#1a3a8a] to-[#06b6d4] h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (d.current / d.goal) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export function TimelineChart({ data }: { data: { period: string; value: number }[] }) {
  if (!data.length) return null
  return (
    <div className="w-full">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">Timeline</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="period" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ComparisonPieChart({ data }: { data: { name: string; value: number }[] }) {
  if (!data.length) return null
  return (
    <div className="w-full">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">Breakdown</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
