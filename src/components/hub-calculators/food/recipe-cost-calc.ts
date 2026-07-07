import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'totalCost', label: 'Total Cost ($)', type: 'number', min: 0, step: '0.01' },
      { name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' },
      { name: 'waste', label: 'Waste %', type: 'select', options: [{ label: '0%', value: '1' }, { label: '5%', value: '0.95' }, { label: '10%', value: '0.9' }, { label: '15%', value: '0.85' }] }
    ],
    compute: (v) => {
      const es = v.servings * v.waste; const r = v.totalCost / es; return { result: r, label: 'Cost/Serving', unit: '$', steps: [{ label: 'Total cost', value: '$' + v.totalCost.toFixed(2) }, { label: 'Effective servings', value: es.toFixed(1) }, { label: 'Cost per serving', value: '$' + r.toFixed(2) }] }
    },
    description: 'Recipe cost per serving with waste adjustment. Account for peels, trimmings, and spoilage.',
    example: { label: '$30, 4 servings, 10% waste', value: '$8.33/serving' }
}

export default calcDef
