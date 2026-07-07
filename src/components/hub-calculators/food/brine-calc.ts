import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'water', label: 'Water Volume', type: 'number', unit: 'L', min: 0.5, step: '0.5' },
      { name: 'type', label: 'Brine Strength', type: 'select', options: [{ label: 'Light (3% salt)', value: '3' }, { label: 'Standard (5% salt)', value: '5' }, { label: 'Strong (8% salt)', value: '8' }] },
      { name: 'sugar', label: 'Add Sugar?', type: 'select', options: [{ label: 'Yes (equal parts)', value: 'yes' }, { label: 'No', value: 'no' }] }
    ],
    compute: (v) => {
      const sp = parseFloat(v.type); const s = v.water * 1000 * sp / 100; const su = v.sugar === 'yes' ? s : 0; return { result: s, label: 'Salt Needed', unit: 'g', steps: [{ label: 'Water', value: v.water + ' L' }, { label: sp + '% salt', value: s.toFixed(0) + ' g' }, su > 0 ? { label: 'Sugar', value: su.toFixed(0) + ' g' } : { label: 'Sugar', value: 'None' }] }
    },
    description: 'Brine percentages: 5% standard, 3% light, 8% strong. Dissolve fully before adding meat.',
    example: { label: '2L water, 5% brine with sugar', value: '100g salt + 100g sugar' }
}

export default calcDef
