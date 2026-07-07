import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sampleMean: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), popMean: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), popStd: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2') }),
  fields: [{ name: 'sampleMean', label: 'Sample Mean', type: 'number', step: 'any' }, { name: 'popMean', label: 'Population Mean', type: 'number', step: 'any' }, { name: 'popStd', label: 'Population Std', type: 'number', min: 0.001, step: 'any' }, { name: 'n', label: 'Sample Size', type: 'number', min: 2, step: '1' }],
  compute: (v) => { const z = (n(v.sampleMean) - n(v.popMean)) / (n(v.popStd) / Math.sqrt(n(v.n))); return { result: z, label: 'Z-Statistic', unit: '', steps: [{ label: 'Formula', value: 'z = (x̄ - μ₀) / (σ/√n)' }, { label: 'SE', value: `${(n(v.popStd) / Math.sqrt(n(v.n))).toFixed(4)}` }, { label: 'z', value: `${z.toFixed(4)}` }] } },
  description: 'One-sample z-test compares a sample mean to a known population mean when population SD is known.',
  formula: 'z = (x̄ - μ₀) / (σ / √n)',
  interpretation: '|z| > 1.96 is significant at α = 0.05. Assumes normally distributed population with known variance.'
}

export default calcDef
