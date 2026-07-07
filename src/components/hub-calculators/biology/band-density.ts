import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    sampleIntensity: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'),
    stdIntensity: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    stdConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'sampleIntensity', label: 'Sample Band Intensity', type: 'number', min: 0, step: '0.1' },
    { name: 'stdIntensity', label: 'Standard Band Intensity', type: 'number', min: 0.1, step: '0.1' },
    { name: 'stdConc', label: 'Standard Concentration', type: 'number', min: 0.01, step: '0.1' },
  ],
  compute: (v) => {
    const estConc = (v.sampleIntensity / v.stdIntensity) * v.stdConc
    return {
      result: estConc, label: 'Estimated Sample Concentration', unit: 'ng',
      steps: [
        { label: 'Sample band intensity', value: `${v.sampleIntensity.toFixed(1)}` },
        { label: 'Standard band intensity', value: `${v.stdIntensity.toFixed(1)}` },
        { label: 'Standard concentration', value: `${v.stdConc} ng` },
        { label: 'Est. conc = (sample/std) × standard', value: `${estConc.toFixed(2)} ng` },
        { label: 'Note', value: 'Use standard curve (multiple concentrations) for accurate quantitation' },
      ]
}
  },
  description: 'Band density quantitation compares sample band intensity to a known standard on gels or blots. Accurate quantitation requires a standard curve with multiple known concentrations.',
  formula: 'Sample amount = (sample intensity / standard intensity) × standard amount | Use linear range of detection for accuracy',
  interpretation: 'Densitometric analysis is semi-quantitative without proper standards. Load known amounts of purified protein or DNA for absolute quantitation. Image saturation must be avoided. Background subtraction is critical.'
}

export default calcDef
