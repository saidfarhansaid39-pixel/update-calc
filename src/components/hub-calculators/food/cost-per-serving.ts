import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'totalCost', label: 'Total Cost ($)', type: 'number', min: 0, step: '0.01' },
      { name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' }
    ],
    compute: (v) => {
      const r = v.totalCost / v.servings; return { result: r, label: 'Cost Per Serving', unit: '$', steps: [{ label: 'Total cost', value: '$' + v.totalCost.toFixed(2) }, { label: 'Servings', value: v.servings }, { label: 'Per serving', value: '$' + r.toFixed(2) }] }
    },
    description: 'Quick cost-per-serving for any recipe.',
    example: { label: '$25, 4 servings', value: '$6.25/serving' }
}

export default calcDef
