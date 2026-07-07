import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    gpp: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    respiration: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    heterotrophs: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0')
}),
  fields: [
    { name: 'gpp', label: 'Gross Primary Production', type: 'number', unit: 'gC/m²/yr', min: 1, step: '1' },
    { name: 'respiration', label: 'Autotrophic Respiration', type: 'number', unit: 'gC/m²/yr', min: 0.1, step: '1' },
    { name: 'heterotrophs', label: 'Heterotrophic Respiration (opt)', type: 'number', unit: 'gC/m²/yr', min: 0, step: '1' },
  ],
  compute: (v) => {
    const npp = v.gpp - v.respiration
    const nep = v.heterotrophs !== undefined ? npp - v.heterotrophs : 0
    return {
      result: npp, label: 'Net Primary Production', unit: 'gC/m²/yr',
      steps: [
        { label: 'GPP', value: `${v.gpp} gC/m²/yr` },
        { label: 'Autotrophic respiration', value: `${v.respiration} gC/m²/yr` },
        { label: 'NPP = GPP - Ra', value: `${npp.toFixed(0)} gC/m²/yr` },
        ...(v.heterotrophs !== undefined ? [
          { label: 'Heterotrophic respiration', value: `${v.heterotrophs} gC/m²/yr` },
          { label: 'NEP = NPP - Rh', value: `${nep.toFixed(0)} gC/m²/yr` },
        ] : []),
        { label: 'Ecosystem type', value: npp > 1000 ? 'Highly productive (tropical)' : npp > 500 ? 'Moderate (temperate)' : 'Low productivity (desert/boreal)' },
      ]
}
  },
  description: 'Ecosystem productivity measures carbon fixation by plants. GPP is total photosynthesis, NPP = GPP - plant respiration, NEP = NPP - heterotroph respiration.',
  formula: 'NPP = GPP - Ra | NEP = NPP - Rh | GPP: Gross Primary Production, Ra: autotrophic respiration, Rh: heterotrophic respiration',
  interpretation: 'Tropical forests: NPP ~2000 gC/m²/yr. Deserts: <100. Oceans: ~140. NEP positive = carbon sink. NEP negative = carbon source. Human activities affect NEP globally.'
}

export default calcDef
