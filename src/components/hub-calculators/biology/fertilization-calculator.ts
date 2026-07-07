import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    area: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    nRate: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    pRate: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    kRate: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0')
}),
  fields: [
    { name: 'area', label: 'Field Area', type: 'number', unit: 'hectares', min: 0.01, step: '0.01' },
    { name: 'nRate', label: 'N Rate (recommended)', type: 'number', unit: 'kg/ha', min: 0, step: '1' },
    { name: 'pRate', label: 'P2O5 Rate (recommended)', type: 'number', unit: 'kg/ha', min: 0, step: '1' },
    { name: 'kRate', label: 'K2O Rate (recommended)', type: 'number', unit: 'kg/ha', min: 0, step: '1' },
  ],
  compute: (v) => {
    const nTotal = v.nRate * v.area
    const pTotal = v.pRate * v.area
    const kTotal = v.kRate * v.area
    return {
      result: nTotal, label: 'Total N Needed', unit: 'kg',
      steps: [
        { label: 'Area', value: `${v.area} ha` },
        { label: 'N recommendation', value: `${v.nRate} kg/ha` },
        { label: 'Total N', value: `${nTotal.toFixed(1)} kg` },
        { label: 'Total P2O5', value: `${pTotal.toFixed(1)} kg` },
        { label: 'Total K2O', value: `${kTotal.toFixed(1)} kg` },
      ]
}
  },
  description: 'Fertilizer calculations determine the nutrient amounts needed for crop production based on soil tests, crop requirements, and field area.',
  formula: 'Nutrient Total (kg) = Rate (kg/ha) × Area (ha)',
  interpretation: 'N-P-K rates vary by crop: corn (150-200-150), wheat (100-50-50), rice (100-50-50). Soil testing every 2-3 years optimizes fertilizer application.'
}

export default calcDef
