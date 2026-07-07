import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'ingredient', label: 'Substitution', type: 'select', options: [{ label: 'Butter to oil (0.8x)', value: '0.8' }, { label: 'Sugar to honey (0.75x)', value: '0.75' }, { label: 'Milk to buttermilk (1x)', value: '1' }, { label: 'Flour to almond (0.8x)', value: '0.8' }] },
      { name: 'amount', label: 'Original Amount', type: 'number', min: 0, step: '0.25' }
    ],
    compute: (v) => {
      const r = parseFloat(v.ingredient); const result = v.amount * r; return { result, label: 'Substitute Amount', unit: 'units', steps: [{ label: 'Ratio', value: r + 'x' }, { label: 'Original', value: v.amount }, { label: 'Substitute', value: result.toFixed(2) }] }
    },
    description: 'Calculate substitute ingredient amounts based on common kitchen conversion ratios.',
    example: { label: '100g butter to oil (0.8x)', value: '80g oil' }
}

export default calcDef
