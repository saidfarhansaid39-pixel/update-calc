import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    prod1: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be ≥ 0'),
    prod2: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be ≥ 0'),
    react1: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be ≥ 0'),
    react2: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be ≥ 0')
}),
  fields: [
    { name: 'prod1', label: 'Product 1 Concentration', type: 'number', unit: 'M', min: 0, step: '0.001' },
    { name: 'prod2', label: 'Product 2 Concentration', type: 'number', unit: 'M', min: 0, step: '0.001' },
    { name: 'react1', label: 'Reactant 1 Concentration', type: 'number', unit: 'M', min: 0, step: '0.001' },
    { name: 'react2', label: 'Reactant 2 Concentration', type: 'number', unit: 'M', min: 0, step: '0.001' },
  ],
  compute: (v) => {
    const K = (v.prod1 * v.prod2) / (v.react1 * v.react2)
    const direction = K > 1 ? 'Products favored (K > 1)' : K < 1 ? 'Reactants favored (K < 1)' : 'At equilibrium (K = 1)'
    return {
      result: K, label: 'Equilibrium Constant K', unit: '',
      steps: [
        { label: '[Products]', value: `${v.prod1} × ${v.prod2} = ${(v.prod1 * v.prod2).toExponential(4)}` },
        { label: '[Reactants]', value: `${v.react1} × ${v.react2} = ${(v.react1 * v.react2).toExponential(4)}` },
        { label: 'K = [P] / [R]', value: K.toExponential(4) },
        { label: 'Direction', value: direction },
      ]
}
  },
  description: 'The equilibrium constant (K) describes the ratio of product concentrations to reactant concentrations at equilibrium for a reversible reaction.',
  formula: 'K = [products] / [reactants] (at equilibrium)',
  interpretation: 'K > 1: products favored, K < 1: reactants favored, K = 1: equal amounts. K depends only on temperature, not on initial concentrations.'
}

export default calcDef
