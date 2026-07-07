import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ thrust: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), massFlow: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'thrust', label: 'Thrust F', type: 'number', unit: 'N', min: 1, step: '1' }, { name: 'massFlow', label: 'Mass Flow Rate ṁ', type: 'number', unit: 'kg/s', min: 0.001, step: '0.001' }],
  compute: (v) => { const g0 = 9.81; const Isp = v.thrust / (v.massFlow * g0); const ve = Isp * g0; return { result: Isp, label: 'Specific Impulse I_sp', unit: 's', steps: [{ label: 'Formula', value: 'I_sp = F/(ṁ·g₀)' }, { label: 'Exhaust velocity', value: `${ve.toFixed(1)} m/s` }, { label: 'Specific impulse', value: `${Isp.toFixed(1)} s` }] } },
  description: 'Specific impulse measures rocket engine efficiency. Higher Isp means more thrust per unit of propellant flow rate.',
  formula: 'I_sp = F/(ṁ·g₀) = vₑ/g₀',
  interpretation: 'Chemical rockets: Isp 250-300 s (solid), 300-450 s (liquid H₂/O₂). Ion thrusters: Isp 2000-5000 s. Higher Isp means more efficient but often lower thrust. Isp in seconds is equivalent to exhaust velocity divided by g₀.'
}

export default calcDef
