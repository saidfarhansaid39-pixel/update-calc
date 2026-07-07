import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hours: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hourlyRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), materialCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'hours', label: 'Estimated Hours', type: 'number', min: 0.5, step: '0.5' },
    { name: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', min: 10, step: '5' },
    { name: 'materialCost', label: 'Materials Cost ($)', type: 'number', min: 0, step: '10' },
  ],
  compute: (v) => { const h = parseFloat(v.hours)||0; const r = parseFloat(v.hourlyRate)||0; const mat = parseFloat(v.materialCost)||0; const labor = h * r; const total = labor + mat; return { result: total, label: 'Total Job Cost', unit: '$', steps: [{ label: 'Labor Cost', value: `$${labor.toFixed(2)} (${h}h × $${r}/hr)` }, { label: 'Materials', value: `$${mat.toFixed(2)}` }, { label: 'Total Cost', value: `$${total.toFixed(2)}` }] } },
  description: 'Estimate handyman service costs by labor hours, hourly rate, and materials. Get accurate quotes for home repair and maintenance projects.',
  formula: 'Total = (Hours × Rate) + Materials',
  interpretation: 'Typical handyman rates: $50-100/hr. Minimum service call fee is common (1-2 hrs). Materials are typically marked up 10-20%. Complex jobs may require permits.'
}

export default calcDef
