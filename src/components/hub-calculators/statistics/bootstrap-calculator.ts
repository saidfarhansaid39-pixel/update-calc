import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required'), samples: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 100 && n <= 100000 }, '100-100000') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }, { name: 'samples', label: 'Bootstrap Samples', type: 'number', min: 100, max: 100000, step: '100' }],
  compute: (v) => { const nums = parseList(v.values); const B = Math.round(n(v.samples)); if (nums.length === 0 || B === 0) return { result: 0, label: 'Bootstrap Mean', unit: '', steps: [{ label: 'Info', value: 'Enter data to compute bootstrap' }] }; const means: number[] = []; for (let i = 0; i < B; i++) { let sum = 0; for (let j = 0; j < nums.length; j++) { sum += nums[Math.floor(Math.random() * nums.length)] } means.push(sum / nums.length) }; const sorted = [...means].sort((a, b) => a - b); const bootMean = sorted.reduce((a, b) => a + b, 0) / B; const bootSE = Math.sqrt(sorted.reduce((acc, x) => acc + (x - bootMean) ** 2, 0) / (B - 1)); const ciLow = sorted[Math.round(B * 0.025)]; const ciHigh = sorted[Math.round(B * 0.975)]; return { result: bootMean, label: 'Bootstrap Mean', unit: '', steps: [{ label: 'Bootstrap samples', value: `${B}` }, { label: 'Bootstrap mean', value: `${bootMean.toFixed(4)}` }, { label: 'Bootstrap SE', value: `${bootSE.toExponential(4)}` }, { label: '95% CI', value: `[${ciLow.toFixed(4)}, ${ciHigh.toFixed(4)}]` }] } },
  description: 'Bootstrap resampling estimates the sampling distribution of a statistic by repeatedly sampling with replacement from the data.',
  formula: 'θ̂*ᵦ = statistic of resample b, SE = std(θ̂*), CI = percentiles',
  interpretation: 'Bootstrap provides non-parametric standard errors and confidence intervals without assuming normality.'
}

export default calcDef
