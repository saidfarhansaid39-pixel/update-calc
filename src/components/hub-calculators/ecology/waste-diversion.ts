import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ total: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), recycled: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), composted: z.string().optional() }),
  fields: [
    { name: 'total', label: 'Total Waste (kg)', type: 'number', min: 1, step: '1' },
    { name: 'recycled', label: 'Recycled (kg)', type: 'number', min: 0, step: '1' },
    { name: 'composted', label: 'Composted (kg)', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => { const recycled = parseFloat(v.recycled)||0; const composted = parseFloat(v.composted)||0; const diverted = recycled + composted; const rate = diverted / parseFloat(v.total) * 100; return { result: rate, label: 'Waste Diversion Rate', unit: '%', steps: [{ label: 'Total waste', value: `${v.total} kg` }, { label: 'Recycled', value: `${recycled.toFixed(0)} kg` }, { label: 'Composted', value: `${composted.toFixed(0)} kg` }, { label: 'Diverted from landfill', value: `${diverted.toFixed(0)} kg` }, { label: 'Diversion rate', value: `${rate.toFixed(1)}%` }] } },
  description: 'Calculates the percentage of waste diverted from landfill through recycling and composting.',
  formula: 'Diversion rate = (Recycled + Composted) / Total × 100%',
  interpretation: 'Zero waste goals target 90%+ diversion. US average: ~35%. EU average: ~48%.'
}

export default calcDef
