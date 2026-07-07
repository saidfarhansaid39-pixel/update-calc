import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    dna: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    conc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    units: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'dna', label: 'DNA Amount', type: 'number', unit: 'µg', min: 0.1, step: '0.1' },
    { name: 'conc', label: 'DNA Concentration', type: 'number', unit: 'µg/µL', min: 0.01, step: '0.01' },
    { name: 'units', label: 'Enzyme Units (optional)', type: 'number', step: '0.5' },
  ],
  compute: (v) => {
    const vol = v.dna / v.conc
    const u = v.units || 10
    const buffer10x = vol * 0.1
    const water = 50 - vol - buffer10x - u / 10
    return {
      result: vol, label: 'DNA Volume', unit: 'µL',
      steps: [
        { label: 'DNA amount', value: `${v.dna} µg` },
        { label: 'DNA conc.', value: `${v.conc} µg/µL` },
        { label: 'DNA volume', value: `${vol.toFixed(1)} µL` },
        { label: '10X buffer', value: `${buffer10x.toFixed(1)} µL` },
        { label: 'Enzyme', value: `${u} U (${(u / 10).toFixed(0)} µL)` },
        { label: 'Water to 50 µL', value: `${Math.max(0, water).toFixed(1)} µL` },
      ]
}
  },
  description: 'Restriction digests require precise ratios of DNA, enzyme, buffer, and water. Calculate reagent volumes for a 50 µL reaction.',
  formula: 'DNA volume = Amount / Concentration | 1 U enzyme digests 1 µg DNA in 1 h',
  interpretation: 'Use 5-10 U enzyme per µg DNA. Overnight digests can use less enzyme. Total reaction volume typically 20-50 µL with 1X final buffer.'
}

export default calcDef
