import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ dbh: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), height: z.string().optional(), species: z.string().optional() }),
  fields: [
    { name: 'dbh', label: 'Diameter at breast height (cm)', type: 'number', min: 1, step: '0.1' },
    { name: 'height', label: 'Height (m, optional)', type: 'number', min: 1, step: '0.5' },
    { name: 'species', label: 'Species group', type: 'select', options: [{ label: 'Hardwood', value: 'hard' }, { label: 'Softwood', value: 'soft' }, { label: 'Tropical', value: 'trop' }] },
    ],
  presets: [
    { label: 'Tropical hardwood', values: { dbh: '65', height: '28', species: 'trop' } },
    { label: 'Temperate oak', values: { dbh: '40', height: '20', species: 'hard' } },
    { label: 'Pine plantation', values: { dbh: '30', height: '18', species: 'soft' } },
    { label: 'Large mahogany', values: { dbh: '100', height: '35', species: 'trop' } },
    { label: 'Young birch', values: { dbh: '15', height: '12', species: 'hard' } }
    ],
  compute: (v) => { const d = parseFloat(v.dbh); const h = parseFloat(v.height)||d*0.6; const sp = v.species||'hard'; const fMap: Record<string,number>={hard:0.12,soft:0.09,trop:0.15}; const f = fMap[sp]; const agb = f * (d**2 * h) * 0.5; const carbon = agb * 0.47; return { result: agb, label: 'Aboveground Biomass', unit: 'kg', steps: [{ label: 'DBH', value: `${d} cm` }, { label: 'Height', value: `${h.toFixed(1)} m` }, { label: 'AGB = f × D²H', value: `${agb.toFixed(1)} kg` }, { label: 'Carbon content', value: `${carbon.toFixed(1)} kg C` }] ,
    extras: [
      { label: "Environmental Context", value: "Forest biomass is a key carbon pool and indicator of ecosystem productivity. Trees store ~80% of terrestrial aboveground carbon." },
      { label: "Measurement Method", value: "Allometric equations based on DBH, height, and wood density. Species-specific parameters from published pantropical or regional models." },
      { label: "Conservation Note", value: "Old-growth forests contain 30-70% more biomass than logged or secondary forests. Reducing deforestation is the most effective forest-based climate solution." },
      { label: "Typical Ranges", value: "Tropical: 200-500 Mg/ha AGB. Temperate hardwoods: 100-300 Mg/ha. Boreal: 50-150 Mg/ha. Wood density: 0.3-0.9 g/cm³." },
      { label: "Related Concepts", value: "Forest inventory, stand density management, bioenergy, REDD+ MRV, carbon stock assessment, reduced-impact logging." }
    ]} },
  description: 'Allometric biomass estimation uses tree diameter, height, and species-specific equations to estimate aboveground biomass.',
  formula: 'AGB = f × (D²H) × 0.5 | Carbon = AGB × 0.47 | f varies by wood density',
  interpretation: 'A 50 cm DBH hardwood tree ≈ 1500-3000 kg biomass. Allometric equations are species and region-specific. Wood density is a key parameter.'
}

export default calcDef
