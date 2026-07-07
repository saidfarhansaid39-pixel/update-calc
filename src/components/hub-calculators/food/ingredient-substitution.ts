import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'category', label: 'Category', type: 'select', options: [{ label: 'Dairy (1:1)', value: '1_dairy' }, { label: 'Egg (1:1)', value: '1_egg' }, { label: 'Flour (0.8x)', value: '0.8_flour' }, { label: 'Sweetener (0.75x)', value: '0.75_sweet' }, { label: 'Fat (0.8x)', value: '0.8_fat' }] },
      { name: 'amount', label: 'Original Amount', type: 'number', min: 0, step: '0.25' }
    ],
    compute: (v) => {
      const p = v.category.split('_'); const r = parseFloat(p[0]); const result = v.amount * r; return { result, label: 'Substitute Amount', unit: 'units', steps: [{ label: 'Category', value: p.slice(1).join(' ') }, { label: 'Ratio', value: r + 'x' }, { label: 'Substitute', value: result.toFixed(2) }] }
    },
    description: 'Ingredient substitutions by category with conversion ratios.',
    example: { label: '100g sugar (sweetener 0.75x)', value: '75g honey equivalent' }
}

export default calcDef
