import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    targetBand: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'),
    loadingBand: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'targetBand', label: 'Target Protein Band Density', type: 'number', min: 0, step: '0.1' },
    { name: 'loadingBand', label: 'Loading Control Band Density', type: 'number', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const normalized = v.targetBand / v.loadingBand
    return {
      result: normalized, label: 'Normalized Expression', unit: 'AU',
      steps: [
        { label: 'Target band density', value: `${v.targetBand.toFixed(2)}` },
        { label: 'Loading control density', value: `${v.loadingBand.toFixed(2)}` },
        { label: 'Normalized = target / loading', value: `${normalized.toFixed(4)}` },
        { label: 'Relative to control sample', value: 'Divide by control normalized value for fold change' },
        { label: 'Common controls', value: 'ß-actin (42 kDa), GAPDH (37 kDa), tubulin (50 kDa)' },
      ]
}
  },
  description: 'Western blot normalization corrects for unequal protein loading and transfer efficiency by dividing target protein signal by a loading control (housekeeping protein) signal.',
  formula: 'Normalized expression = Target density / Loading control density | Fold change = normalized(treated) / normalized(control)',
  interpretation: 'Choose loading control expressed at constant levels across conditions. Avoid controls affected by treatment. Total protein stain (Ponceau S, Revert) is an alternative to single-protein loading controls.'
}

export default calcDef
