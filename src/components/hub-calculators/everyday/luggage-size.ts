import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), depth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), limitLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), unit: z.enum(['in', 'cm']) }),
  fields: [
    { name: 'length', label: 'Length', type: 'number', min: 1, step: '1' },
    { name: 'width', label: 'Width', type: 'number', min: 1, step: '1' },
    { name: 'depth', label: 'Depth', type: 'number', min: 1, step: '1' },
    { name: 'unit', label: 'Unit', type: 'select', options: [{ label: 'Inches', value: 'in' }, { label: 'Centimeters', value: 'cm' }] },
    { name: 'limitLength', label: 'Max Linear Dimension (L+W+D)', type: 'number', min: 1, step: '10' },
  ],
  compute: (v) => { const linear = v.length + v.width + v.depth; const compliant = linear <= v.limitLength; const overBy = compliant ? 0 : linear - v.limitLength; return { result: linear, label: 'Total Linear Inches/cm', unit: v.unit, steps: [{ label: 'L + W + D', value: `${v.length} + ${v.width} + ${v.depth} = ${linear.toFixed(1)} ${v.unit}` }, { label: 'Airline Limit', value: `${v.limitLength} ${v.unit}` }, { label: 'Status', value: compliant ? '✓ Compliant' : `✗ Over by ${overBy.toFixed(1)} ${v.unit}` }] } },
  description: 'Check if your luggage meets airline size restrictions by calculating total linear dimensions (length + width + depth).',
  formula: 'Linear = L + W + D | Compliant if Linear ≤ Airline Limit',
  interpretation: 'Most US airlines: 62 linear inches (158 cm) for checked bags. Carry-on: 45 linear inches (22×14×9 in typical). Excess size fees: $75-200 per bag.'
}

export default calcDef
