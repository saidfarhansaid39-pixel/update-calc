import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'quinoa', label: 'Quinoa Per Serving', type: 'number', unit: 'g', min: 30, step: '10' },
      { name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' }
    ],
    compute: (v) => {
      const tq = v.quinoa * v.servings; const water = tq * 2; const cooked = tq * 3; return { result: tq, label: 'Dry Quinoa', unit: 'g', steps: [{ label: 'Per serving', value: v.quinoa + ' g' }, { label: 'Servings', value: v.servings }, { label: 'Total dry', value: tq + ' g' }, { label: 'Water (2:1)', value: water + ' mL' }, { label: 'Cooked yield', value: cooked + ' g' }, { label: 'Time', value: '15-20 min + 5 min rest' }] }
    },
    description: 'Quinoa cooking: 2:1 water-to-grain ratio, 15-20 min cook time.',
    example: { label: '2 servings (75g each)', value: '150g dry + 300mL water' }
}

export default calcDef
