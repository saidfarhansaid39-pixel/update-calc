import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0), weightKg: z.string().optional().refine(v => !v || parseFloat(v) > 0) }),
  fields: [
    { name: 'distance', label: 'Broad Jump Distance', type: 'number', unit: 'cm', min: 10, step: '1' },
    { name: 'weightKg', label: 'Body Weight (optional)', type: 'number', unit: 'kg', min: 20, step: '0.5' },
  ],
  compute: (v) => {
    const dM = v.distance / 100; const power = v.weightKg ? Math.sqrt(9.81 * dM) * v.weightKg * 1.1 : 0
    const thrust = v.weightKg ? power / v.weightKg : 0
    return { result: v.distance, label: 'Broad Jump', unit: 'cm', steps: [
      { label: 'Distance', value: v.distance+' cm ('+dM.toFixed(2)+' m)' },
      ...(v.weightKg ? [{ label: 'Est. power', value: power.toFixed(0)+' W' }, { label: 'Relative power', value: thrust.toFixed(1)+' W/kg' }] : []),
    ]}
  }, description: 'Analyze standing broad jump distance and estimated power output. The broad jump is a key test of horizontal power production.', formula: 'Power = √(g × d) × m × 1.1', interpretation: 'Broad jump distance correlates with sprint acceleration. Powerful athletes jump >250cm.'
}

export default calcDef
