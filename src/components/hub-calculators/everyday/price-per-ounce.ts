import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ounces: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'totalPrice', label: 'Total Price ($)', type: 'number', min: 0.01, step: '1' },
    { name: 'ounces', label: 'Net Weight (oz)', type: 'number', min: 0.1, step: '1' },
  ],
  compute: (v) => {
    const perOz = v.totalPrice / v.ounces
    return { result: perOz, label: 'Price per Ounce', unit: '$/oz', steps: [{ label: 'Total Price', value: `$${v.totalPrice.toFixed(2)}` }, { label: 'Net Weight', value: `${v.ounces} oz` }, { label: 'Price per Ounce', value: `$${perOz.toFixed(4)}` }] }
  },
  description: 'Calculate the price per ounce of any product to compare value across different package sizes and brands.',
  formula: 'Price/oz = Total Price ÷ Ounces',
  interpretation: 'Price per ounce is the most common unit price for groceries and toiletries. Always check the unit price — larger packages are not always cheaper per ounce. Store brands often have a lower per-ounce price.'
}

export default calcDef
