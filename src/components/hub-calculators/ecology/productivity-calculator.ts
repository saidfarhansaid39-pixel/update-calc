import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

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
  presets: [
    { label: 'Tropical rainforest', values: { gpp: '3500', respiration: '2500', biomassStock: '400' } },
    { label: 'Coral reef', values: { primaryProd: '2500', trophicLevels: '4', fishBiomass: '150' } },
    { label: 'Temperate lake', values: { energyInput: '800', respiration: '650', trophicEfficiency: '10' } },
    { label: 'Agricultural field', values: { npp: '1200', harvest: '800', soilCarbon: '80' } },
    { label: 'Deep ocean', values: { gpp: '150', respiration: '50', trophicEfficiency: '5' } }
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
,
    extras: [
      { label: "Environmental Context", value: "Productivity and energy transfer govern ecosystem structure. Only ~10% of energy transfers between trophic levels, limiting food web length." },
      { label: "Measurement Method", value: "Primary productivity measured via light-dark bottle method, eddy covariance, or satellite NDVI. Trophic levels determined by stable isotope analysis (δ¹⁵N)." },
      { label: "Conservation Note", value: "Ecosystem services valued at $125-140 trillion/year (2019 estimate). Intact ecosystems provide pollination, water purification, and climate regulation." },
      { label: "Typical Ranges", value: "Trophic transfer efficiency: 5-20%. NPP ranges: 0-500 (desert) to 2000-2500+ g C/m²/yr (tropical rainforest)." },
      { label: "Related Concepts", value: "Food web dynamics, ecological pyramids, keystone species, trophic cascades, ecosystem engineering, ecological stoichiometry." }
    ]}
  },
  description: 'Ecosystem productivity measures carbon fixation by plants. GPP is total photosynthesis, NPP = GPP - plant respiration, NEP = NPP - heterotroph respiration.',
  formula: 'NPP = GPP - Ra | NEP = NPP - Rh | GPP: Gross Primary Production, Ra: autotrophic respiration, Rh: heterotrophic respiration',
  interpretation: 'Tropical forests: NPP ~2000 gC/m²/yr. Deserts: <100. Oceans: ~140. NEP positive = carbon sink. NEP negative = carbon source. Human activities affect NEP globally.'
}

export default calcDef
