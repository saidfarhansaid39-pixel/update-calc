import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    ka1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    ka2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'ka1', label: 'Ka₁ of the Diprotic Acid', type: 'number', unit: '', min: 1e-15, max: 1, step: 'any' },
    { name: 'ka2', label: 'Ka₂ of the Diprotic Acid', type: 'number', unit: '', min: 1e-15, max: 1, step: 'any' },
  ],
  compute: (v) => {
    const pH = (Math.log10(v.ka1) + Math.log10(v.ka2)) / -2
    return {
      result: pH, label: 'pH of Amphoteric Salt Solution', unit: '',
      steps: [
        { label: 'pKa₁', value: (-Math.log10(v.ka1)).toFixed(2) },
        { label: 'pKa₂', value: (-Math.log10(v.ka2)).toFixed(2) },
        { label: 'pH = ½(pKa₁ + pKa₂)', value: pH.toFixed(2) },
      ]
}
  },
  description: 'Amphoteric salts (like NaHCO₃ or NaH₂PO₄) contain an ion that can act as both an acid and a base. The pH is approximately the average of the two pKa values.',
  formula: 'pH = ½(pKa₁ + pKa₂)',
  interpretation: 'For NaHCO₃: H₂CO₃ has pKa₁ = 6.35, pKa₂ = 10.33, so pH = ½(6.35 + 10.33) = 8.34. The bicarbonate ion (HCO₃⁻) is amphoteric — it can donate a proton to become CO₃²⁻ or accept a proton to become H₂CO₃.'
}

export default calcDef
