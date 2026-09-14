import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ force: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), time: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'force', label: 'Force', type: 'number', unit: 'N', min: 0.001, step: '0.001' }, { name: 'time', label: 'Time Interval', type: 'number', unit: 's', min: 0.001, step: '0.001' }],
  defaults: { force: '1000', time: '0.1' },
  presets: [
    { label: 'Baseball hit (8000 N, 0.007 s)', values: { force: '8000', time: '0.007' } },
    { label: 'Car crash (50000 N, 0.1 s)', values: { force: '50000', time: '0.1' } },
    { label: 'Punch (2500 N, 0.05 s)', values: { force: '2500', time: '0.05' } },
  ],
  compute: (v) => ({ result: v.force * v.time, label: 'Impulse', unit: 'N·s', steps: [{ label: 'Formula', value: 'J = FΔt' }, { label: 'Substitute', value: `${v.force} × ${v.time}` }, { label: 'Result', value: `${(v.force * v.time).toFixed(2)} N·s` }],
      extras: [
        { label: 'Real-World Application', value: 'Impulse explains why airbags save lives — they increase crash time, reducing force. J = FΔt = Δp. Longer time = lower force for same momentum change.' },
        { label: 'Common Values', value: 'Baseball bat contact: ~0.007 s, force ~8000 N. Golf club contact: ~0.0005 s. Car crash: ~0.1 s. Boxing punch: ~0.05 s.' },
        { label: 'Precision Tip', value: 'Impulse equals the area under a force-time graph. For varying forces, use average force or integrate.' },
        { label: 'Related Formula', value: 'Impulse-momentum theorem: FΔt = mΔv. Rocket thrust: F = v_exhaust × dm/dt. Specific impulse: I_sp = F/(dm/dt × g).' },
        { label: 'Unit Conversion Note', value: 'Impulse in N·s = kg·m/s. Convert lbf·s to N·s: multiply by 4.448.' }
      ] }),
  description: 'Impulse equals force multiplied by time interval. It equals the change in momentum.',
  formula: 'J = F × Δt',
  interpretation: 'Impulse-momentum theorem: J = Δp. A larger impulse produces a greater change in momentum.'
}

export default calcDef
