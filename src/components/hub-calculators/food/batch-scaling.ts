import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'batches', label: 'Desired Batches', type: 'number', min: 1, step: '1' },
      { name: 'ingredient', label: 'Per Batch Amount', type: 'number', min: 0, step: '0.25' }
    ],
    compute: (v) => {
      const r = v.ingredient * v.batches; return { result: r, label: 'Total Needed', unit: 'units', steps: [{ label: 'Batches', value: v.batches }, { label: 'Per batch', value: v.ingredient }, { label: 'Total', value: r.toFixed(2) }] }
    },
    description: 'Scale for bulk cooking. Multiply per-batch amounts by desired number of batches.',
    example: { label: '2x batch, 500g flour per batch', value: '1000g flour total' }
}

export default calcDef
