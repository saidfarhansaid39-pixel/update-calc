import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ m1: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), m2: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), sd: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'm1', label: 'Mean 1', type: 'number', step: 'any' }, { name: 'm2', label: 'Mean 2', type: 'number', step: 'any' }, { name: 'sd', label: 'Pooled Std Dev', type: 'number', min: 0.001, step: 'any' }],
  compute: (v) => { const d = (n(v.m1) - n(v.m2)) / n(v.sd); const r2 = d * d / (d * d + 4); return { result: d, label: "Cohen's d", unit: '', steps: [{ label: 'Mean difference', value: `${(n(v.m1) - n(v.m2)).toFixed(4)}` }, { label: 'd', value: `${d.toFixed(4)}` }, { label: 'r² equivalent', value: `${r2.toFixed(4)}` }, { label: 'Magnitude', value: Math.abs(d) >= 0.8 ? 'Large' : Math.abs(d) >= 0.5 ? 'Medium' : Math.abs(d) >= 0.2 ? 'Small' : 'Trivial' }] } },
  description: "Cohen's d standardizes the difference between two means in pooled standard deviation units.",
  formula: "d = (x̄₁ - x̄₂) / s_pooled, r² = d²/(d²+4)",
  interpretation: "d = 0.2 (small), 0.5 (medium), 0.8 (large). d of 1.0 means groups differ by 1 SD."
}

export default calcDef
