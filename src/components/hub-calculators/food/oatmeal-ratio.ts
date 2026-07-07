import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'oats', label: 'Oats', type: 'number', unit: 'g', min: 20, step: '10' },
      { name: 'type', label: 'Oat Type', type: 'select', options: [{ label: 'Rolled (1:2 liquid)', value: '2' }, { label: 'Steel-cut (1:3 liquid)', value: '3' }, { label: 'Quick (1:1.5 liquid)', value: '1.5' }] },
      { name: 'liquid', label: 'Liquid', type: 'select', options: [{ label: 'Water', value: 'water' }, { label: 'Milk', value: 'milk' }] }
    ],
    compute: (v) => {
      const r = parseFloat(v.type); const l = v.oats * r; const cooked = v.oats + l; return { result: l, label: 'Liquid Needed', unit: 'mL', steps: [{ label: 'Oats', value: v.oats + ' g' }, { label: 'Ratio 1:' + r, value: l.toFixed(0) + ' mL' }, { label: 'Cooked weight', value: cooked.toFixed(0) + ' g' }, { label: 'Cook time', value: r > 2.5 ? '20-30 min' : r > 1.7 ? '5-10 min' : '1-3 min' }] }
    },
    description: 'Oatmeal ratios: rolled 1:2, steel-cut 1:3, quick 1:1.5.',
    example: { label: '40g rolled oats with milk', value: '80mL milk, cook 5-10 min' }
}

export default calcDef
