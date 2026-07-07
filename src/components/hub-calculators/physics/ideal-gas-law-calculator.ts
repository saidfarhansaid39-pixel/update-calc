import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pressure: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), volume: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), moles: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'pressure', label: 'Pressure', type: 'number', unit: 'Pa', min: 100, step: '100' }, { name: 'volume', label: 'Volume', type: 'number', unit: 'm^3', min: 0.0001, step: '0.0001' }, { name: 'moles', label: 'Number of Moles', type: 'number', unit: 'mol', min: 0.001, step: '0.001' }],
  compute: (v) => { const R = 8.314; const T = v.pressure * v.volume / (v.moles * R); return { result: T, label: 'Temperature', unit: 'K', steps: [{ label: 'Formula', value: 'PV = nRT' }, { label: 'R', value: '8.314 J/(mol·K)' }, { label: 'Result', value: `${T.toFixed(2)} K` }] } },
  description: 'The Ideal Gas Law relates pressure, volume, temperature, and number of moles of an ideal gas. PV = nRT.',
  formula: 'PV = nRT',
  interpretation: 'R = 8.314 J/(mol·K). The ideal gas law assumes no intermolecular forces and negligible molecular volume. Real gases deviate at high P and low T.'
}

export default calcDef
