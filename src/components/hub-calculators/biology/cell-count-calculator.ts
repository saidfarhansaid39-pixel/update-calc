import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    count: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    volume: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    dilution: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'count', label: 'Cell Count (from grid)', type: 'number', min: 1, step: '1' },
    { name: 'volume', label: 'Grid Volume', type: 'number', unit: 'mL', min: 0.0001, step: '0.00001' },
    { name: 'dilution', label: 'Dilution Factor', type: 'number', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const dil = v.dilution || 1
    const conc = v.count * dil / v.volume
    return {
      result: conc, label: 'Cell Concentration', unit: 'cells/mL',
      steps: [
        { label: 'Cells counted', value: `${v.count}` },
        { label: 'Grid volume', value: `${v.volume} mL` },
        { label: 'Dilution factor', value: `${dil}` },
        { label: 'Concentration', value: `${conc.toFixed(0)} cells/mL` },
      ]
}
  },
  description: 'Cell counting determines cell concentration for culture seeding, experimental setup, and viability assessment. Typically performed with a hemocytometer.',
  formula: 'Cells/mL = Count × Dilution factor / Volume(mL)',
  interpretation: 'Standard hemocytometer grid volume = 0.0001 mL. Viable cell count uses trypan blue exclusion. Target seeding density: 0.5-5 × 10^4 cells/cm².'
}

export default calcDef
