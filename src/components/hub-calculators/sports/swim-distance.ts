import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ laps: z.string().min(1).refine(v => parseFloat(v) > 0), poolLen: z.string().min(1).refine(v => parseFloat(v) > 0) }),
  fields: [
    { name: 'laps', label: 'Number of Laps', type: 'number', min: 1, step: '1' },
    { name: 'poolLen', label: 'Pool Length', type: 'number', unit: 'm', min: 10, max: 50, step: '1' },
  ],
  compute: (v) => {
    const dist = v.laps * v.poolLen
    return { result: dist, label: 'Total Distance', unit: 'm', steps: [
      { label: 'Laps', value: ''+v.laps }, { label: 'Pool length', value: v.poolLen+' m' },
      { label: 'Total distance', value: dist+' m ('+(dist/1000).toFixed(2)+' km)' },
    ],
    extras: [
      { label: "Training tip", value: "Track progress consistently rather than comparing single measurements." },
      { label: "Rest note", value: "Adequate rest and recovery are essential for performance gains." },
      { label: "Individual variation", value: "Results vary by age, fitness level, and training history." }
    ]}
  }, description: 'Convert swim laps to distance based on pool length. Standard pools are 25m or 50m.', formula: 'Distance = laps × pool length', interpretation: 'Track total swim distance for training volume management and pacing.'
}

export default calcDef
