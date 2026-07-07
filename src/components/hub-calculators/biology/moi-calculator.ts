import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    viralTiter: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    cellCount: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0'),
    desiredMoi: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'viralTiter', label: 'Viral Titer', type: 'number', unit: 'PFU/mL', min: 1e3, step: '1e3' },
    { name: 'cellCount', label: 'Number of Target Cells', type: 'number', min: 1, step: '1000' },
    { name: 'desiredMoi', label: 'Desired MOI', type: 'number', min: 0.01, step: '0.1' },
  ],
  compute: (v) => {
    const vpNeeded = v.cellCount * v.desiredMoi
    const volMl = v.viralTiter > 0 ? vpNeeded / v.viralTiter : 0
    const inPct = volMl > 0 ? (1 - Math.exp(-v.desiredMoi)) * 100 : 0
    return {
      result: volMl, label: 'Viral Stock Volume Required', unit: 'mL',
      steps: [
        { label: 'Target cells', value: `${v.cellCount.toLocaleString()}` },
        { label: 'Desired MOI', value: `${v.desiredMoi}` },
        { label: 'Viral particles needed', value: `${vpNeeded.toExponential(4)}` },
        { label: 'Titer', value: `${v.viralTiter.toExponential(4)} PFU/mL` },
        { label: 'Volume = VP / titer', value: `${volMl.toExponential(4)} mL` },
        { label: 'Expected infection rate (Poisson)', value: `${inPct.toFixed(1)}% of cells` },
      ]
}
  },
  description: 'Multiplicity of Infection (MOI) is the ratio of infectious viral particles to target cells. The Poisson distribution governs the proportion of cells infected at a given MOI.',
  formula: 'MOI = VP / cells | Volume = (cells × MOI) / titer | P(infected) = 1 - e^(-MOI) | MOI = 1 ? ~63% cells infected',
  interpretation: 'MOI = 1: ~63% cells infected by at least 1 virus. MOI = 10: >99.9% infected (useful for high transduction efficiency). MOI = 0.1: ~9.5% infected (useful for single-copy integration studies). Adjust titer for accurate MOI.'
}

export default calcDef
