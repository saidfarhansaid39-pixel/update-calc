import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ghLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ghWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ghHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'ghLength', label: 'Greenhouse Length (ft)', type: 'number', min: 4, step: '2' },
    { name: 'ghWidth', label: 'Greenhouse Width (ft)', type: 'number', min: 4, step: '2' },
    { name: 'ghHeight', label: 'Greenhouse Height (ft)', type: 'number', min: 4, step: '1' },
  ],
  compute: (v) => {
    const floorArea = v.ghLength * v.ghWidth
    const volume = floorArea * v.ghHeight
    const ventArea = floorArea * 0.15
    const heatingNeeded = floorArea * 0.5
    return { result: floorArea, label: 'Floor Area', unit: 'sq ft', steps: [{ label: 'Floor Area', value: `${floorArea.toFixed(0)} sq ft` }, { label: 'Volume', value: `${volume.toFixed(0)} cu ft` }, { label: 'Ventilation Needed', value: `${ventArea.toFixed(0)} sq ft` }, { label: 'Heating (BTU/hr)', value: `${heatingNeeded.toFixed(0)}` }] }
  },
  description: 'Calculate greenhouse dimensions, floor area, volume, ventilation requirements, and estimated heating needs for optimal growing conditions.',
  formula: 'Area = L × W | Volume = L × W × H | Ventilation = Area × 15% | Heat = Area × 0.5 BTU/hr/sqft',
  interpretation: 'Minimum greenhouse size for serious growing: 8×10 ft. Hoop houses are cheaper per sq ft. Ventilation should equal 15-20% of floor area. Active growing requires 6+ hours of direct sunlight.'
}

export default calcDef
