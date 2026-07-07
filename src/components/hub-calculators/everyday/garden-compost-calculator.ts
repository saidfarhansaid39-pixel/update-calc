import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ gardenAreaSqFt: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), compostDepthIn: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'gardenAreaSqFt', label: 'Garden Area (sq ft)', type: 'number', min: 1, step: '10' },
    { name: 'compostDepthIn', label: 'Compost Depth (inches)', type: 'number', min: 1, step: '0.5' },
  ],
  compute: (v) => {
    const volumeCF = v.gardenAreaSqFt * (v.compostDepthIn / 12)
    const volumeCY = volumeCF / 27
    const bags = Math.ceil(volumeCF * 7.5 / 50)
    return { result: volumeCY, label: 'Compost Needed', unit: 'cu yd', steps: [{ label: 'Volume (cu ft)', value: `${volumeCF.toFixed(1)} cu ft` }, { label: 'Cubic Yards', value: `${volumeCY.toFixed(2)} cu yd` }, { label: 'Bags Needed (40lb)', value: `${bags} bags` }] }
  },
  description: 'Calculate how much compost you need for your garden based on area and desired application depth.',
  formula: 'Compost (cu yd) = (Area × Depth/12) / 27 | Bags = ceil(Cu Ft × 7.5 / 50)',
  interpretation: 'Apply 1-3 inches of compost annually. A 40lb bag covers ~10 sq ft at 1in depth. Compost improves soil structure, water retention, and adds nutrients. Best applied in spring or fall.'
}

export default calcDef
