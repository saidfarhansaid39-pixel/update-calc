import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'totalWeight', label: 'Total Weight', type: 'number', unit: 'g', min: 0, step: '0.1' },
      { name: 'servings', label: 'Number of Servings', type: 'number', min: 1, step: '1' },
    ],
    compute: (v) => ({ result: v.totalWeight / v.servings, label: 'Serving Size', unit: 'g', steps: [
      { label: 'Total weight', value: `${v.totalWeight} g` },
      { label: 'Servings', value: `${v.servings}` },
      { label: 'Per serving', value: `${(v.totalWeight / v.servings).toFixed(1)} g` },
    ]}),
    description: 'Calculate the ideal serving size by dividing total dish weight by the number of desired servings. Perfect for portion control and meal prep.',
    example: { label: '800g total, 4 servings', value: '200g per serving' }
}

export default calcDef
