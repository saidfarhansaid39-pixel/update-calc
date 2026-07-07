import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    dnaAmount: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    dnaConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    enzymeUnits: z.string().optional().refine(v => !v || parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'dnaAmount', label: 'DNA Amount', type: 'number', unit: 'µg', min: 0.1, step: '0.1' },
    { name: 'dnaConc', label: 'DNA Concentration', type: 'number', unit: 'µg/µL', min: 0.01, step: '0.01' },
    { name: 'enzymeUnits', label: 'Enzyme Units (optional)', type: 'number', step: '0.5' },
  ],
  compute: (v) => {
    const vol = v.dnaAmount / v.dnaConc
    const units = v.enzymeUnits || 10
    const buf10x = vol * 0.1
    const water = 50 - vol - buf10x - (units / 10)
    return {
      result: vol, label: 'DNA Volume Needed', unit: 'µL',
      steps: [
        { label: 'DNA amount', value: `${v.dnaAmount} µg` },
        { label: 'DNA conc.', value: `${v.dnaConc} µg/µL` },
        { label: 'DNA volume = amount / conc', value: `${vol.toFixed(1)} µL` },
        { label: '10× buffer', value: `${buf10x.toFixed(1)} µL` },
        { label: 'Enzyme (10 U/µL stock)', value: `${(units / 10).toFixed(1)} µL (${units} U)` },
        { label: 'Water to 50 µL total', value: `${Math.max(0, water).toFixed(1)} µL` },
      ]
}
  },
  description: 'Set up a restriction digest reaction. Calculate reagent volumes for a 50 µL reaction containing DNA, restriction enzyme, buffer, and water. Use 5-10 U enzyme per µg DNA.',
  formula: 'DNA volume = Amount / Conc | 10× buffer = 1/10 final volume | 1 U enzyme digests 1 µg DNA in 1 h at optimal temp',
  interpretation: 'Typically 5-10 units per µg DNA for 1 h digest. Overnight digests can use 2-5 U. Total reaction volume 20-50 µL. >10% glycerol from enzyme can cause star activity (non-specific cutting).'
}

export default calcDef
