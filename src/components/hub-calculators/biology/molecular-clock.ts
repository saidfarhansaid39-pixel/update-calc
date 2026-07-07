import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    distance: z.string().refine(v => parseFloat(v) > 0, '>0'),
    rate: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'distance', label: 'Genetic Distance (d)', type: 'number', unit: 'subs/site', min: 0.001, step: '0.001' },
    { name: 'rate', label: 'Substitution Rate (µ)', type: 'number', unit: 'subs/site/year', min: 1e-12, step: '1e-9' },
  ],
  compute: (v) => {
    const divergenceTime = v.distance / (2 * v.rate)
    return {
      result: divergenceTime, label: 'Divergence Time', unit: 'years ago',
      steps: [
        { label: 'Genetic distance (d)', value: `${v.distance.toFixed(4)} subs/site` },
        { label: 'Substitution rate (µ)', value: `${v.rate.toExponential(4)} subs/site/yr` },
        { label: 'T = d / (2µ)', value: `${divergenceTime.toFixed(0)} years` },
        { label: 'In Mya (millions)', value: `${(divergenceTime / 1e6).toFixed(2)} Mya` },
      ]
}
  },
  description: 'The molecular clock hypothesis uses the constant rate of molecular evolution to estimate divergence times between species or lineages.',
  formula: 'T = d / (2µ) where T = divergence time, d = genetic distance, µ = substitution rate per site per year',
  interpretation: 'Different genes evolve at different rates. Mitochondrial DNA: ~1-2% per Myr. Nuclear DNA: ~0.1% per Myr. Clock calibration requires fossil evidence. Relaxed clock methods accommodate rate variation.'
}

export default calcDef
