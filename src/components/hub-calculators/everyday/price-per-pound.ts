import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), pounds: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'totalPrice', label: 'Total Price ($)', type: 'number', min: 0.01, step: '1' },
    { name: 'pounds', label: 'Net Weight (lb)', type: 'number', min: 0.1, step: '0.5' },
  ],
  compute: (v) => {
    const perLb = v.totalPrice / v.pounds
    return { result: perLb, label: 'Price per Pound', unit: '$/lb', steps: [{ label: 'Total Price', value: `$${v.totalPrice.toFixed(2)}` }, { label: 'Net Weight', value: `${v.pounds} lb` }, { label: 'Price per Pound', value: `$${perLb.toFixed(4)}` }] }
  },
  description: 'Calculate the price per pound of meat, produce, or bulk items to compare value across different package sizes.',
  formula: 'Price/lb = Total Price ÷ Pounds',
  interpretation: 'Price per pound is standard for meat, deli items, and bulk produce. Compare prices across brands and pack sizes to find the best value. Factor in edible yield — bone-in vs boneless meat differs.'
}

export default calcDef
