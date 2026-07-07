import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    tailLength: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'),
    tailDnaPct: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 100 }, '0-100')
}),
  fields: [
    { name: 'tailLength', label: 'Comet Tail Length', type: 'number', unit: 'µm', min: 0, step: '0.1' },
    { name: 'tailDnaPct', label: '% DNA in Tail', type: 'number', unit: '%', min: 0, max: 100, step: '0.1' },
  ],
  compute: (v) => {
    const oliveMoment = v.tailLength * v.tailDnaPct / 100
    const damage = v.tailDnaPct < 5 ? 'Low (undamaged)' : v.tailDnaPct < 20 ? 'Moderate damage' : v.tailDnaPct < 50 ? 'High damage' : 'Very high damage (apoptotic)'
    return {
      result: oliveMoment, label: 'Olive Tail Moment', unit: 'µm',
      steps: [
        { label: 'Tail length', value: `${v.tailLength.toFixed(1)} µm` },
        { label: '% DNA in tail', value: `${v.tailDnaPct.toFixed(1)}%` },
        { label: 'OTM = tail length × %tail DNA / 100', value: `${oliveMoment.toFixed(2)} µm` },
        { label: 'Damage level', value: damage },
        { label: 'Score 50-100 comets/sample', value: 'Use median OTM for statistical analysis' },
      ]
}
  },
  description: 'The comet assay (single-cell gel electrophoresis) measures DNA damage in individual cells. Damaged DNA migrates from the nucleus, forming a comet-like tail. Greater damage = longer, brighter tail.',
  formula: 'Olive Tail Moment (OTM) = Tail length × %DNA in tail / 100 | %Tail DNA is the most reliable parameter | Alkaline comet: detects SSBs + DSBs + alkali-labile sites',
  interpretation: 'Low damage: %Tail DNA < 5-10%. High: > 30%. Apoptotic cells form "hedgehog" comets with most DNA in tail. Alkaline vs neutral comet distinguishes SSBs (alkaline) from DSBs (neutral). Use positive control (H2O2-treated cells).'
}

export default calcDef
