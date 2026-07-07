import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), ballWeight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0') }),
  fields: [
    { name: 'distance', label: 'Throw Distance', type: 'number', unit: 'm', min: 0.5, step: '0.1' },
    { name: 'ballWeight', label: 'Ball Weight', type: 'number', unit: 'kg', min: 1, max: 20, step: '0.5' },
  ],
  compute: (v) => {
    const vel = Math.sqrt(v.distance * 9.81 / Math.sin(2 * 35 * Math.PI / 180)); const power = 0.5 * v.ballWeight * vel * vel
    return { result: v.distance, label: 'Throw Distance', unit: 'm', steps: [
      { label: 'Distance', value: v.distance+' m' }, { label: 'Ball mass', value: v.ballWeight+' kg' },
      { label: 'Est. velocity', value: vel.toFixed(1)+' m/s' }, { label: 'Est. power', value: power.toFixed(0)+' J' },
    ]}
  }, description: 'Estimate upper body power from medicine ball chest throw. Valid test for explosive strength.', formula: 'Power = 0.5 × m × v²', interpretation: 'Longer throws relative to ball weight indicate greater upper body power.'
}

export default calcDef
