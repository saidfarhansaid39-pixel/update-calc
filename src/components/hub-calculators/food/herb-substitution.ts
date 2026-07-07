import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'herb', label: 'Direction', type: 'select', options: [{ label: 'Fresh to dried (3:1)', value: 'fresh' }, { label: 'Dried to fresh (1:3)', value: 'dried' }] },
      { name: 'amount', label: 'Amount', type: 'number', min: 0.25, step: '0.25', unit: 'tsp' }
    ],
    compute: (v) => {
      const r = v.herb === 'fresh' ? 1/3 : 3; const result = v.amount * r; const from = v.herb === 'fresh' ? 'Fresh' : 'Dried'; const to = v.herb === 'fresh' ? 'Dried' : 'Fresh'; return { result, label: 'Equivalent', unit: 'tsp', steps: [{ label: from, value: v.amount + ' tsp' }, { label: 'Convert to ' + to, value: result.toFixed(2) + ' tsp' }] }
    },
    description: 'Convert fresh herbs to dried (3:1 ratio) and vice versa. Dried herbs are more concentrated.',
    example: { label: '3 tsp fresh basil', value: '1 tsp dried basil' }
}

export default calcDef
