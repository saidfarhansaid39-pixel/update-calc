import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ merchantableVol: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), beFactor: z.string().optional() }),
  fields: [
    { name: 'merchantableVol', label: 'Merchantable timber volume (m³)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'beFactor', label: 'Biomass expansion factor (BEF)', type: 'number', min: 1, step: '0.1' },
    ],
  presets: [
    { label: 'Tropical hardwood', values: { dbh: '65', height: '28', species: 'trop' } },
    { label: 'Temperate oak', values: { dbh: '40', height: '20', species: 'hard' } },
    { label: 'Pine plantation', values: { dbh: '30', height: '18', species: 'soft' } },
    { label: 'Large mahogany', values: { dbh: '100', height: '35', species: 'trop' } },
    { label: 'Young birch', values: { dbh: '15', height: '12', species: 'hard' } }
    ],
  compute: (v) => { const vol = parseFloat(v.merchantableVol); const bef = parseFloat(v.beFactor)||1.5; const woodDensity = 0.5; const totalBiomass = vol * woodDensity * bef; const carbon = totalBiomass * 0.47; return { result: totalBiomass, label: 'Total Aboveground Biomass', unit: 'Mg', steps: [{ label: 'Merchantable volume', value: `${vol} m³` }, { label: 'BEF', value: `${bef}` }, { label: 'Wood density', value: `${woodDensity} Mg/m³` }, { label: 'Total biomass = V × ρ × BEF', value: `${totalBiomass.toFixed(2)} Mg` }, { label: 'Carbon', value: `${carbon.toFixed(2)} Mg C` }] ,
    extras: [
      { label: "Environmental Context", value: "Forest biomass is a key carbon pool and indicator of ecosystem productivity. Trees store ~80% of terrestrial aboveground carbon." },
      { label: "Measurement Method", value: "Allometric equations based on DBH, height, and wood density. Species-specific parameters from published pantropical or regional models." },
      { label: "Conservation Note", value: "Old-growth forests contain 30-70% more biomass than logged or secondary forests. Reducing deforestation is the most effective forest-based climate solution." },
      { label: "Typical Ranges", value: "Tropical: 200-500 Mg/ha AGB. Temperate hardwoods: 100-300 Mg/ha. Boreal: 50-150 Mg/ha. Wood density: 0.3-0.9 g/cm³." },
      { label: "Related Concepts", value: "Forest inventory, stand density management, bioenergy, REDD+ MRV, carbon stock assessment, reduced-impact logging." }
    ]} },
  description: 'Biomass Expansion Factor (BEF) converts merchantable timber volume to total aboveground biomass, accounting for branches, bark, and non-merchantable components.',
  formula: 'Total AGB = V × ρ × BEF | BEF typically 1.3-1.7 | ρ = wood density',
  interpretation: 'BEF of 1.5 means total biomass is 50% more than merchantable volume. Higher BEF for younger forests and tropical species with more branches.'
}

export default calcDef
