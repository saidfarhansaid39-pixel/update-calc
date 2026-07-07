import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ force: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'force', label: 'Force', type: 'number', unit: 'N', min: 0.001, step: '0.001' }, { name: 'distance', label: 'Distance', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: v.force * v.distance, label: 'Work', unit: 'J', steps: [{ label: 'Formula', value: 'W = Fd' }, { label: 'Substitute', value: `${v.force} × ${v.distance}` }, { label: 'Result', value: `${(v.force * v.distance).toFixed(2)} J` }] }),
  description: 'Work is the energy transferred when a force moves an object through a distance. W = Fd for force in the direction of motion.',
  formula: 'W = F × d',
  interpretation: 'Work is measured in joules (J). 1 J = 1 N·m. Work is only done when the force causes displacement in the direction of the force.'
}

export default calcDef
