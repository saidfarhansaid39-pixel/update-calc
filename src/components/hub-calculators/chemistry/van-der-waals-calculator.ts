import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    p: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    v: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    t: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    n: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    a: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be ≥ 0'),
    b: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be ≥ 0')
}),
  fields: [
    { name: 'p', label: 'Pressure', type: 'number', unit: 'atm', min: 0.001, step: '0.001' },
    { name: 'v', label: 'Volume', type: 'number', unit: 'L', min: 0.001, step: '0.001' },
    { name: 't', label: 'Temperature', type: 'number', unit: 'K', min: 1, step: '1' },
    { name: 'n', label: 'Moles', type: 'number', unit: 'mol', min: 0.001, step: '0.001' },
    { name: 'a', label: 'Parameter a (attraction)', type: 'number', unit: 'L²·atm/mol²', min: 0, step: '0.0001' },
    { name: 'b', label: 'Parameter b (volume)', type: 'number', unit: 'L/mol', min: 0, step: '0.0001' },
  ],
  compute: (v) => {
    const idealP = v.n * 0.082057 * v.t / v.v
    const aTerm = v.a * (v.n / v.v) ** 2
    const bTerm = v.n * v.b
    const vdwP = (v.n * 0.082057 * v.t) / (v.v - bTerm) - aTerm
    return {
      result: vdwP, label: 'Van der Waals Pressure', unit: 'atm',
      steps: [
        { label: 'Ideal gas PV/nRT', value: `${(idealP * v.v / (v.n * 0.082057 * v.t)).toFixed(4)}` },
        { label: 'Ideal P = nRT/V', value: `${idealP.toFixed(4)} atm` },
        { label: 'a(n/V)² correction', value: `${aTerm.toExponential(4)}` },
        { label: 'V - nb correction', value: `${(v.v - bTerm).toExponential(4)} L` },
        { label: 'Van der Waals P', value: `${vdwP.toFixed(4)} atm` },
      ]
}
  },
  description: 'The van der Waals equation corrects the ideal gas law for real gas behavior, accounting for intermolecular attractions (a) and finite molecular volume (b).',
  formula: '(P + a(n/V)²)(V - nb) = nRT',
  interpretation: 'Parameter a accounts for attractive forces between molecules. Parameter b accounts for the volume occupied by molecules themselves. Noble gases have small a and b values.'
}

export default calcDef
