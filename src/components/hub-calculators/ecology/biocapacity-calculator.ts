import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({
    cropland: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0'),
    pasture: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0'),
    forest: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0'),
    fishing: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0'),
    builtUp: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0')
}),
  fields: [
    { name: 'cropland', label: 'Cropland Area', type: 'number', unit: 'ha', min: 0, step: '1' },
    { name: 'pasture', label: 'Grazing Land', type: 'number', unit: 'ha', min: 0, step: '1' },
    { name: 'forest', label: 'Forest Land', type: 'number', unit: 'ha', min: 0, step: '1' },
    { name: 'fishing', label: 'Fishing Grounds', type: 'number', unit: 'ha', min: 0, step: '1' },
    { name: 'builtUp', label: 'Built-up Land', type: 'number', unit: 'ha', min: 0, step: '1' },
    ],
  presets: [
    { label: 'US average', values: { cropland: '0.5', pasture: '0.3', forest: '0.2', fishing: '0.1', builtUp: '0.15' } },
    { label: 'EU average', values: { cropland: '0.4', pasture: '0.15', forest: '0.25', fishing: '0.05', builtUp: '0.1' } },
    { label: 'Global average', values: { cropland: '0.3', pasture: '0.1', forest: '0.1', fishing: '0.05', builtUp: '0.05' } },
    { label: 'Developing nation', values: { cropland: '0.2', pasture: '0.05', forest: '0.1', fishing: '0.02', builtUp: '0.02' } },
    { label: 'One-planet living', values: { cropland: '0.25', pasture: '0.05', forest: '0.1', fishing: '0.02', builtUp: '0.05' } }
    ],
  compute: (v) => {
    const eqFactors: Record<string, number> = { cropland: 2.52, pasture: 0.46, forest: 1.29, fishing: 0.37, builtUp: 2.52 }
    const cropland = (v.cropland || 0) * eqFactors.cropland
    const pasture = (v.pasture || 0) * eqFactors.pasture
    const forest = (v.forest || 0) * eqFactors.forest
    const fishing = (v.fishing || 0) * eqFactors.fishing
    const builtUp = (v.builtUp || 0) * eqFactors.builtUp
    const total = cropland + pasture + forest + fishing + builtUp
    return {
      result: total, label: 'Total Biocapacity', unit: 'gha',
      steps: [
        ...(v.cropland ? [{ label: 'Cropland', value: `${cropland.toFixed(2)} gha` }] : []),
        ...(v.pasture ? [{ label: 'Pasture', value: `${pasture.toFixed(2)} gha` }] : []),
        ...(v.forest ? [{ label: 'Forest', value: `${forest.toFixed(2)} gha` }] : []),
        ...(v.fishing ? [{ label: 'Fishing', value: `${fishing.toFixed(2)} gha` }] : []),
        ...(v.builtUp ? [{ label: 'Built-up', value: `${builtUp.toFixed(2)} gha` }] : []),
        { label: 'Total biocapacity', value: `${total.toFixed(2)} gha` },
      ]
,
    extras: [
      { label: "Environmental Context", value: "Ecological footprint measures human demand on nature. Humanity currently uses ~1.75 Earths annually — an overshoot that depletes natural capital." },
      { label: "Measurement Method", value: "National Footprint Accounts use UN data on production, trade, and land use. Biocapacity calculated from crop, forest, grazing, and fishing area × yield factors." },
      { label: "Conservation Note", value: "Reducing per-capita footprint from 2.7 to <1.6 gha is essential for sustainability. High-income countries have 3-5× the global average footprint." },
      { label: "Typical Ranges", value: "World average: 2.7 gha/person. US: 8.1, EU: 4.5, China: 3.4, India: 1.1. Biocapacity per person declining as population grows." },
      { label: "Related Concepts", value: "Planetary boundaries, doughnut economics, one-planet living, circular economy, natural capital accounting, SDGs." }
    ]}
  },
  description: 'Biocapacity measures the productivity of a given area of land or sea, converted to global hectares using equivalence factors for each land type.',
  formula: 'Biocapacity = Σ(Area × Equivalence Factor) | Cropland: 2.52, Forest: 1.29, Pasture: 0.46',
  interpretation: 'Global biocapacity: 12.2 billion gha = 1.6 gha/person. Ecological deficit occurs when footprint exceeds biocapacity. Most countries run an ecological deficit.'
}

export default calcDef
