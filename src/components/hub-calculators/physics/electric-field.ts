import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ charge: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'charge', label: 'Point Charge', type: 'number', unit: 'C', min: 1e-9, step: '1e-9' }, { name: 'distance', label: 'Distance from Charge', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => { const k = 8.988e9; const E = k * v.charge / (v.distance * v.distance); return { result: E, label: 'Electric Field Strength', unit: 'N/C', steps: [{ label: 'Formula', value: 'E = kq/r^2' }, { label: 'k', value: '8.988×10^9 N·m^2/C^2' }, { label: 'Result', value: `${E.toExponential(4)} N/C` }] } },
  description: 'Electric field strength from a point charge decreases with the square of distance, following Coulomb\'s Law.',
  formula: 'E = k·q / r^2',
  interpretation: 'k = 8.988×10^9 N·m^2/C^2. Electric field is a vector pointing away from positive charges and toward negative charges. Units: N/C or V/m.'
}

export default calcDef
