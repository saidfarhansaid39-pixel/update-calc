import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    molarity: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    equivalents: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1, 'Must be >= 1')
}),
  fields: [
    { name: 'molarity', label: 'Molarity (M)', type: 'number', unit: 'mol/L', min: 0.0001, step: '0.01' },
    { name: 'equivalents', label: 'Number of Equivalents (n)', type: 'number', unit: '', min: 1, max: 10, step: '1' },
  ],
  compute: (v) => {
    const N = v.molarity * v.equivalents
    return {
      result: N, label: 'Normality (N)', unit: 'eq/L',
      steps: [
        { label: 'Molarity (M)', value: `${v.molarity} mol/L` },
        { label: 'Equivalents per mole (n)', value: `${v.equivalents}` },
        { label: 'N = M × n', value: `${v.molarity} × ${v.equivalents}` },
        { label: 'Normality', value: `${N.toFixed(4)} N` },
      ]
}
  },
  description: 'Normality (N) is a measure of concentration equivalent to molarity multiplied by the number of equivalents per mole. For acids, equivalents = number of H⁺ ions. For bases, equivalents = number of OH⁻ ions. For redox, equivalents = number of electrons transferred.',
  formula: 'N = M × n | For H₂SO₄: n = 2, so 1 M H₂SO₄ = 2 N | For HCl: n = 1, so 1 M HCl = 1 N',
  interpretation: 'H₂SO₄ (diprotic): 1 M = 2 N. H₃PO₄ (triprotic): 1 M = 3 N. NaOH (monobasic): 1 M = 1 N. In titrations, N₁V₁ = N₂V₂. Normality is being replaced by molarity in modern usage.'
}

export default calcDef
