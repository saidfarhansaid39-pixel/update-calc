'use client'

import React, { useState, useMemo } from 'react'

// Approximate CDC BMI-for-age median (50th percentile) by age in years (2-20).
const MEDIAN_BOYS = [16.1, 15.8, 15.6, 15.5, 15.5, 15.6, 15.9, 16.3, 16.8, 17.4, 18.0, 18.7, 19.4, 20.1, 20.7, 21.2, 21.6, 21.9, 22.1]
const MEDIAN_GIRLS = [15.7, 15.5, 15.4, 15.4, 15.5, 15.6, 15.8, 16.1, 16.5, 17.0, 17.6, 18.2, 18.9, 19.5, 20.0, 20.4, 20.7, 20.9, 21.0]
const S_CV = 0.09 // approximate BMI coefficient of variation (CDC)

function erf(x: number): number {
  const sign = x < 0 ? -1 : 1
  const ax = Math.abs(x)
  const t = 1 / (1 + 0.3275911 * ax)
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-ax * ax)
  return sign * y
}

function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2))
}

function medianFor(sex: 'boy' | 'girl', ageMonths: number): number {
  const arr = sex === 'boy' ? MEDIAN_BOYS : MEDIAN_GIRLS
  const years = ageMonths / 12
  const clamped = Math.max(2, Math.min(20, years))
  const idx = clamped - 2
  const lo = Math.floor(idx)
  const hi = Math.min(arr.length - 1, lo + 1)
  const frac = idx - lo
  return arr[lo] + (arr[hi] - arr[lo]) * frac
}

function percentileFor(sex: 'boy' | 'girl', ageMonths: number, bmi: number): number {
  const m = medianFor(sex, ageMonths)
  const z = (bmi - m) / (m * S_CV)
  return normalCdf(z) * 100
}

const PERCENTILES = [5, 10, 25, 50, 75, 90, 95]
const ZS = { 5: -2.0537, 10: -1.6449, 25: -0.6745, 50: 0, 75: 0.6745, 90: 1.6449, 95: 2.0537 }

interface Props {
  defaultSex?: 'boy' | 'girl'
}

export function ChildBmiCalculator({ defaultSex = 'boy' }: Props) {
  const [sex, setSex] = useState<'boy' | 'girl'>(defaultSex)
  const [years, setYears] = useState('8')
  const [months, setMonths] = useState('0')
  const [heightCm, setHeightCm] = useState('130')
  const [weightKg, setWeightKg] = useState('28')

  const result = useMemo(() => {
    const y = parseFloat(years)
    const mo = parseFloat(months) || 0
    const h = parseFloat(heightCm)
    const w = parseFloat(weightKg)
    if (isNaN(y) || isNaN(h) || isNaN(w) || h <= 0 || w <= 0 || y < 2 || y > 20) return null
    const ageMonths = y * 12 + mo
    const bmi = w / Math.pow(h / 100, 2)
    const pct = percentileFor(sex, ageMonths, bmi)
    const category = pct < 5 ? 'Underweight' : pct < 85 ? 'Healthy weight' : pct < 95 ? 'Overweight' : 'Obese'
    return { bmi, pct, category, ageMonths }
  }, [sex, years, months, heightCm, weightKg])

  const chart = useMemo(() => {
    const W = 520, H = 260, pad = 30
    const xMin = 2, xMax = 20
    const allValues: number[] = []
    const curves = PERCENTILES.map(p => {
      const pts: string[] = []
      for (let age = xMin; age <= xMax; age += 1) {
        const m = medianFor(sex, age * 12)
        const val = m * (1 + S_CV * ZS[p as keyof typeof ZS])
        allValues.push(val)
        const x = pad + ((age - xMin) / (xMax - xMin)) * (W - pad * 2)
        const y = H - pad - ((val - 12) / (30 - 12)) * (H - pad * 2)
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
      }
      return { p, pts: pts.join(' ') }
    })
    const childPt = result
      ? (() => {
          const ageY = Math.max(xMin, Math.min(xMax, result.ageMonths / 12))
          const x = pad + ((ageY - xMin) / (xMax - xMin)) * (W - pad * 2)
          const y = H - pad - ((result.bmi - 12) / (30 - 12)) * (H - pad * 2)
          return { x, y }
        })()
      : null
    return { W, H, pad, curves, childPt }
  }, [sex, result])

  const labels = [2, 5, 10, 15, 20]

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex gap-2">
          {(['boy', 'girl'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSex(s)}
              className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${sex === s ? 'bg-[#1a3a8a] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
              aria-pressed={sex === s}
            >
              {s === 'boy' ? 'Boy' : 'Girl'}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Age (years)</span>
            <input type="number" min={2} max={20} value={years} onChange={e => setYears(e.target.value)} className="mt-1 flex h-11 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 text-base" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Age (months)</span>
            <input type="number" min={0} max={11} value={months} onChange={e => setMonths(e.target.value)} className="mt-1 flex h-11 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 text-base" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Height (cm)</span>
            <input type="number" min={50} max={220} value={heightCm} onChange={e => setHeightCm(e.target.value)} className="mt-1 flex h-11 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 text-base" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Weight (kg)</span>
            <input type="number" min={5} max={200} value={weightKg} onChange={e => setWeightKg(e.target.value)} className="mt-1 flex h-11 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 text-base" />
          </label>
        </div>

        {result && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">BMI</p>
            <p className="text-3xl font-bold text-[#06b6d4]">{result.bmi.toFixed(1)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {result.pct.toFixed(1)}th percentile &middot; <span className="font-semibold">{result.category}</span>
            </p>
          </div>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Approximate BMI-for-age percentiles based on the CDC growth reference (median curve + coefficient of variation). For informational use only, not a medical diagnosis.
        </p>
      </div>

      <div className="card-premium dark:bg-gray-800 dark:border-gray-700 p-4 overflow-x-auto">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">BMI-for-age growth chart</p>
        <svg viewBox={`0 0 ${chart.W} ${chart.H}`} className="w-full" role="img" aria-label="BMI-for-age percentile growth chart">
          {labels.map(l => {
            const x = chart.pad + ((l - 2) / 18) * (chart.W - chart.pad * 2)
            return <text key={l} x={x} y={chart.H - 8} textAnchor="middle" className="fill-gray-400" fontSize="10">{l}</text>
          })}
          {chart.curves.map(c => (
            <polyline key={c.p} points={c.pts} fill="none" stroke={c.p === 50 ? '#1a3a8a' : '#06b6d4'} strokeWidth={c.p === 50 ? 2.5 : 1.2} strokeOpacity={c.p === 50 ? 1 : 0.6} />
          ))}
          {chart.childPt && (
            <circle cx={chart.childPt.x} cy={chart.childPt.y} r={5} fill="#ef4444" stroke="#fff" strokeWidth={1.5} />
          )}
        </svg>
        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 bg-[#1a3a8a]" /> 50th</span>
          <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 bg-[#06b6d4]" /> 5-95th</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-red-500" /> Child</span>
        </div>
      </div>
    </div>
  )
}
