import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    ec50: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    hill: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    dose: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'ec50', label: 'EC50 (half-max response)', type: 'number', unit: 'nM', min: 0.001, step: '0.1' },
    { name: 'hill', label: 'Hill Slope (n)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'dose', label: 'Test Dose', type: 'number', unit: 'nM', min: 0.001, step: '0.1' },
  ],
  compute: (v) => {
    const response = 100 / (1 + (v.ec50 / v.dose) ** v.hill)
    return {
      result: response, label: 'Response at Given Dose', unit: '% of max',
      steps: [
        { label: 'EC50', value: `${v.ec50} nM` },
        { label: 'Hill slope (n)', value: `${v.hill}` },
        { label: 'Test dose', value: `${v.dose} nM` },
        { label: 'Response = 100% / (1 + (EC50/Dose)^n)', value: `${response.toFixed(1)}% of max` },
        { label: 'Interpretation', value: response < 20 ? 'Low response (below EC20)' : response < 50 ? 'Sub-maximal' : response < 80 ? 'Near EC50 range' : 'Near-maximal response' },
      ]
}
  },
  description: 'The four-parameter logistic (4PL) dose-response model describes the relationship between drug concentration and biological effect. EC50 is the concentration producing half-maximal effect.',
  formula: 'Response = Bottom + (Top - Bottom) / (1 + (EC50/[Dose])^Hill) | Hill > 1: steep (cooperative); Hill = 1: standard; Hill < 1: shallow',
  interpretation: 'Hill slope = 1: standard one-to-one binding. Hill > 1: positive cooperativity (multiple binding sites). Hill < 1: negative cooperativity or heterogeneous receptors. EC50 equals IC50 for inhibitory responses.'
}

export default calcDef
