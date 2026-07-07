import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    producers: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    herbivores: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    carnivores: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'producers', label: 'Producer Energy (Level 1)', type: 'number', unit: 'kJ/m²/yr', min: 1, step: '1' },
    { name: 'herbivores', label: 'Herbivore Energy (Level 2)', type: 'number', unit: 'kJ/m²/yr', min: 1, step: '1' },
    { name: 'carnivores', label: 'Carnivore Energy (Level 3, opt)', type: 'number', unit: 'kJ/m²/yr', min: 0, step: '1' },
  ],
  compute: (v) => {
    const eff1 = v.producers > 0 ? v.herbivores / v.producers * 100 : 0
    const eff2 = v.herbivores > 0 && v.carnivores ? v.carnivores / v.herbivores * 100 : 0
    return {
      result: eff1, label: 'Trophic Transfer (P→H)', unit: '%',
      steps: [
        { label: 'Producer energy', value: `${v.producers} kJ/m²/yr` },
        { label: 'Herbivore energy', value: `${v.herbivores} kJ/m²/yr` },
        { label: 'Transfer efficiency', value: `${eff1.toFixed(1)}%` },
        ...(v.carnivores ? [
          { label: 'Carnivore energy', value: `${v.carnivores} kJ/m²/yr` },
          { label: 'Transfer efficiency (H→C)', value: `${eff2.toFixed(1)}%` },
        ] : []),
        { label: 'Lindeman\'s 10% rule', value: 'Typically 5-20% per trophic level' },
      ]
}
  },
  description: 'Trophic levels represent positions in the food chain. Energy transfer between levels is typically only ~10% efficient (Lindeman\'s rule), with the rest lost as heat.',
  formula: 'Efficiency = (Energy at higher level / Energy at lower level) × 100%',
  interpretation: '~10% of energy transfers between trophic levels. This limits food chain length to 4-6 levels. Top predators accumulate toxins through biomagnification.'
}

export default calcDef
