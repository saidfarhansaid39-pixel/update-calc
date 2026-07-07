import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    sampleBand: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'),
    controlBand: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'sampleBand', label: 'Sample Band Intensity (zymogram)', type: 'number', min: 0, step: '0.1' },
    { name: 'controlBand', label: 'Control Band Intensity', type: 'number', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const relActivity = (v.sampleBand / v.controlBand) * 100
    return {
      result: relActivity, label: 'Relative Gelatinase Activity', unit: '% of control',
      steps: [
        { label: 'Sample band intensity', value: `${v.sampleBand.toFixed(1)}` },
        { label: 'Control band intensity', value: `${v.controlBand.toFixed(1)}` },
        { label: 'Relative activity = sample/control × 100', value: `${relActivity.toFixed(1)}%` },
        { label: 'Interpretation', value: relActivity > 150 ? 'Increased activity (e.g., MMP upregulation)' : relActivity < 50 ? 'Decreased activity (e.g., TIMP inhibition)' : 'Activity comparable to control' },
      ]
}
  },
  description: 'Zymography uses substrate-impregnated gels to detect enzyme activity (typically MMPs). Clear bands on a dark background indicate proteolytic activity. Densitometry quantifies relative activity.',
  formula: 'Relative activity (%) = (sample band density / control band density) × 100% | Gelatin zymography detects MMP-2 (72 kDa) and MMP-9 (92 kDa)',
  interpretation: 'Zymography detects active and pro-enzyme forms (SDS activates pro-MMPs). Clear zone area and intensity reflect enzyme amount. Include positive control (recombinant enzyme) for absolute quantitation.'
}

export default calcDef
