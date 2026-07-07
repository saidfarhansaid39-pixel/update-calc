import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'base', label: 'Base Ingredient Amount', type: 'number', min: 0, step: '0.1' },
      { name: 'ratio', label: 'Target Ratio (relative to 1)', type: 'number', min: 0.01, step: '0.01' },
    ],
    compute: (v) => ({ result: v.base * v.ratio, label: 'Target Ingredient Amount', unit: 'units', steps: [
      { label: 'Base amount', value: `${v.base}` },
      { label: 'Ratio', value: `${v.ratio}:1` },
      { label: 'Target amount', value: `${(v.base * v.ratio).toFixed(2)}` },
    ]}),
    description: 'Calculate proportional ingredient amounts based on a base ingredient and a target ratio. Essential for custom recipes and formula-based cooking.',
    example: { label: '200g base, ratio 0.5', value: '100g' }
}

export default calcDef
