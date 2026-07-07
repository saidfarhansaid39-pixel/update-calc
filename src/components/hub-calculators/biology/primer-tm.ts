import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    gcCount: z.string().refine(v => parseInt(v) >= 0, '>=0'),
    atCount: z.string().refine(v => parseInt(v) >= 0, '>=0')
}),
  fields: [
    { name: 'gcCount', label: 'G + C Bases', type: 'number', min: 0, step: '1' },
    { name: 'atCount', label: 'A + T Bases', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const totalBases = v.gcCount + v.atCount
    const gcPct = totalBases > 0 ? (v.gcCount / totalBases) * 100 : 0
    const tmBasic = totalBases > 0 ? 2 * v.atCount + 4 * v.gcCount : 0
    const tmNn = totalBases > 0 ? 64.9 + 41 * (gcPct / 100 - 0.41) : 0
    return {
      result: tmBasic, label: 'Melting Temp (Basic)', unit: '°C',
      steps: [
        { label: 'G+C count', value: `${v.gcCount}` },
        { label: 'A+T count', value: `${v.atCount}` },
        { label: 'Total length', value: `${totalBases} bp` },
        { label: 'GC content', value: `${gcPct.toFixed(1)}%` },
        { label: 'Tm = 4(G+C) + 2(A+T)', value: `${tmBasic.toFixed(1)}°C` },
        { label: 'Tm (NN model)', value: `${tmNn.toFixed(1)}°C` },
      ]
}
  },
  description: 'Primer melting temperature (Tm) is the temperature at which half of the primer molecules are annealed to the template. Accurate Tm estimation is critical for PCR success.',
  formula: 'Basic: Tm = 4(G+C) + 2(A+T) for primers < 20 bases | NN model: Tm = 64.9 + 41(%GC - 0.41)',
  interpretation: 'Optimal annealing temperature is typically 3-5°C below Tm. Tm 50-60°C is standard for PCR. Higher Tm (>65°C) may improve specificity but reduce amplification efficiency.'
}

export default calcDef
