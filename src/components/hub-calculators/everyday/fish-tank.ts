import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tankGallons: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fishPerGallon: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'tankGallons', label: 'Tank Size (gallons)', type: 'number', min: 1, step: '5' },
    { name: 'fishPerGallon', label: 'Fish per Gallon', type: 'number', min: 0.1, step: '0.5' },
  ],
  compute: (v) => { const g = parseFloat(v.tankGallons)||0; const fpg = parseFloat(v.fishPerGallon)||0; const maxFish = g * fpg; return { result: maxFish, label: 'Max Fish', unit: '', steps: [{ label: 'Tank Volume', value: `${g} gal` }, { label: 'Stocking Rate', value: `${fpg} fish/gal` }, { label: 'Recommended Max', value: `${Math.floor(maxFish)} fish` }] } },
  description: 'Estimate the maximum number of fish your aquarium can safely hold based on tank volume and stocking density.',
  formula: 'Max Fish = Tank Gallons × Fish per Gallon',
  interpretation: 'General rule: 1 inch of fish per gallon for small species. Apply stricter limits for aggressive or high-waste fish. Larger tanks are more stable and forgiving for beginners.'
}

export default calcDef
