import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    sampleOD2: z.string().refine(v => parseFloat(v) >= 0, '>=0'),
    std1OD: z.string().refine(v => parseFloat(v) >= 0, '>=0'),
    std1Conc: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'sampleOD2', label: 'Sample OD (450 nm)', type: 'number', min: 0, step: '0.001' },
    { name: 'std1OD', label: 'Standard OD', type: 'number', min: 0, step: '0.001' },
    { name: 'std1Conc', label: 'Standard Concentration', type: 'number', unit: 'pg/mL', min: 0.1, step: '1' },
  ],
  compute: (v) => {
    const ratio = v.std1OD > 0 ? v.sampleOD2 / v.std1OD : 0
    const estConc = ratio * v.std1Conc
    return {
      result: estConc, label: 'Estimated Sample Concentration', unit: 'pg/mL',
      steps: [
        { label: 'Sample OD (450 nm)', value: `${v.sampleOD2.toFixed(3)}` },
        { label: 'Standard OD', value: `${v.std1OD.toFixed(3)}` },
        { label: 'Standard concentration', value: `${v.std1Conc} pg/mL` },
        { label: 'Estimated concentration', value: `${estConc.toFixed(2)} pg/mL` },
        { label: 'Note', value: 'Use 4- or 5-parameter logistic fit for accurate quantitation over full standard curve range' },
      ]
}
  },
  description: 'ELISA (Enzyme-Linked Immunosorbent Assay) quantifies antigens or antibodies using enzyme-linked detection. Sample concentration is interpolated from a standard curve.',
  formula: 'Concentration = OD(sample) / OD(standard) × concentration(standard) (linear interpolation assuming background subtracted)',
  interpretation: 'For accurate quantitation, sample OD should fall within the linear range of the standard curve. Use 4PL or 5PL curve fitting for best results. Include blank subtraction, replicates, and QC samples.'
}

export default calcDef
