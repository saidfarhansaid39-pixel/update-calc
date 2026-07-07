import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ roomCount: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), bathCount: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), sqftClean: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), clutterLevel: z.string().min(1) }),
  fields: [
    { name: 'roomCount', label: 'Number of Rooms', type: 'number', min: 1, step: '1' },
    { name: 'bathCount', label: 'Number of Bathrooms', type: 'number', min: 1, step: '1' },
    { name: 'sqftClean', label: 'Total Sq Ft', type: 'number', min: 200, step: '100' },
    { name: 'clutterLevel', label: 'Clutter Level', type: 'select', options: [{ label: 'Minimal', value: 'minimal' }, { label: 'Moderate', value: 'moderate' }, { label: 'Heavy', value: 'heavy' }] },
  ],
  compute: (v) => {
    const roomTime = v.roomCount * 10
    const bathTime = v.bathCount * 20
    const sqftTime = v.sqftClean * 0.02
    const clutterFactors: Record<string, number> = { minimal: 0.8, moderate: 1, heavy: 1.4 }
    const totalMin = Math.ceil((roomTime + bathTime + sqftTime) * clutterFactors[v.clutterLevel])
    return { result: totalMin, label: 'Estimated Cleaning Time', unit: 'minutes', steps: [{ label: 'Room Cleaning', value: `${roomTime} min` }, { label: 'Bathroom Cleaning', value: `${bathTime} min` }, { label: 'Surface Area', value: `${sqftTime.toFixed(0)} min` }, { label: 'Clutter Factor', value: `${clutterFactors[v.clutterLevel]}×` }, { label: 'Total', value: `${totalMin} min` }] }
  },
  description: 'Estimate how long it will take to clean your home based on number of rooms, bathrooms, square footage, and clutter level. Plan your cleaning schedule.',
  formula: 'Minutes = (Rooms×10 + Baths×20 + SqFt×0.02) × ClutterFactor',
  interpretation: 'Clutter factors: minimal 0.8× (clean surfaces), moderate 1× (move some items), heavy 1.4× (move everything). Add 10-15 min for gathering supplies. Professional cleaners average 1 hr per 500 sq ft.'
}

export default calcDef
