import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'amount', label: 'Salt Amount', type: 'number', unit: 'tsp', min: 0.25, step: '0.25' },
      { name: 'type', label: 'Salt Type', type: 'select', options: [{ label: 'Table salt (fine)', value: '1_table' },   { label: 'Kosher (coarse)', value: '0.7_kosher' }, { label: 'Sea salt (fine)', value: '0.85_sea' }, { label: 'Himalayan pink', value: '0.9_himalayan' }, { label: 'Low sodium substitute', value: '1.2_low' }] }
    ],
    compute: (v) => {
      const p = v.type.split('_'); const f = parseFloat(p[0]); const result = v.amount * f; return { result, label: 'Equivalent', unit: 'tsp', steps: [{ label: 'Original', value: v.amount + ' tsp table salt' }, { label: 'To ' + p.slice(1).join(' '), value: result.toFixed(2) + ' tsp' }] }
    },
    description: 'Convert between different salt types. Kosher salt is less dense so you need more by volume.',
    example: { label: '1 tsp table salt to kosher', value: '1.43 tsp kosher' }
}

export default calcDef
