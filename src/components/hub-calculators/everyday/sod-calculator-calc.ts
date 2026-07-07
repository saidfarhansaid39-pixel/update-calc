import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'length', label: 'Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'width', label: 'Width (ft)', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const sqft = v.length * v.width
    const pallets = Math.ceil(sqft / 500)
    const rolls = Math.ceil(sqft / 10)
    return { result: sqft, label: 'Sod Area', unit: 'sq ft', steps: [{ label: 'Area', value: `${sqft.toFixed(0)} sq ft` }, { label: 'Pallets (500 sq ft)', value: `${pallets} pallets` }, { label: 'Rolls (10 sq ft)', value: `${rolls} rolls` }] }
  },
  description: 'Calculate how much sod you need for your lawn. Enter the dimensions to get square footage, number of pallets, and individual rolls required. Add 5-10% for cutting and waste.',
  formula: 'Sod Area = L × W | Pallets = Ceil(Area / 500) | Rolls = Ceil(Area / 10)',
  interpretation: 'Standard sod pallet: 500 sq ft. Individual roll: ~10 sq ft. Order 5-10% extra for odd shapes and cutting waste. Install within 24 hours of delivery.'
}

export default calcDef
