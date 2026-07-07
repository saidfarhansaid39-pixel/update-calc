import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    sampleOD: z.string().refine(v => parseFloat(v) >= 0, '>=0'),
    controlOD: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'sampleOD', label: 'Sample OD (570 nm)', type: 'number', min: 0, step: '0.001' },
    { name: 'controlOD', label: 'Control (untreated) OD', type: 'number', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const viabilityPct = (v.sampleOD / v.controlOD) * 100
    return {
      result: viabilityPct, label: 'Relative Cell Viability', unit: '%',
      steps: [
        { label: 'Sample OD570', value: `${v.sampleOD.toFixed(3)}` },
        { label: 'Control OD570', value: `${v.controlOD.toFixed(3)}` },
        { label: 'Viability = (sample / control) × 100', value: `${viabilityPct.toFixed(1)}%` },
        { label: 'Cytotoxicity', value: `${(100 - viabilityPct).toFixed(1)}%` },
        { label: 'IC50 check', value: viabilityPct <= 50 ? 'At or below IC50' : 'Above IC50' },
      ]
}
  },
  description: 'The MTT assay measures cell metabolic activity as a proxy for viability. Mitochondrial dehydrogenases convert MTT to insoluble formazan crystals, which are dissolved and measured by absorbance.',
  formula: 'Viability (%) = (ODsample - ODblank) / (ODcontrol - ODblank) × 100',
  interpretation: 'Viability < 100%: reduced metabolic activity (cytotoxicity or growth inhibition). Viability > 100%: increased proliferation. IC50 is the concentration reducing viability to 50%. Background subtraction is critical.'
}

export default calcDef
