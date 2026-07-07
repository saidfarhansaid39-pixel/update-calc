import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'servings', label: 'Servings', type: 'number', min: 2, step: '2' },
      { name: 'base', label: 'Base Type', type: 'select', options: [{ label: 'Custard (French style)', value: 'custard' }, { label: 'Philadelphia (egg-free)', value: 'philly' }, { label: 'Dairy-free (coconut)', value: 'vegan' }] }
    ],
    compute: (v) => {
      const mult = Math.ceil(v.servings / 4); const cream = mult * 250; const milk = mult * (v.base === 'custard' ? 250 : 150); const sugar = mult * 150; const eggs = v.base === 'custard' ? mult * 3 : 0; return { result: cream + milk, label: 'Total Base', unit: 'mL', steps: [{ label: 'Servings', value: v.servings + ' (1 batch per 4 servings)' }, { label: 'Heavy cream', value: cream + ' mL' }, { label: 'Milk', value: milk + ' mL' }, { label: 'Sugar', value: sugar + ' g' }, eggs > 0 ? { label: 'Egg yolks', value: eggs + ' yolks' } : { label: 'Stabilizer', value: v.base === 'vegan' ? '1 can coconut cream' : '2 tbsp cornstarch' }] }
    },
    description: 'Ice cream base ingredients. Custard = richer (egg yolks), Philadelphia = simpler (no eggs), dairy-free = coconut-based.',
    example: { label: '4 servings, custard style', value: '500mL cream + 500mL milk + 150g sugar + 3 yolks' }
}

export default calcDef
