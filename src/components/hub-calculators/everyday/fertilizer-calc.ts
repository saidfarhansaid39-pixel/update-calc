import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), nRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), nPct: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'area', label: 'Lawn Area (sq ft)', type: 'number', min: 100, step: '100' },
    { name: 'nRate', label: 'Desired N Rate (lb N/1000 sq ft)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'nPct', label: 'Fertilizer N (%)', type: 'number', min: 1, max: 50, step: '1' },
  ],
  compute: (v) => {
    const fertilizerLbs = (v.area / 1000) * v.nRate / (v.nPct / 100)
    return { result: fertilizerLbs, label: 'Fertilizer Needed', unit: 'lbs', steps: [{ label: 'Area', value: `${v.area} sq ft` }, { label: 'N Rate', value: `${v.nRate} lb N/1000 sq ft` }, { label: 'Fertilizer N %', value: `${v.nPct}%` }, { label: 'Total Fertilizer', value: `${fertilizerLbs.toFixed(1)} lbs` }] }
  },
  description: 'Calculate how much fertilizer to apply based on lawn area, desired nitrogen rate, and fertilizer N-P-K percentage. Avoid over-fertilizing by following soil test recommendations.',
  formula: 'Fertilizer (lbs) = (Area / 1000) × N Rate / (N%/100)',
  interpretation: 'Typical lawn N rate: 1 lb N/1000 sq ft per application. Max 4-5 lb N/1000 sq ft per year. Apply in spring and fall. Water after application to prevent burn.'
}

export default calcDef
