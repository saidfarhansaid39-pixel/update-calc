import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ P: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), V: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'P', label: 'Pressure P', type: 'number', unit: 'Pa', min: 100, step: '100' }, { name: 'V', label: 'Volume V', type: 'number', unit: 'm³', min: 0.001, step: '0.001' }, { name: 'n', label: 'Number of Moles n', type: 'number', unit: 'mol', min: 0.01, step: '0.01' }],
  compute: (v) => { const R = 8.314; const T = v.P * v.V / (v.n * R); return { result: T, label: 'Temperature T', unit: 'K', steps: [{ label: 'Formula', value: 'T = PV/(nR)' }, { label: 'Substitute', value: `${v.P} × ${v.V} / (${v.n} × 8.314)` }, { label: 'Result', value: `${T.toFixed(2)} K (${(T - 273.15).toFixed(1)} °C)` }] } },
  description: 'The ideal gas law relates pressure, volume, temperature, and moles of an ideal gas. PV = nRT, where R = 8.314 J/(mol·K).',
  formula: 'PV = nRT',
  interpretation: 'At STP (273.15 K, 1 atm), one mole of ideal gas occupies 22.4 L. Real gases deviate at high P or low T. The law combines Boyle\'s, Charles\'s, and Avogadro\'s laws.'
}

export default calcDef
