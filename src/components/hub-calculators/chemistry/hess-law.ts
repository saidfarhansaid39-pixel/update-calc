import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    step1: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return !isNaN(n) }, 'Must be a number'),
    step2: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return !isNaN(n) }, 'Must be a number')
}),
  fields: [
    { name: 'step1', label: 'ΔH₁ for Step 1', type: 'number', unit: 'kJ/mol', min: -99999, max: 99999, step: '0.1' },
    { name: 'step2', label: 'ΔH₂ for Step 2', type: 'number', unit: 'kJ/mol', min: -99999, max: 99999, step: '0.1' },
  ],
  compute: (v) => {
    const dH = v.step1 + v.step2
    return {
      result: dH, label: 'Total ΔH (Hess\'s Law)', unit: 'kJ/mol',
      steps: [
        { label: 'Step 1 ΔH₁', value: `${v.step1 >= 0 ? '+' : ''}${v.step1} kJ/mol` },
        { label: 'Step 2 ΔH₂', value: `${v.step2 >= 0 ? '+' : ''}${v.step2} kJ/mol` },
        { label: 'Total ΔH = ΔH₁ + ΔH₂', value: `${dH >= 0 ? '+' : ''}${dH.toFixed(2)} kJ/mol` },
      ]
}
  },
  description: 'Hess\'s Law: the total enthalpy change for a reaction is independent of the pathway — it is the sum of ΔH for each step.',
  formula: 'ΔH(total) = ΣΔHᵢ (sum of all steps)',
  interpretation: 'If a reaction can be written as the sum of steps, ΔH for the overall reaction is the sum of ΔH values for each step. This enables calculating ΔH for reactions that cannot be measured directly.'
}

export default calcDef
