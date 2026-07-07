import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'amount', label: 'Yeast Amount', type: 'number', min: 0.25, step: '0.25', unit: 'tsp' },
      { name: 'from', label: 'From', type: 'select', options: [{ label: 'Active dry', value: '1_active' }, { label: 'Instant', value: '0.75_instant' }, { label: 'Fresh', value: '3_fresh' }] },
      { name: 'to', label: 'To', type: 'select', options: [{ label: 'Active dry', value: '1_active' }, { label: 'Instant', value: '0.75_instant' }, { label: 'Fresh', value: '3_fresh' }] }
    ],
    compute: (v) => {
      const fp = v.from.split('_'); const tp = v.to.split('_'); const fr = parseFloat(fp[0]); const tr = parseFloat(tp[0]); const r = v.amount * fr / tr; return { result: r, label: 'Converted Yeast', unit: 'tsp', steps: [{ label: 'Original', value: v.amount + ' tsp ' + fp.slice(1).join(' ') }, { label: 'To ' + tp.slice(1).join(' '), value: r.toFixed(2) + ' tsp' }] }
    },
    description: 'Convert between active dry, instant, and fresh yeast. 1 tsp active dry = 0.75 tsp instant = 3 tsp fresh.',
    example: { label: '1 tsp active dry to instant', value: '0.75 tsp instant' }
}

export default calcDef
