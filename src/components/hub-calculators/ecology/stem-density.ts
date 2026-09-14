import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ stems: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'stems', label: 'Number of stems counted', type: 'number', min: 0, step: '1' },
    { name: 'area', label: 'Sampling area (ha)', type: 'number', min: 0.01, step: '0.01' },
    ],
  presets: [
    { label: 'Tropical hardwood', values: { dbh: '65', height: '28', species: 'trop' } },
    { label: 'Temperate oak', values: { dbh: '40', height: '20', species: 'hard' } },
    { label: 'Pine plantation', values: { dbh: '30', height: '18', species: 'soft' } },
    { label: 'Large mahogany', values: { dbh: '100', height: '35', species: 'trop' } },
    { label: 'Young birch', values: { dbh: '15', height: '12', species: 'hard' } }
    ],
  compute: (v) => { const stems = parseInt(v.stems); const area = parseFloat(v.area); const density = stems / area; return { result: density, label: 'Stem Density', unit: 'stems/ha', steps: [{ label: 'Stems counted', value: `${stems}` }, { label: 'Area sampled', value: `${area} ha` }, { label: 'Density', value: `${density.toFixed(1)} stems/ha` }, { label: 'Interpretation', value: density>500?'High density':density>100?'Moderate':'Low density' }] ,
    extras: [
      { label: "Environmental Context", value: "Forest biomass is a key carbon pool and indicator of ecosystem productivity. Trees store ~80% of terrestrial aboveground carbon." },
      { label: "Measurement Method", value: "Allometric equations based on DBH, height, and wood density. Species-specific parameters from published pantropical or regional models." },
      { label: "Conservation Note", value: "Old-growth forests contain 30-70% more biomass than logged or secondary forests. Reducing deforestation is the most effective forest-based climate solution." },
      { label: "Typical Ranges", value: "Tropical: 200-500 Mg/ha AGB. Temperate hardwoods: 100-300 Mg/ha. Boreal: 50-150 Mg/ha. Wood density: 0.3-0.9 g/cm³." },
      { label: "Related Concepts", value: "Forest inventory, stand density management, bioenergy, REDD+ MRV, carbon stock assessment, reduced-impact logging." }
    ]} },
  description: 'Stem density is a fundamental forest structure metric counting the number of individual stems per unit area.',
  formula: 'Stem density = Stems counted / Area (ha)',
  interpretation: 'Tropical forests: 400-700 stems/ha. Temperate: 200-600 stems/ha. Boreal: 500-2000 stems/ha. Higher density = more competition.'
}

export default calcDef
