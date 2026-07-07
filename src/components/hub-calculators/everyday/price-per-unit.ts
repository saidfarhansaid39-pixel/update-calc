import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), totalUnits: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'totalPrice', label: 'Total Price ($)', type: 'number', min: 0.01, step: '1' },
    { name: 'totalUnits', label: 'Number of Units', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const perUnit = v.totalPrice / v.totalUnits
    return { result: perUnit, label: 'Price per Unit', unit: '$/unit', steps: [{ label: 'Total Price', value: `$${v.totalPrice.toFixed(2)}` }, { label: 'Units', value: `${v.totalUnits}` }, { label: 'Price per Unit', value: `$${perUnit.toFixed(4)}` }] }
  },
  description: 'Calculate the price per individual unit to compare multi-pack deals and bulk purchases against single items.',
  formula: 'Price/Unit = Total Price ÷ Number of Units',
  interpretation: 'Multi-pack savings typically range from 5-30% per unit. Beware of "bonus" packs that offer less per-unit savings than buying two regular packs. Amazon Subscribe & Save offers 5-15% per unit.'
}

export default calcDef
