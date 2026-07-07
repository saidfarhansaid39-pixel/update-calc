import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'food', label: 'Food Type', type: 'select', options: [{ label: 'Reheat (2-3 min/cup)', value: '2.5' }, { label: 'Vegetables (4-6 min/cup)', value: '5' }, { label: 'Rice (15-20 min)', value: '17' }, { label: 'Potato (8-12 min)', value: '10' }, { label: 'Fish (3-5 min)', value: '4' }] },
      { name: 'amount', label: 'Servings/Cups', type: 'number', min: 1, step: '0.5' },
      { name: 'power', label: 'Power', type: 'select', options: [{ label: '700W', value: '1.3' }, { label: '900W', value: '1' }, { label: '1200W', value: '0.85' }] }
    ],
    compute: (v) => {
      const b = parseFloat(v.food); const t = b * v.amount * v.power; return { result: t, label: 'Microwave Time', unit: 'min', steps: [{ label: 'Base', value: b + ' min per serving' }, { label: 'Amount', value: v.amount }, { label: 'Power adj', value: v.power + 'x' }, { label: 'Total', value: t.toFixed(1) + ' min' }] }
    },
    description: 'Microwave times adjusted for wattage. Stir halfway and let stand 1-2 min.',
    example: { label: '2 cups veggies at 900W', value: '10 min' }
}

export default calcDef
