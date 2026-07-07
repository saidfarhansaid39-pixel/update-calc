import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 1e-9, step: '1e-9' }],
  compute: (v) => { const c = 299792458; const E = v.mass * c * c; const E_TNT = E / 4.184e9; return { result: E, label: 'Rest Energy E = mc²', unit: 'J', steps: [{ label: 'Formula', value: 'E = mc²' }, { label: 'c', value: '2.9979×10^8 m/s' }, { label: 'Energy', value: `${E.toExponential(4)} J` }, { label: 'TNT equivalent', value: `${E_TNT.toExponential(4)} kg TNT` }] } },
  description: 'Einstein\'s mass-energy equivalence: mass can be converted to energy and vice versa. E = mc² is the most famous equation in physics.',
  formula: 'E = m·c²',
  interpretation: 'c = 2.9979×10^8 m/s. 1 kg of mass releases 9×10^16 J — equivalent to ~21 megatons of TNT. This is the principle behind nuclear energy and annihilation reactions.'
}

export default calcDef
