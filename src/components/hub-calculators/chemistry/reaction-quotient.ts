import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    prodConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    reactConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'reactConc', label: 'Reactant Concentrations (product)', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'prodConc', label: 'Product Concentrations (product)', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const q = v.prodConc / v.reactConc
    return {
      result: q, label: 'Reaction Quotient Q', unit: '',
      steps: [
        { label: '[Products]', value: `${v.prodConc} M` },
        { label: '[Reactants]', value: `${v.reactConc} M` },
        { label: 'Q = [products] / [reactants]', value: q.toExponential(4) },
      ]
}
  },
  description: 'The reaction quotient Q is calculated the same way as the equilibrium constant K, but using current (not necessarily equilibrium) concentrations to predict reaction direction.',
  formula: 'For aA + bB ⇌ cC + dD: Q = [C]^c[D]^d / ([A]^a[B]^b)',
  interpretation: 'If Q < K, reaction proceeds forward (→). If Q > K, reaction proceeds backward (←). If Q = K, reaction is at equilibrium. K is constant at a given temperature.'
}

export default calcDef
