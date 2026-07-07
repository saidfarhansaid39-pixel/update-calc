import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    producerBiomass: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    consumer1: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    consumer2: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0'),
    consumer3: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0')
}),
  fields: [
    { name: 'producerBiomass', label: 'Producer Biomass (Level 1)', type: 'number', unit: 'g/m²', min: 1, step: '1' },
    { name: 'consumer1', label: 'Primary Consumer (Level 2)', type: 'number', unit: 'g/m²', min: 0, step: '1' },
    { name: 'consumer2', label: 'Secondary Consumer (Level 3)', type: 'number', unit: 'g/m²', min: 0, step: '1' },
    { name: 'consumer3', label: 'Tertiary Consumer (Level 4)', type: 'number', unit: 'g/m²', min: 0, step: '1' },
  ],
  compute: (v) => {
    const levels = [v.producerBiomass, v.consumer1, v.consumer2 || 0, v.consumer3 || 0]
    const ratios = levels.map((biomass, i) => {
      if (i === 0) return { level: i + 1, biomass, ratio: 100 }
      return { level: i + 1, biomass, ratio: levels[i - 1] > 0 ? (biomass / levels[i - 1]) * 100 : 0 }
    })
    return {
      result: levels[0], label: 'Producer Biomass', unit: 'g/m²',
      steps: ratios.filter(r => r.biomass > 0).map(r => ({
        label: `Level ${r.level} (${['Producers', 'Primary', 'Secondary', 'Tertiary'][r.level - 1]})`,
        value: `${r.biomass.toFixed(1)} g/m² (${r.ratio.toFixed(1)}% of previous)`
}))
}
  },
  description: 'A biomass pyramid shows the total mass of organisms at each trophic level. It is wider at the base (producers) and narrows at higher consumer levels.',
  formula: 'Each level typically 5-20% of the level below | Producers → Primary → Secondary → Tertiary consumers',
  interpretation: 'Inverted biomass pyramids can occur in aquatic ecosystems (phytoplankton → zooplankton). Standing crop biomass differs from productivity (flow).'
}

export default calcDef
