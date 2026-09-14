import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({
    source: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    target: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    levels: z.string().optional().refine(v => !v || parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'source', label: 'Energy at Lower Level', type: 'number', unit: 'kJ/m²/yr', min: 1, step: '1' },
    { name: 'target', label: 'Energy at Higher Level', type: 'number', unit: 'kJ/m²/yr', min: 0.1, step: '1' },
    { name: 'levels', label: 'Number of Transfers (optional)', type: 'number', min: 1, step: '1' },
    ],
  presets: [
    { label: 'Tropical rainforest', values: { gpp: '3500', respiration: '2500', biomassStock: '400' } },
    { label: 'Coral reef', values: { primaryProd: '2500', trophicLevels: '4', fishBiomass: '150' } },
    { label: 'Temperate lake', values: { energyInput: '800', respiration: '650', trophicEfficiency: '10' } },
    { label: 'Agricultural field', values: { npp: '1200', harvest: '800', soilCarbon: '80' } },
    { label: 'Deep ocean', values: { gpp: '150', respiration: '50', trophicEfficiency: '5' } }
    ],
  compute: (v) => {
    const efficiency = v.source > 0 ? v.target / v.source * 100 : 0
    const levels = v.levels || 1
    const remaining = v.source * (efficiency / 100) ** levels
    return {
      result: efficiency, label: 'Transfer Efficiency', unit: '%',
      steps: [
        { label: 'Energy at level N', value: `${v.source} kJ/m²/yr` },
        { label: 'Energy at level N+1', value: `${v.target} kJ/m²/yr` },
        { label: 'Efficiency', value: `${efficiency.toFixed(1)}%` },
        ...(levels > 1 ? [
          { label: 'After {levels} transfers', value: `${remaining.toFixed(1)} kJ/m²/yr` },
          { label: `Fraction of original`, value: `${(remaining / v.source * 100).toFixed(2)}%` },
        ] : []),
        { label: '10% rule comparison', value: `${(v.source * 0.1 ** levels).toFixed(1)} kJ (if 10% efficient)` },
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
  description: 'Energy transfer efficiency measures how much energy moves from one trophic level to the next. Typical efficiency is 5-20% (Lindeman\'s trophic dynamics).',
  formula: 'Efficiency = (Energy_N+1 / Energy_N) × 100% | After n transfers: E₀ × (efficiency)^n',
  interpretation: 'If 10% efficient: 1,000,000 J → 100,000 J → 10,000 J → 1,000 J → 100 J. This limits food chain length and explains why top predators are rare.'
}

export default calcDef
