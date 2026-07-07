import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ time: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0) }),
  fields: [ { name: 'time', label: 'Hexagon Agility Time', type: 'number', unit: 's', min: 5, step: '0.1' } ],
  compute: (v) => {
    const r = v.time < 8 ? 'Excellent' : v.time < 10 ? 'Good' : v.time < 12 ? 'Average' : 'Below Average'
    return { result: v.time, label: 'Hexagon Test Time', unit: 's', steps: [
      { label: 'Time', value: v.time+' s' }, { label: 'Rating', value: r },
      { label: 'Description', value: 'Multi-directional hopping test in a hexagon pattern measuring footwork and agility' },
    ]}
  }, description: 'The Hexagon Agility Test measures multidirectional footwork and hopping ability. Used for assessing lower body agility and coordination.', formula: 'Time to complete 3 rotations of hexagon jumps', interpretation: 'Faster times indicate better footwork, balance, and multidirectional agility. <8s is excellent.'
}

export default calcDef
