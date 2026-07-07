import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    overlap3: z.string().min(1, 'Required').refine(v => { const n = parseInt(v); return n >= 0 && n <= 20 }, '0-20'),
    gc3End: z.string().min(1, 'Required').refine(v => { const n = parseInt(v); return n >= 0 && n <= 4 }, '0-4')
}),
  fields: [
    { name: 'overlap3', label: "3' Complementary Bases", type: 'number', min: 0, max: 20, step: '1' },
    { name: 'gc3End', label: "G or C in Last 4 Bases (3' end)", type: 'number', min: 0, max: 4, step: '1' },
  ],
  compute: (v) => {
    const riskScore = v.overlap3 >= 4 ? 3 : v.overlap3 >= 2 ? 2 : 1
    const riskLabel = riskScore >= 3 ? 'High' : riskScore >= 2 ? 'Moderate' : 'Low'
    const stability = v.overlap3 >= 3 && v.gc3End >= 2 ? 'Stable dimers likely (GC-rich overlap)' : v.overlap3 >= 2 ? 'Some complementarity' : 'Minimal complementarity'
    return {
      result: riskScore, label: 'Primer Dimer Risk', unit: '',
      steps: [
        { label: "3' complementary bases", value: `${v.overlap3} bp` },
        { label: 'G/C in last 4 bases', value: `${v.gc3End}/4` },
        { label: 'Dimer risk', value: riskLabel },
        { label: 'Stability', value: stability },
        { label: 'Recommendation', value: v.overlap3 >= 3 ? "Redesign primers to reduce 3' overlap" : 'Acceptable — proceed with PCR optimization' },
      ]
}
  },
  description: "Primer-dimer formation occurs when complementary 3' ends of PCR primers hybridize, competing with the target amplicon. GC-rich 3' overlaps form the most stable dimers.",
  formula: "Risk ? 3' complementary bp \u00d7 GC content of overlap | \u0394G(dimer) = \u03a3(base stacking + H-bond energies) | Avoid = 3 bp complementarity at 3' ends",
  interpretation: "Dimer formation reduces amplification efficiency and consumes primers. The most stable dimers have G-C rich 3' overlaps. Primer-dimers can become the dominant PCR product in no-template controls. Use Primer-BLAST or similar tools to check."
}

export default calcDef
