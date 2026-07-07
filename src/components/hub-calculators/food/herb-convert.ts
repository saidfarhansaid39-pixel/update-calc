import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'fresh', label: 'Fresh Herb Amount', type: 'number', unit: 'g', min: 0.5, step: '0.5' },
    ],
    compute: (v) => ({ result: v.fresh / 3, label: 'Dried Herb Equivalent', unit: 'g', steps: [
      { label: 'Fresh herbs', value: `${v.fresh} g` },
      { label: 'Conversion ratio', value: '3:1 (fresh to dried)' },
      { label: 'Dried herbs needed', value: `${(v.fresh / 3).toFixed(1)} g` },
      { label: 'Tip', value: 'Add dried herbs earlier in cooking, fresh herbs at the end' },
    ]}),
    description: 'Convert fresh herbs to dried (and vice versa). General rule: 1 tablespoon fresh = 1 teaspoon dried (3:1 ratio). Dried herbs are more concentrated in flavor.',
    example: { label: '15g fresh basil', value: '5g dried basil' }
}

export default calcDef
