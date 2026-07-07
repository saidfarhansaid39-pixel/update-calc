import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'food', label: 'Food Type', type: 'select', options: [{ label: 'Chicken breast (8-12 min)', value: '10' }, { label: 'Beef stew (20-25 min)', value: '22' }, { label: 'Pork shoulder (40-50 min)', value: '45' }, { label: 'Potatoes (10-15 min)', value: '12' }, { label: 'White rice (3-5 min)', value: '4' }, { label: 'Dried beans (25-40 min)', value: '30' }, { label: 'Stock/broth (30-45 min)', value: '35' }] },
      { name: 'weight', label: 'Weight', type: 'number', unit: 'g', min: 100, step: '50' }
    ],
    compute: (v) => {
      const bm = parseInt(v.food); const adj = Math.round(bm + (v.weight - 500) / 500 * 5); const r = Math.max(bm, adj); return { result: r, label: 'Pressure Cook Time', unit: 'min', steps: [{ label: 'Food', value: bm + ' min base' }, { label: 'Weight', value: v.weight + ' g' }, { label: 'Adjusted', value: r + ' min HIGH' }, { label: 'Release', value: 'Natural for meats/beans, Quick for veg/rice' }] }
    },
    description: 'Instant Pot/pressure cooker times. Natural release for meats; quick release for vegetables.',
    example: { label: '1kg beef stew', value: '~27 min high pressure' }
}

export default calcDef
