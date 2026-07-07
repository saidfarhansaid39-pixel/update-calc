import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'eggs', label: 'Number of Eggs', type: 'number', min: 1, step: '1' },
      { name: 'substitute', label: 'Substitute', type: 'select', options: [{ label: 'Flax egg (1 tbsp+3 tbsp water)', value: 'flax' }, { label: 'Chia egg (1 tbsp+3 tbsp water)', value: 'chia' }, { label: 'Mashed banana (1/4 cup)', value: 'banana' }, { label: 'Applesauce (1/4 cup)', value: 'apple' }] }
    ],
    compute: (v) => {
      const info: Record<string, string> = { flax: '1 tbsp flax + 3 tbsp water', chia: '1 tbsp chia + 3 tbsp water', banana: '1/4 cup mashed banana', apple: '1/4 cup applesauce' }; return { result: v.eggs, label: 'Egg Substitute', unit: 'eggs', steps: [{ label: 'Eggs', value: v.eggs }, { label: 'Substitute', value: v.substitute }, { label: 'Per egg', value: info[v.substitute] }, { label: 'Total', value: 'Mix ' + v.eggs + 'x ' + info[v.substitute] }] }
    },
    description: 'Vegan egg alternatives for baking. Flax and chia eggs bind best; banana and applesauce add moisture.',
    example: { label: '3 eggs to flax eggs', value: '3 tbsp flax + 9 tbsp water' }
}

export default calcDef
