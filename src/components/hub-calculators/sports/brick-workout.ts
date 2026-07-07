import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bikeMin: z.string().min(1).refine(v => parseFloat(v) >= 0), runMin: z.string().min(1).refine(v => parseFloat(v) >= 0), transitions: z.string().optional() }),
  fields: [
    { name: 'bikeMin', label: 'Bike Duration', type: 'number', unit: 'min', min: 10, step: '5' },
    { name: 'runMin', label: 'Run Duration', type: 'number', unit: 'min', min: 5, step: '5' },
    { name: 'transitions', label: 'Transitions (optional)', type: 'number', unit: 'min', min: 0, step: '0.5' },
  ],
  compute: (v) => {
    const total = v.bikeMin + v.runMin + (v.transitions || 0)
    return { result: total, label: 'Total Brick Session', unit: 'min', steps: [
      { label: 'Bike leg', value: v.bikeMin+' min' }, { label: 'Run leg', value: v.runMin+' min' },
      ...(v.transitions ? [{ label: 'Transitions', value: v.transitions+' min' }] : []),
      { label: 'Total', value: total+' min ('+Math.floor(total/60)+'h '+(total%60).toFixed(0)+'m)' },
    ]}
  }, description: 'Plan brick workouts (bike-to-run) for triathlon training. Bricks simulate race-day conditions and improve run-off-the-bike ability.', formula: 'Brick = bike + run + transitions', interpretation: 'Brick workouts are essential for adapting to the bike-to-run transition feeling and improving race performance.'
}

export default calcDef
