import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bikeMin: z.string().min(1).refine(v => parseFloat(v) >= 0), t2Min: z.string().min(1).refine(v => parseFloat(v) >= 0) }),
  fields: [
    { name: 'bikeMin', label: 'Bike Duration', type: 'number', unit: 'min', min: 10, step: '5' },
    { name: 't2Min', label: 'T2 Time', type: 'number', unit: 'min', min: 0.5, step: '0.5' },
  ],
  compute: (v) => {
    const total = v.bikeMin + v.t2Min
    return { result: v.t2Min, label: 'T2 Transition Time', unit: 'min', steps: [
      { label: 'Bike time', value: v.bikeMin+' min' }, { label: 'T2', value: v.t2Min+' min' },
      { label: 'Total to run start', value: total+' min' },
    ]}
  }, description: 'Plan T2 transition (bike-to-run) strategy. Quick T2 with smooth dismount and racking saves crucial time.', formula: 'T2 includes dismount, rack bike, helmet off, run shoes on', interpretation: 'T2 is usually faster than T1. Practice brick workouts to improve bike-to-run transition efficiency.'
}

export default calcDef
