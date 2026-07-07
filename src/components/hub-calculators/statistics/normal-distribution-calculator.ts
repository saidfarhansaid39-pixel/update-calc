import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mean: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), std: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), x: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required') }),
  fields: [{ name: 'mean', label: 'Mean (μ)', type: 'number', step: 'any' }, { name: 'std', label: 'Std Dev (σ)', type: 'number', min: 0.001, step: 'any' }, { name: 'x', label: 'Value (x)', type: 'number', step: 'any' }],
  compute: (v) => { const z = (n(v.x) - n(v.mean)) / n(v.std); const pdf = Math.exp(-0.5 * z * z) / (n(v.std) * Math.sqrt(2 * Math.PI)); return { result: z, label: 'Z-Score', unit: '', steps: [{ label: 'Formula', value: 'z = (x - μ)/σ' }, { label: 'Z-score', value: `${z.toFixed(4)}` }, { label: 'PDF', value: `${pdf.toExponential(4)}` }] } },
  description: 'Calculate the z-score and probability density for a normal distribution.',
  formula: 'z = (x - μ) / σ',
  interpretation: 'The z-score measures how many standard deviations x is from the mean. ~68% of data falls between z = -1 and z = 1.'
}

export default calcDef
