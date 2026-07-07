import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    prodConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    reactConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    prodCoeff: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1, '≥ 1'),
    reactCoeff: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1, '≥ 1')
}),
  fields: [
    { name: 'prodConc', label: 'Product Concentration', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'prodCoeff', label: 'Product Coefficient', type: 'number', unit: '', min: 1, max: 10, step: '1' },
    { name: 'reactConc', label: 'Reactant Concentration', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'reactCoeff', label: 'Reactant Coefficient', type: 'number', unit: '', min: 1, max: 10, step: '1' },
  ],
  compute: (v) => {
    const Kc = Math.pow(v.prodConc, v.prodCoeff) / Math.pow(v.reactConc, v.reactCoeff)
    return {
      result: Kc, label: 'Equilibrium Constant Kc', unit: '',
      steps: [
        { label: '[P]^c', value: `${Math.pow(v.prodConc, v.prodCoeff).toExponential(4)}` },
        { label: '[R]^r', value: `${Math.pow(v.reactConc, v.reactCoeff).toExponential(4)}` },
        { label: 'Kc = [P]^c/[R]^r', value: Kc.toExponential(4) },
        { label: 'Direction', value: Kc > 1 ? 'Products favored' : 'Reactants favored' },
      ]
}
  },
  description: 'The equilibrium constant Kc is the ratio of product concentrations raised to their coefficients divided by reactant concentrations raised to their coefficients, measured at equilibrium.',
  formula: 'Kc = [C]^c[D]^d / ([A]^a[B]^b)',
  interpretation: 'Kc > 1 favors products, Kc < 1 favors reactants. Kc depends only on temperature. A large Kc (e.g., 10³) indicates a reaction that goes nearly to completion.'
}

export default calcDef
