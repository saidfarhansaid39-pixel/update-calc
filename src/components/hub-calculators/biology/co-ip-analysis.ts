import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    baitBand: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'),
    preyBand: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'),
    controlBand: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0')
}),
  fields: [
    { name: 'baitBand', label: 'Bait (IP target) Band Intensity', type: 'number', min: 0, step: '0.1' },
    { name: 'preyBand', label: 'Prey (Co-IP) Band Intensity', type: 'number', min: 0, step: '0.1' },
    { name: 'controlBand', label: 'IgG Control Background', type: 'number', min: 0, step: '0.1' },
  ],
  compute: (v) => {
    const netBait = Math.max(0, v.baitBand - v.controlBand)
    const netPrey = Math.max(0, v.preyBand - v.controlBand)
    const bindingRatio = netBait > 0 ? netPrey / netBait : 0
    return {
      result: bindingRatio, label: 'Binding Ratio (Prey/Bait)', unit: '',
      steps: [
        { label: 'Raw bait intensity', value: `${v.baitBand.toFixed(1)}` },
        { label: 'Raw prey intensity', value: `${v.preyBand.toFixed(1)}` },
        { label: 'IgG background', value: `${v.controlBand.toFixed(1)}` },
        { label: 'Net bait (bait - control)', value: `${netBait.toFixed(1)}` },
        { label: 'Net prey (prey - control)', value: `${netPrey.toFixed(1)}` },
        { label: 'Binding ratio', value: `${bindingRatio.toFixed(3)}` },
        { label: 'Interpretation', value: bindingRatio > 0.5 ? 'Strong interaction' : bindingRatio > 0.2 ? 'Moderate interaction' : bindingRatio > 0.05 ? 'Weak interaction' : 'No specific interaction detected' },
      ]
}
  },
  description: 'Co-immunoprecipitation (Co-IP) analysis quantifies protein-protein interactions. The bait protein is immunoprecipitated, and co-precipitated prey proteins are detected by western blot. IgG control corrects for nonspecific binding.',
  formula: 'Binding ratio = (Prey intensity - IgG) / (Bait intensity - IgG) | Ratio > 0.3: strong/stable interaction | Ratio 0.1-0.3: moderate/transient | Ratio < 0.1: weak/non-specific',
  interpretation: 'Compare binding ratio across conditions (e.g., treatment vs control). Include an unrelated antibody as negative control. Reciprocal Co-IP (swap bait and prey) confirms interaction. Crosslinking (DSP, formaldehyde) captures transient interactions.'
}

export default calcDef
