import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ dbh: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), height: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'dbh', label: 'Diameter at breast height (cm)', type: 'number', min: 1, step: '0.1' },
    { name: 'height', label: 'Tree height (m)', type: 'number', min: 1, step: '0.5' },
    ],
  presets: [
    { label: 'Tropical hardwood', values: { dbh: '65', height: '28', species: 'trop' } },
    { label: 'Temperate oak', values: { dbh: '40', height: '20', species: 'hard' } },
    { label: 'Pine plantation', values: { dbh: '30', height: '18', species: 'soft' } },
    { label: 'Large mahogany', values: { dbh: '100', height: '35', species: 'trop' } },
    { label: 'Young birch', values: { dbh: '15', height: '12', species: 'hard' } }
    ],
  compute: (v) => { const d = parseFloat(v.dbh); const h = parseFloat(v.height); const r = d/200; const vol = Math.PI * r*r * h * 0.5; return { result: vol, label: 'Tree Volume', unit: 'm³', steps: [{ label: 'DBH', value: `${d} cm` }, { label: 'Height', value: `${h} m` }, { label: 'Radius', value: `${r.toFixed(3)} m` }, { label: 'Volume = πr²h × 0.5', value: `${vol.toFixed(2)} m³` }] ,
    extras: [
      { label: "Environmental Context", value: "Forest biomass is a key carbon pool and indicator of ecosystem productivity. Trees store ~80% of terrestrial aboveground carbon." },
      { label: "Measurement Method", value: "Allometric equations based on DBH, height, and wood density. Species-specific parameters from published pantropical or regional models." },
      { label: "Conservation Note", value: "Old-growth forests contain 30-70% more biomass than logged or secondary forests. Reducing deforestation is the most effective forest-based climate solution." },
      { label: "Typical Ranges", value: "Tropical: 200-500 Mg/ha AGB. Temperate hardwoods: 100-300 Mg/ha. Boreal: 50-150 Mg/ha. Wood density: 0.3-0.9 g/cm³." },
      { label: "Related Concepts", value: "Forest inventory, stand density management, bioenergy, REDD+ MRV, carbon stock assessment, reduced-impact logging." }
    ]} },
  description: 'Tree volume estimation uses DBH and height with a form factor (typically 0.5) to calculate merchantable timber volume.',
  formula: 'V = π × (DBH/200)² × H × F | where F = 0.5 (form factor)',
  interpretation: 'Form factor varies by species (0.4-0.6). Higher form factors = more cylindrical boles. Total volume includes branches for biomass estimation.'
}

export default calcDef
