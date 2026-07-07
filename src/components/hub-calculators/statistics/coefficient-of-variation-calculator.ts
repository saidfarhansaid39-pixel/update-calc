import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values); const mean = nums.reduce((a, b) => a + b, 0) / nums.length; const std = Math.sqrt(nums.reduce((acc, x) => acc + (x - mean) ** 2, 0) / (nums.length - 1)); const cv = mean !== 0 ? (std / mean) * 100 : 0; return { result: cv, label: 'Coefficient of Variation', unit: '%', steps: [{ label: 'Mean', value: `${mean.toFixed(4)}` }, { label: 'Std Dev', value: `${std.toFixed(4)}` }, { label: 'CV', value: `${cv.toFixed(2)}%` }] } },
  description: 'The coefficient of variation (CV) is the ratio of standard deviation to mean, expressed as a percentage. It measures relative variability.',
  formula: 'CV = (σ / μ) × 100%',
  interpretation: 'CV is useful for comparing variability between datasets with different units or means. Lower CV indicates less relative dispersion.'
}

export default calcDef
