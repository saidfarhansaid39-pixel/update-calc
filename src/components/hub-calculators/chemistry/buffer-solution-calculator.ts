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
    const pH = v.pKa + Math.log10(v.base / v.acid)
    return {
      result: pH, label: 'Buffer pH', unit: '',
      steps: [
        { label: 'pKa', value: v.pKa.toFixed(2) },
        { label: '[A⁻]', value: `${v.base} M` },
        { label: '[HA]', value: `${v.acid} M` },
        { label: 'Ratio [A⁻]/[HA]', value: `${(v.base / v.acid).toFixed(3)}` },
        { label: 'pH = pKa + log([A⁻]/[HA])', value: pH.toFixed(2) },
      ]
}
  },
  description: 'Buffer solutions resist pH change when small amounts of acid or base are added. The Henderson-Hasselbalch equation relates pH to the acid-conjugate base ratio.',
  formula: 'pH = pKa + log([A⁻]/[HA])',
  interpretation: 'Buffer capacity is greatest when [A⁻] = [HA] (pH = pKa). Effective buffer range is pKa ± 1. Common buffers include acetate (pKa 4.76) and phosphate (pKa 7.21).'
}

export default calcDef
