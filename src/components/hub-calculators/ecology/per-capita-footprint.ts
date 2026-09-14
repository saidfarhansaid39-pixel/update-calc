import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ totalFootprint: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), population: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'totalFootprint', label: 'Total ecological footprint (gha)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'population', label: 'Population size', type: 'number', min: 1, step: '1' },
    ],
  presets: [
    { label: 'US average', values: { cropland: '0.5', pasture: '0.3', forest: '0.2', fishing: '0.1', builtUp: '0.15' } },
    { label: 'EU average', values: { cropland: '0.4', pasture: '0.15', forest: '0.25', fishing: '0.05', builtUp: '0.1' } },
    { label: 'Global average', values: { cropland: '0.3', pasture: '0.1', forest: '0.1', fishing: '0.05', builtUp: '0.05' } },
    { label: 'Developing nation', values: { cropland: '0.2', pasture: '0.05', forest: '0.1', fishing: '0.02', builtUp: '0.02' } },
    { label: 'One-planet living', values: { cropland: '0.25', pasture: '0.05', forest: '0.1', fishing: '0.02', builtUp: '0.05' } }
    ],
  compute: (v) => { const tf = parseFloat(v.totalFootprint); const pop = parseFloat(v.population); const perCap = tf/pop; const earths = perCap/1.6; return { result: perCap, label: 'Per Capita Footprint', unit: 'gha', steps: [{ label: 'Total footprint', value: `${tf} gha` }, { label: 'Population', value: `${pop}` }, { label: 'Per capita', value: `${perCap.toFixed(2)} gha` }, { label: 'Earths if global', value: `${earths.toFixed(2)} planets` }, { label: 'Comparison', value: perCap<1.6?'Below planetary boundary':perCap<4?'Moderate':'High consumer' }] ,
    extras: [
      { label: "Environmental Context", value: "Ecological footprint measures human demand on nature. Humanity currently uses ~1.75 Earths annually — an overshoot that depletes natural capital." },
      { label: "Measurement Method", value: "National Footprint Accounts use UN data on production, trade, and land use. Biocapacity calculated from crop, forest, grazing, and fishing area × yield factors." },
      { label: "Conservation Note", value: "Reducing per-capita footprint from 2.7 to <1.6 gha is essential for sustainability. High-income countries have 3-5× the global average footprint." },
      { label: "Typical Ranges", value: "World average: 2.7 gha/person. US: 8.1, EU: 4.5, China: 3.4, India: 1.1. Biocapacity per person declining as population grows." },
      { label: "Related Concepts", value: "Planetary boundaries, doughnut economics, one-planet living, circular economy, natural capital accounting, SDGs." }
    ]} },
  description: 'Per capita ecological footprint divides total resource demand by population, allowing comparison of individual environmental impact across regions.',
  formula: 'Per capita EF = Total EF / Population | Sustainable < 1.6 gha',
  interpretation: 'World average: ~2.8 gha. US: ~8.1 gha. EU: ~4.5 gha. India: ~1.2 gha. Living sustainably requires < 1.6 gha per person.'
}

export default calcDef
