import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ windowHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rodHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mountType: z.string().min(1), fullness: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'windowHeight', label: 'Window Height (in)', type: 'number', min: 12, step: '6' },
    { name: 'rodHeight', label: 'Rod Height from Floor (in)', type: 'number', min: 1, step: '1' },
    { name: 'mountType', label: 'Mount Type', type: 'select', options: [{ label: 'Inside Mount', value: 'inside' }, { label: 'Outside Mount', value: 'outside' }] },
    { name: 'fullness', label: 'Fullness Factor', type: 'number', min: 1, max: 3, step: '0.5' },
  ],
  compute: (v) => {
    const curtainLength = v.mountType === 'inside' ? v.windowHeight : v.rodHeight
    const fabricWidth = v.fullness * (v.windowHeight * 0.5)
    const panels = Math.ceil(fabricWidth / 54)
    return { result: curtainLength, label: 'Curtain Length Needed', unit: 'in', steps: [{ label: 'Mount Type', value: v.mountType === 'inside' ? 'Inside mount (fits inside frame)' : 'Outside mount (covers frame)' }, { label: 'Curtain Length', value: `${curtainLength.toFixed(0)} in` }, { label: 'Fullness', value: `${v.fullness}x fullness` }, { label: 'Panels Needed', value: `${panels} panels (54 in standard width)` }] }
  },
  description: 'Calculate curtain length and number of panels needed for your windows based on mount type, window height, and fullness preference.',
  formula: 'Length: Inside = Window Ht, Outside = Rod Ht | Panels = Ceil((Fullness × Window W) / 54)',
  interpretation: 'Standard curtain panels are 54 in wide. Fullness: 1.5x for minimal gathers, 2x for standard, 2.5-3x for luxurious. Outside mount adds 3-6 in on each side for light gap coverage. Floor-length curtains make rooms feel taller.'
}

export default calcDef
