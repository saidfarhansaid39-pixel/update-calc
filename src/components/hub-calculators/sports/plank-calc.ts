import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ time: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0') }),
  fields: [ { name: 'time', label: 'Plank Hold Time', type: 'number', unit: 's', min: 1, step: '1' } ],
  compute: (v) => {
    const r = v.time >= 180 ? 'Excellent' : v.time >= 120 ? 'Good' : v.time >= 60 ? 'Average' : v.time >= 30 ? 'Below Average' : 'Poor'
    return { result: v.time, label: 'Plank Hold', unit: 's', steps: [
      { label: 'Hold time', value: v.time+' s ('+(v.time/60).toFixed(1)+' min)' }, { label: 'Rating', value: r },
      { label: 'Standards', value: 'Exc:>180s, Good:120-180s, Avg:60-119s' },
    ],
    extras: [
      { label: "Training tip", value: "Track progress consistently rather than comparing single measurements." },
      { label: "Rest note", value: "Adequate rest and recovery are essential for performance gains." },
      { label: "Individual variation", value: "Results vary by age, fitness level, and training history." }
    ]}
  }, description: 'Measure core endurance with the plank test. Assesses isometric core strength and stability.', formula: 'Isometric hold time to failure', interpretation: 'Longer plank times indicate better core stability. 2+ minutes is excellent.'
}

export default calcDef
