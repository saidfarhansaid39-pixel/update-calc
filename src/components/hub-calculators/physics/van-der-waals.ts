import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pressure: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), volume: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), moles: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), a: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), b: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'pressure', label: 'Pressure', type: 'number', unit: 'Pa', min: 100, step: '100' }, { name: 'volume', label: 'Volume', type: 'number', unit: 'm^3', min: 0.0001, step: '0.0001' }, { name: 'moles', label: 'Moles', type: 'number', unit: 'mol', min: 0.001, step: '0.001' }, { name: 'a', label: 'vDW Constant a', type: 'number', unit: 'Pa·m⁶/mol^2', min: 0, step: '0.001' }, { name: 'b', label: 'vDW Constant b', type: 'number', unit: 'm^3/mol', min: 0, step: '1e-6' }],
  compute: (v) => { const R = 8.314; const pCorr = v.pressure + v.a * v.moles * v.moles / (v.volume * v.volume); const vCorr = v.volume - v.moles * v.b; const T = pCorr * vCorr / (v.moles * R); return { result: T, label: 'Temperature', unit: 'K', steps: [{ label: 'Formula', value: '(P + an^2/V^2)(V - nb) = nRT' }, { label: 'R', value: '8.314 J/(mol·K)' }, { label: 'Correction terms applied', value: '' }, { label: 'Result', value: `${T.toFixed(2)} K` }] } },
  description: 'The van der Waals equation corrects the ideal gas law for intermolecular forces and finite molecular volume.',
  formula: '(P + a·n^2/V^2)(V - n·b) = nRT',
  interpretation: 'Parameter a accounts for attractive forces between molecules; b accounts for the volume occupied by molecules. Real gases deviate most from ideal behavior at high pressure and low temperature.'
}

export default calcDef
