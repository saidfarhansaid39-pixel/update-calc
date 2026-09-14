import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

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
  presets: [
    { label: 'Tropical rainforest', values: { gpp: '3500', respiration: '2500', biomassStock: '400' } },
    { label: 'Coral reef', values: { primaryProd: '2500', trophicLevels: '4', fishBiomass: '150' } },
    { label: 'Temperate lake', values: { energyInput: '800', respiration: '650', trophicEfficiency: '10' } },
    { label: 'Agricultural field', values: { npp: '1200', harvest: '800', soilCarbon: '80' } },
    { label: 'Deep ocean', values: { gpp: '150', respiration: '50', trophicEfficiency: '5' } }
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
,
    extras: [
      { label: "Environmental Context", value: "Productivity and energy transfer govern ecosystem structure. Only ~10% of energy transfers between trophic levels, limiting food web length." },
      { label: "Measurement Method", value: "Primary productivity measured via light-dark bottle method, eddy covariance, or satellite NDVI. Trophic levels determined by stable isotope analysis (δ¹⁵N)." },
      { label: "Conservation Note", value: "Ecosystem services valued at $125-140 trillion/year (2019 estimate). Intact ecosystems provide pollination, water purification, and climate regulation." },
      { label: "Typical Ranges", value: "Trophic transfer efficiency: 5-20%. NPP ranges: 0-500 (desert) to 2000-2500+ g C/m²/yr (tropical rainforest)." },
      { label: "Related Concepts", value: "Food web dynamics, ecological pyramids, keystone species, trophic cascades, ecosystem engineering, ecological stoichiometry." }
    ]}
  },
  description: 'Trophic levels represent positions in the food chain. Energy transfer between levels is typically only ~10% efficient (Lindeman\'s rule), with the rest lost as heat.',
  formula: 'Efficiency = (Energy at higher level / Energy at lower level) × 100%',
  interpretation: '~10% of energy transfers between trophic levels. This limits food chain length to 4-6 levels. Top predators accumulate toxins through biomagnification.'
}

export default calcDef
