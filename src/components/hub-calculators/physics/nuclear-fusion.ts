import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Fusible Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }],
  compute: (v) => { const c = 299792458; const E = v.mass * c * c * 0.0037; const TNT = E / 4.184e9; return { result: E, label: 'Energy Released (0.37% efficiency)', unit: 'J', steps: [{ label: 'Formula', value: 'E = Δmc²' }, { label: 'Mass defect ~0.37%', value: 'of total mass' }, { label: 'Energy', value: `${E.toExponential(4)} J` }, { label: 'TNT equivalent', value: `${TNT.toFixed(1)} kg TNT` }] } },
  description: 'Nuclear fusion releases energy when light nuclei combine to form heavier ones. The mass defect (≈0.37% for D-T) converts to energy via E = mc².',
  formula: 'E = Δm·c² (D + T → ⁴He + n + 17.6 MeV)',
  interpretation: 'D-T fusion releases 17.6 MeV per reaction. Fusion powers the Sun (proton-proton chain) and hydrogen bombs. Controlled fusion (ITER) aims for sustainable energy. Fusion produces no long-lived radioactive waste.'
}

export default calcDef
