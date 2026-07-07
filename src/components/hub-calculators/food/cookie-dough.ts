import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'recipe', label: 'Base Yield', type: 'select', options: [{ label: 'Standard (36 cookies, 2 tbsp)', value: '36' }, { label: 'Small (18 cookies, 2 tbsp)', value: '18' }, { label: 'Large (60 cookies, 2 tbsp)', value: '60' }] },
      { name: 'scoopSize', label: 'Scoop Size', type: 'select', options: [{ label: 'Small (1 tbsp, 0.5x)', value: '0.5' }, { label: 'Medium (2 tbsp, 1x)', value: '1' }, { label: 'Large (3 tbsp, 1.5x)', value: '1.5' }] }
    ],
    compute: (v) => {
      const r = parseInt(v.recipe) * parseFloat(v.scoopSize); return { result: Math.round(r), label: 'Cookie Yield', unit: 'cookies', steps: [{ label: 'Base yield', value: v.recipe }, { label: 'Scoop factor', value: v.scoopSize + 'x' }, { label: 'Adjusted yield', value: Math.round(r) + ' cookies' }] }
    },
    description: 'Cookie dough yields by scoop size. Standard: 2 tbsp dough = 1 cookie.',
    example: { label: 'Standard batch, medium scoop', value: '36 cookies' }
}

export default calcDef
