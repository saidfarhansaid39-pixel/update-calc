import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'starter', label: 'Existing Starter', type: 'number', unit: 'g', min: 10, step: '5' },
      { name: 'ratio', label: 'Feeding Ratio', type: 'select', options: [{ label: '1:1:1 (daily)', value: '1' }, { label: '1:2:2 (building)', value: '2' }, { label: '1:3:3 (large batch)', value: '3' }, { label: '1:5:5 (fridge)', value: '5' }] }
    ],
    compute: (v) => {
      const r = parseFloat(v.ratio); const flour = v.starter * r; const water = v.starter * r; const total = v.starter + flour + water; return { result: total, label: 'Fed Starter', unit: 'g', steps: [{ label: 'Keep starter', value: v.starter + ' g' }, { label: 'Add flour', value: flour + ' g' }, { label: 'Add water', value: water + ' g' }, { label: 'Total', value: total + ' g' }, { label: 'Discard', value: 'Keep ' + v.starter + ' g, discard ' + (total - v.starter) + ' g' }] }
    },
    description: 'Sourdough starter feeding. 1:1:1 is daily maintenance; higher ratios build more for baking.',
    example: { label: '50g starter, 1:2:2 ratio', value: 'Add 100g flour + 100g water = 250g' }
}

export default calcDef
