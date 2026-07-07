import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'amount', label: 'Oil (mL)', type: 'number', unit: 'mL', min: 5, step: '5' },
      { name: 'substitute', label: 'Substitute', type: 'select', options: [{ label: 'Butter (1:1 by weight)', value: '1' }, { label: 'Applesauce (0.5x baking)', value: '0.5' }, { label: 'Yogurt (0.5x baking)', value: '0.5' }, { label: 'Avocado (1:1)', value: '1' }] }
    ],
    compute: (v) => {
      const r = parseFloat(v.substitute); const result = v.amount * r; return { result, label: 'Substitute', unit: 'mL/g', steps: [{ label: 'Oil', value: v.amount + ' mL' }, { label: 'Ratio', value: r + 'x' }, { label: 'Need', value: result.toFixed(0) }] }
    },
    description: 'Replace oil with healthier alternatives. Applesauce and yogurt work well in baking at half the amount.',
    example: { label: '100mL oil to applesauce', value: '50mL applesauce' }
}

export default calcDef
