import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    kOut: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    kIn: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    naOut: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0'),
    naIn: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'kOut', label: '[K?] extracellular', type: 'number', unit: 'mM', min: 0.1, step: '0.1' },
    { name: 'kIn', label: '[K?] intracellular', type: 'number', unit: 'mM', min: 0.1, step: '0.1' },
    { name: 'naOut', label: '[Na?] extracellular (opt)', type: 'number', unit: 'mM', min: 0, step: '0.1' },
    { name: 'naIn', label: '[Na?] intracellular (opt)', type: 'number', unit: 'mM', min: 0, step: '0.1' },
  ],
  compute: (v) => {
    const nernst = 61.54 * Math.log10(v.kOut / v.kIn)
    let goldman = nernst
    if (v.naOut && v.naIn) {
      const pNA = 0.04
      const numerator = v.kOut + pNA * v.naOut
      const denominator = v.kIn + pNA * v.naIn
      goldman = denominator > 0 ? 61.54 * Math.log10(numerator / denominator) : 0
    }
    return {
      result: goldman, label: 'Membrane Potential (Goldman)', unit: 'mV',
      steps: [
        { label: '[K?]? / [K?]?', value: `${v.kOut} / ${v.kIn} mM` },
        { label: 'Nernst EK', value: `${nernst.toFixed(1)} mV` },
        ...(v.naOut && v.naIn ? [
          { label: '[Na?]? / [Na?]?', value: `${v.naOut} / ${v.naIn} mM` },
          { label: 'Goldman Vm', value: `${goldman.toFixed(1)} mV` },
        ] : [{ label: 'Note', value: 'Add Na? for Goldman equation' }]),
        { label: 'Resting Vm range', value: '-70 to -90 mV (typical)' },
      ]
}
  },
  description: 'Membrane potential is the voltage difference across a cell membrane. The Nernst/Goldman equations calculate equilibrium potentials for ions.',
  formula: 'EK = RT/zF × ln([K?]?/[K?]?) | Goldman: Vm = 61.54 × log((K? + 0.04Na?)/(K? + 0.04Na?))',
  interpretation: 'Resting membrane potential: -70 to -90 mV (neurons). Maintained by Na?/K? ATPase. Changes in Vm trigger action potentials and cellular signaling.'
}

export default calcDef
