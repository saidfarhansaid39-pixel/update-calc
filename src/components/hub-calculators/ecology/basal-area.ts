import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ dbh: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), trees: z.string().optional(), area: z.string().optional() }),
  fields: [
    { name: 'dbh', label: 'Average DBH (cm)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'trees', label: 'Number of trees (optional)', type: 'number', min: 1, step: '1' },
    { name: 'area', label: 'Plot area (ha, optional)', type: 'number', min: 0.01, step: '0.01' },
    ],
  presets: [
    { label: 'Tropical hardwood', values: { dbh: '65', height: '28', species: 'trop' } },
    { label: 'Temperate oak', values: { dbh: '40', height: '20', species: 'hard' } },
    { label: 'Pine plantation', values: { dbh: '30', height: '18', species: 'soft' } },
    { label: 'Large mahogany', values: { dbh: '100', height: '35', species: 'trop' } },
    { label: 'Young birch', values: { dbh: '15', height: '12', species: 'hard' } }
    ],
  compute: (v) => { const dbh = parseFloat(v.dbh); const trees = parseInt(v.trees)||1; const plotArea = parseFloat(v.area)||1; const baPerTree = Math.PI * (dbh/200)**2; const totalBA = baPerTree * trees; const baPerHa = totalBA / plotArea; return { result: baPerHa, label: 'Basal Area', unit: 'm²/ha', steps: [{ label: 'DBH', value: `${dbh} cm` }, { label: 'BA per tree', value: `${baPerTree.toFixed(4)} m²` }, { label: 'Trees', value: `${trees}` }, { label: 'Plot area', value: `${plotArea} ha` }, { label: 'BA per ha', value: `${baPerHa.toFixed(2)} m²/ha` }] ,
    extras: [
      { label: "Environmental Context", value: "Forest biomass is a key carbon pool and indicator of ecosystem productivity. Trees store ~80% of terrestrial aboveground carbon." },
      { label: "Measurement Method", value: "Allometric equations based on DBH, height, and wood density. Species-specific parameters from published pantropical or regional models." },
      { label: "Conservation Note", value: "Old-growth forests contain 30-70% more biomass than logged or secondary forests. Reducing deforestation is the most effective forest-based climate solution." },
      { label: "Typical Ranges", value: "Tropical: 200-500 Mg/ha AGB. Temperate hardwoods: 100-300 Mg/ha. Boreal: 50-150 Mg/ha. Wood density: 0.3-0.9 g/cm³." },
      { label: "Related Concepts", value: "Forest inventory, stand density management, bioenergy, REDD+ MRV, carbon stock assessment, reduced-impact logging." }
    ]} },
  description: 'Basal area is the cross-sectional area of tree stems at breast height (1.3 m) per unit land area, a key measure of forest density and biomass.',
  formula: 'BA = π × (DBH/200)² | BA/ha = Σ(BA) / plot area (ha)',
  interpretation: 'BA = πr² in m². BA/ha is the sum of individual tree basal areas per hectare. Tropical forests: 20-40 m²/ha. Temperate: 15-35 m²/ha.'
}

export default calcDef
