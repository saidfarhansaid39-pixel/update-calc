import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ swimMin: z.string().min(1).refine(v => parseFloat(v) >= 0), t1Min: z.string().min(1).refine(v => parseFloat(v) >= 0) }),
  fields: [
    { name: 'swimMin', label: 'Swim Duration', type: 'number', unit: 'min', min: 5, step: '1' },
    { name: 't1Min', label: 'T1 Time', type: 'number', unit: 'min', min: 0.5, step: '0.5' },
  ],
  compute: (v) => {
    const total = v.swimMin + v.t1Min
    return { result: v.t1Min, label: 'T1 Transition Time', unit: 'min', steps: [
      { label: 'Swim time', value: v.swimMin+' min' }, { label: 'T1', value: v.t1Min+' min' },
      { label: 'Total to bike start', value: total+' min' },
    ]}
  }, description: 'Plan T1 transition (swim-to-bike) strategy. Efficient transitions save time and improve race performance.', formula: 'T1 includes wetsuit removal, helmet on, mount line jog', interpretation: 'Fast transitions can save 1-3 minutes. Practice T1 skills including wetsuit stripping and mounting.'
}

export default calcDef
