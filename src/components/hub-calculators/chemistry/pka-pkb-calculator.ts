import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    ka: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    kb: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'ka', label: 'Acid Dissociation Constant Ka', type: 'number', unit: '', min: 1e-15, step: 'any' },
    { name: 'kb', label: 'Base Dissociation Constant Kb', type: 'number', unit: '', min: 1e-15, step: 'any' },
  ],
  compute: (v) => {
    const pka = -Math.log10(v.ka)
    const pkb = -Math.log10(v.kb)
    const pkaPkb = pka + pkb
    return {
      result: pka, label: 'pKa', unit: '',
      steps: [
        { label: 'Ka', value: `${v.ka.toExponential(4)}` },
        { label: 'pKa = -log₁₀(Ka)', value: pka.toFixed(2) },
        { label: 'Kb', value: `${v.kb.toExponential(4)}` },
        { label: 'pKb = -log₁₀(Kb)', value: pkb.toFixed(2) },
        { label: 'pKa + pKb', value: `${pkaPkb.toFixed(2)} (should be 14 at 25°C)` },
      ]
}
  },
  description: 'pKa measures the strength of an acid (lower pKa = stronger acid), while pKb measures base strength (lower pKb = stronger base). At 25°C, pKa + pKb = 14 for conjugate pairs.',
  formula: 'pKa = -log₁₀(Ka) | pKb = -log₁₀(Kb)',
  interpretation: 'Strong acids (HCl, HNO₃) have pKa < 0. Weak acids (CH₃COOH, pKa = 4.76) have pKa between 0 and 14. Very weak acids have pKa > 14. The conjugate base of a strong acid is very weak.'
}

export default calcDef
