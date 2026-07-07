import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ dbh: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), trees: z.string().optional(), area: z.string().optional() }),
  fields: [
    { name: 'dbh', label: 'Average DBH (cm)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'trees', label: 'Number of trees (optional)', type: 'number', min: 1, step: '1' },
    { name: 'area', label: 'Plot area (ha, optional)', type: 'number', min: 0.01, step: '0.01' },
  ],
  compute: (v) => { const dbh = parseFloat(v.dbh); const trees = parseInt(v.trees)||1; const plotArea = parseFloat(v.area)||1; const baPerTree = Math.PI * (dbh/200)**2; const totalBA = baPerTree * trees; const baPerHa = totalBA / plotArea; return { result: baPerHa, label: 'Basal Area', unit: 'm²/ha', steps: [{ label: 'DBH', value: `${dbh} cm` }, { label: 'BA per tree', value: `${baPerTree.toFixed(4)} m²` }, { label: 'Trees', value: `${trees}` }, { label: 'Plot area', value: `${plotArea} ha` }, { label: 'BA per ha', value: `${baPerHa.toFixed(2)} m²/ha` }] } },
  description: 'Basal area is the cross-sectional area of tree stems at breast height (1.3 m) per unit land area, a key measure of forest density and biomass.',
  formula: 'BA = π × (DBH/200)² | BA/ha = Σ(BA) / plot area (ha)',
  interpretation: 'BA = πr² in m². BA/ha is the sum of individual tree basal areas per hectare. Tropical forests: 20-40 m²/ha. Temperate: 15-35 m²/ha.'
}

export default calcDef
