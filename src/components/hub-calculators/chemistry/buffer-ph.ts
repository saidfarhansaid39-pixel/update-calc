import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    pKa: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= -2 && n <= 16 }, '-2 to 16'),
    acid: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    base: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'pKa', label: 'pKa of Weak Acid', type: 'number', unit: '', min: -2, max: 16, step: '0.01' },
    { name: 'acid', label: '[Weak Acid]', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'base', label: '[Conjugate Base]', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const ratio = v.base / v.acid
    const pH = v.pKa + Math.log10(ratio)
    return {
      result: pH, label: 'Buffer pH', unit: '',
      steps: [
        { label: 'pKa', value: v.pKa.toFixed(2) },
        { label: 'Ratio [A⁻]/[HA]', value: ratio.toFixed(3) },
        { label: 'log₁₀([A⁻]/[HA])', value: Math.log10(ratio).toFixed(3) },
        { label: 'pH = pKa + log([A⁻]/[HA])', value: pH.toFixed(2) },
      ]
}
  },
  description: 'The Henderson-Hasselbalch equation calculates the pH of a buffer solution from the pKa and the ratio of conjugate base to weak acid concentrations.',
  formula: 'pH = pKa + log([A⁻]/[HA])',
  interpretation: 'A buffer resists pH change most effectively when [A⁻] = [HA] (pH = pKa). The effective buffer range is approximately pKa ± 1. Typical buffers: acetate (pKa 4.76), phosphate (pKa 7.21), TRIS (pKa 8.07).'
}

export default calcDef
