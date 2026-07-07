import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'milk', label: 'Milk Volume', type: 'number', unit: 'L', min: 1, step: '1' },
      { name: 'cheese', label: 'Cheese Type', type: 'select', options: [{ label: 'Fresh mozzarella (~150g/L)', value: '150' }, { label: 'Ricotta (~100g/L)', value: '100' }, { label: 'Farmers cheese (~120g/L)', value: '120' }, { label: 'Paneer (~180g/L)', value: '180' }, { label: 'Cottage cheese (~110g/L)', value: '110' }] }
    ],
    compute: (v) => {
      const yieldG = v.milk * parseInt(v.cheese); const rennetDrops = v.milk * 4; return { result: yieldG, label: 'Cheese Yield', unit: 'g', steps: [{ label: 'Milk', value: v.milk + ' L' }, { label: 'Type', value: v.cheese + ' g/L' }, { label: 'Yield', value: yieldG + ' g' }, { label: 'Rennet', value: rennetDrops + ' drops (liquid)' }, { label: 'Culture time', value: '30-60 min at 32°C' }] }
    },
    description: 'Cheese-making yields. Most fresh cheeses yield 100-180g per litre of milk. Use whole milk for best results.',
    example: { label: '4L whole milk, mozzarella', value: '~600g fresh mozzarella' }
}

export default calcDef
