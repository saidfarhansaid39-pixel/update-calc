import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ m0: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mf: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ve: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'm0', label: 'Initial Mass (wet)', type: 'number', unit: 'kg', min: 1, step: '1' }, { name: 'mf', label: 'Final Mass (dry)', type: 'number', unit: 'kg', min: 1, step: '1' }, { name: 've', label: 'Exhaust Velocity vₑ', type: 'number', unit: 'm/s', min: 100, step: '100' }],
  compute: (v) => { const dv = v.ve * Math.log(v.m0 / v.mf); const MR = v.m0 / v.mf; return { result: dv, label: 'Delta-v', unit: 'm/s', steps: [{ label: 'Formula', value: 'Δv = vₑ·ln(m₀/m_f)' }, { label: 'Mass ratio', value: `${MR.toFixed(2)}:1` }, { label: 'Delta-v', value: `${dv.toFixed(1)} m/s` }] } },
  description: 'The Tsiolkovsky rocket equation gives the maximum velocity change a rocket can achieve based on its mass ratio and exhaust velocity.',
  formula: 'Δv = vₑ·ln(m₀/m_f)',
  interpretation: 'Saturn V had mass ratio ~20 and exhaust velocity ~3 km/s, giving ~9 km/s delta-v (enough for LEO). Higher exhaust velocity dramatically improves performance. Multi-stage rockets minimize dead weight.'
}

export default calcDef
