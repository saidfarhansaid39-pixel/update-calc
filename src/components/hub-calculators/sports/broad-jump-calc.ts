import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), weight: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0') }),
  fields: [
    { name: 'distance', label: 'Jump Distance', type: 'number', unit: 'cm', min: 10, step: '1' },
    { name: 'weight', label: 'Body Weight (optional)', type: 'number', unit: 'kg', min: 20, step: '0.5' },
  ],
  compute: (v) => {
    const dM = v.distance / 100; const power = v.weight ? Math.sqrt(9.81 * dM) * v.weight * 1.1 : 0
    return { result: v.distance, label: 'Broad Jump', unit: 'cm', steps: [
      { label: 'Distance', value: v.distance+' cm ('+dM.toFixed(2)+' m)' },
      ...(v.weight ? [{ label: 'Estimated power', value: power.toFixed(0)+' W' }] : []),
      { label: 'Rating', value: v.distance >= 250 ? 'Excellent' : v.distance >= 220 ? 'Good' : v.distance >= 190 ? 'Average' : 'Needs improvement' },
    ]}
  }, description: 'Measure standing broad jump for lower body explosive power. Correlates with sprint speed and vertical jump.', formula: 'Power approximated from jump distance and body mass', interpretation: 'Longer jumps indicate greater lower body power. >250cm is excellent for most athletes.'
}

export default calcDef
