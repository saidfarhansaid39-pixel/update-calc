import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ initialValue: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), finalValue: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), years: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'initialValue', label: 'Initial Value', type: 'number', min: 1, step: '100' },
    { name: 'finalValue', label: 'Final Value', type: 'number', min: 1, step: '100' },
    { name: 'years', label: 'Time Period (years)', type: 'number', min: 0.5, step: '1' },
  ],
  compute: (v) => { const iv = parseFloat(v.initialValue)||0; const fv = parseFloat(v.finalValue)||0; const y = parseFloat(v.years)||0; const totalGrowth = ((fv - iv) / iv) * 100; const cagr = iv > 0 && y > 0 ? (Math.pow(fv / iv, 1 / y) - 1) * 100 : 0; const annualAbsolute = (fv - iv) / y; return { result: cagr, label: 'CAGR', unit: '%', steps: [{ label: 'Total Growth', value: `${totalGrowth.toFixed(1)}%` }, { label: 'CAGR (Annualized)', value: `${cagr.toFixed(2)}%` }, { label: 'Avg Annual Change', value: `$${annualAbsolute.toFixed(2)}` }] } },
  description: 'Calculate growth rates over time — CAGR, total growth percentage, and annual change. Works for investments, revenue, population, and more.',
  formula: 'CAGR = ((Final/Initial)^(1/Years) − 1) × 100%',
  interpretation: 'CAGR smooths volatility into a single annualized rate. Use for comparing investments of different durations. Total growth is raw, CAGR accounts for compounding.'
}

export default calcDef
